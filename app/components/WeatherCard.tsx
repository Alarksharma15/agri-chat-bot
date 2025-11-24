'use client';

import type { WeatherData } from '@/app/lib/types';

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900 rounded-2xl shadow-xl p-6 text-white">
      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">
            {weather.location}, {weather.country}
          </h2>
          <p className="text-xl capitalize opacity-90">{weather.description}</p>
        </div>
        <div className="text-center">
          <img
            src={getWeatherIconUrl(weather.icon)}
            alt={weather.description}
            className="w-24 h-24"
          />
          <p className="text-5xl font-bold">{weather.temperature}°C</p>
          <p className="text-sm opacity-75">体感 {weather.feelsLike}°C</p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          <div>
            <p className="text-xs opacity-75">湿度</p>
            <p className="text-lg font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <div>
            <p className="text-xs opacity-75">風速</p>
            <p className="text-lg font-semibold">{weather.windSpeed} m/s</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            5日間の予報
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
              >
                <p className="text-xs font-medium mb-1">
                  {formatDate(day.date)}
                </p>
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt={day.description}
                  className="w-12 h-12 mx-auto"
                />
                <p className="text-sm font-semibold">
                  {Math.round(day.tempMax)}°
                </p>
                <p className="text-xs opacity-75">{Math.round(day.tempMin)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

