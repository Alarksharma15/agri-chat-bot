import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { WeatherData } from '@/app/lib/types';

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
- すべての回答は日本語で提供する
- 天気データを考慮に入れた具体的で実用的なアドバイスを提供する
- 農家や家庭菜園をする人に役立つ情報を共有する
- 温度、湿度、風速、降水量などの気象要因を考慮する
- 季節に応じた適切な作物や活動を提案する
- 親しみやすく、分かりやすい言葉で説明する`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, weatherData } = body as {
      message: string;
      weatherData?: WeatherData;
    };

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const groq = getGroqProvider();

    // Build context with weather data
    let contextMessage = message;
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

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}

