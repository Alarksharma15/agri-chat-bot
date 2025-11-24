'use client';

import { useState, useCallback } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import ChatInterface from './components/ChatInterface';
import WeatherCard from './components/WeatherCard';
import type { Message, WeatherData } from './lib/types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('Tokyo');
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const fetchWeather = useCallback(async (locationQuery: string) => {
    setIsLoadingWeather(true);
    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(locationQuery)}`
      );
      const data = await response.json();

      if (data.error) {
        alert(`天気データの取得に失敗しました: ${data.error}`);
        return null;
      }

      setWeather(data.data);
      return data.data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      alert('天気データの取得中にエラーが発生しました。');
      return null;
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  const sendMessageToAI = useCallback(
    async (userMessage: string, weatherData: WeatherData | null) => {
      // Add user message
      const userMessageObj: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessageObj]);

      setIsLoadingChat(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            weatherData: weatherData,
          }),
        });

        if (!response.ok) {
          throw new Error('Chat request failed');
        }

        // Read the streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('0:')) {
                // Extract the text content from the data stream
                const jsonStr = line.substring(2);
                try {
                  const parsed = JSON.parse(jsonStr);
                  if (typeof parsed === 'string') {
                    aiResponse += parsed;
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }

        // Add AI response message
        const aiMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse || 'エラーが発生しました。',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessageObj]);
      } catch (error) {
        console.error('Chat error:', error);
        alert('AIとの通信中にエラーが発生しました。');
      } finally {
        setIsLoadingChat(false);
      }
    },
    []
  );

  const handleTranscription = useCallback(
    async (text: string) => {
      console.log('Transcribed text:', text);

      // Fetch weather if not already loaded
      let weatherData = weather;
      if (!weatherData) {
        weatherData = await fetchWeather(location);
      }

      // Send message to AI
      if (text.trim()) {
        await sendMessageToAI(text, weatherData);
      }
    },
    [weather, location, fetchWeather, sendMessageToAI]
  );

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchWeather(location);
    setShowLocationInput(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-full p-2">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                農業アドバイザー
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                天気に基づく農業アドバイス
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLocationInput(!showLocationInput)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            場所を変更
          </button>
        </div>

        {/* Location Input */}
        {showLocationInput && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 bg-white/90 dark:bg-gray-800/90">
            <form onSubmit={handleLocationSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="都市名を入力 (例: Tokyo, Osaka)"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoadingWeather}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                >
                  {isLoadingWeather ? '読込中...' : '更新'}
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Weather Card */}
          <div className="lg:col-span-2">
            {weather ? (
              <WeatherCard weather={weather} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  天気データを読み込んでいます
                </h3>
                <button
                  onClick={() => fetchWeather(location)}
                  disabled={isLoadingWeather}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {isLoadingWeather ? '読込中...' : '天気を取得'}
                </button>
              </div>
            )}
          </div>

          {/* Voice Recorder */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
              音声入力
            </h2>
            <VoiceRecorder
              onTranscription={handleTranscription}
              disabled={isLoadingChat || isLoadingWeather}
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
              日本語で話してください
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl min-h-[500px] max-h-[600px] overflow-hidden">
          <ChatInterface messages={messages} isLoading={isLoadingChat} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Powered by Groq (Llama 3.3 70B + Whisper) & OpenWeather API
        </p>
      </footer>
    </div>
  );
}
