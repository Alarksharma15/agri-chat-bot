import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import type {
  WeatherData,
  ForecastDay,
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
} from '@/app/lib/types';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  try {
    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENWEATHER_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!city && (!lat || !lon)) {
      return NextResponse.json(
        { error: 'Please provide city name or coordinates (lat/lon)' },
        { status: 400 }
      );
    }

    // Build query parameters
    let weatherParams: any = {
      appid: OPENWEATHER_API_KEY,
      units: 'metric', // Celsius
      lang: 'ja', // Japanese descriptions
    };

    if (city) {
      weatherParams.q = city;
    } else {
      weatherParams.lat = lat;
      weatherParams.lon = lon;
    }

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

    // Process forecast data - get one forecast per day (noon)
    const forecastData: ForecastDay[] = [];
    const processedDates = new Set<string>();

    forecastResponse.data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const hour = date.getHours();

      // Get forecast around noon (12:00) for each day, limit to 5 days
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

    const weatherData: WeatherData = {
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

    return NextResponse.json({ data: weatherData });
  } catch (error: any) {
    console.error('Weather API error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          'Failed to fetch weather data. Please check the location.',
      },
      { status: error.response?.status || 500 }
    );
  }
}

