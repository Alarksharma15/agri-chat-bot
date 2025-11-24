// Weather API Types
export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast?: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

// Chat Message Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  weather?: WeatherData;
}

// API Response Types
export interface TranscriptionResponse {
  text: string;
  error?: string;
}

export interface WeatherResponse {
  data?: WeatherData;
  error?: string;
}

export interface ChatResponse {
  response: string;
  error?: string;
}

// OpenWeather API Raw Response Types
export interface OpenWeatherCurrentResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    dt_txt: string;
    main: {
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

