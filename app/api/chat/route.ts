import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import axios from 'axios';
import { extractLocation, isWeatherQuery } from '@/app/lib/locationExtractor';
import type { WeatherData, OpenWeatherCurrentResponse, OpenWeatherForecastResponse, ForecastDay } from '@/app/lib/types';

function getGroqProvider() {
  return createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY || '',
  });
}

const AGRICULTURE_SYSTEM_PROMPT = `あなたは日本の農業専門家です。ユーザーに農業や農作物に関するアドバイスを提供します。

役割:
- 現在の天気と予報データに基づいて、農業活動に関する実用的なアドバイスを提供する
- 作物の栽培スケジュール、灌漑の提案、害虫管理、収穫のタイミングなどをアドバイスする
- 天候条件が農作物にどのように影響するかを説明する
- 気象パターンに基づいた最適な農作業のタイミングを推奨する

ガイドライン:
- ユーザーが日本語で話しかけた場合は日本語で、英語で話しかけた場合は英語で返答する
- 天気データを考慮に入れた具体的で実用的なアドバイスを提供する
- 農家や家庭菜園をする人に役立つ情報を共有する
- 温度、湿度、風速、降水量などの気象要因を考慮する
- 季節に応じた適切な作物や活動を提案する
- 親しみやすく、分かりやすい言葉で説明する`;

async function fetchWeatherData(city: string): Promise<WeatherData | null> {
  try {
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

    if (!OPENWEATHER_API_KEY) {
      console.error('OpenWeather API key not configured');
      return null;
    }

    const weatherParams = {
      q: city,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'ja',
    };

    // Fetch current weather
    const currentWeatherResponse = await axios.get<OpenWeatherCurrentResponse>(
      `${OPENWEATHER_BASE_URL}/weather`,
      { params: weatherParams }
    );

    const current = currentWeatherResponse.data;

    // Fetch 5-day forecast
    const forecastResponse = await axios.get<OpenWeatherForecastResponse>(
      `${OPENWEATHER_BASE_URL}/forecast`,
      { params: weatherParams }
    );

    // Process forecast data
    const forecastData: ForecastDay[] = [];
    const processedDates = new Set<string>();

    forecastResponse.data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const hour = date.getHours();

      if (
        !processedDates.has(dateStr) &&
        hour >= 11 &&
        hour <= 13 &&
        forecastData.length < 5
      ) {
        processedDates.add(dateStr);
        forecastData.push({
          date: dateStr,
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        });
      }
    });

    return {
      location: current.name,
      country: current.sys.country,
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      forecast: forecastData,
    };
  } catch (error: any) {
    console.error('Weather fetch error:', error.response?.data || error.message);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💬 [Chat API] Chat endpoint called');

    if (!process.env.GROQ_API_KEY) {
      console.error('❌ [Chat API] GROQ_API_KEY is not configured');
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message } = body as { message: string };

    console.log('📝 [Chat API] Received message:', message);

    if (!message) {
      console.error('❌ [Chat API] No message provided');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const groq = getGroqProvider();
    let contextMessage = message;
    let weatherData: WeatherData | null = null;

    // Extract location from message
    const location = extractLocation(message);
    console.log('📍 [Chat API] Extracted location:', location);
    
    const isWeatherQ = isWeatherQuery(message);
    console.log('🌤️ [Chat API] Is weather query:', isWeatherQ);
    
    // If location found and it's a weather query, fetch weather data
    if (location && isWeatherQ) {
      console.log('🔍 [Chat API] Fetching weather for:', location);
      weatherData = await fetchWeatherData(location);
      if (weatherData) {
        console.log('✅ [Chat API] Weather data fetched:', weatherData.location);
      } else {
        console.warn('⚠️ [Chat API] Failed to fetch weather data');
      }
    }

    // Build context with weather data if available
    if (weatherData) {
      const forecastSummary = weatherData.forecast
        ? weatherData.forecast
            .map(
              (day) =>
                `${day.date}: ${day.tempMin}°C〜${day.tempMax}°C, ${day.description}, 湿度${day.humidity}%, 風速${day.windSpeed}m/s`
            )
            .join('\n')
        : '';

      contextMessage = `現在の天気情報:
場所: ${weatherData.location}, ${weatherData.country}
気温: ${weatherData.temperature}°C (体感温度: ${weatherData.feelsLike}°C)
湿度: ${weatherData.humidity}%
風速: ${weatherData.windSpeed} m/s
天候: ${weatherData.description}

5日間の予報:
${forecastSummary}

ユーザーの質問: ${message}`;
    }

    console.log('🤖 [Chat API] Calling Llama 3.3 70B...');

    // Stream response from Groq Llama 3.3 70b
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: AGRICULTURE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: contextMessage,
        },
      ],
      temperature: 0.7,
    });

    console.log('✅ [Chat API] Streaming response started');

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('❌ [Chat API] Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
