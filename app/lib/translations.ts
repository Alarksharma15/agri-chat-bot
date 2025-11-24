export type Language = 'en' | 'ja';

export const translations = {
  en: {
    // Header
    appTitle: 'Agriculture Advisor',
    appSubtitle: 'Weather-based farming advice',
    
    // Input Area
    textInputPlaceholder: 'Ask about weather in any city...',
    voiceInputPlaceholder: 'Click microphone to speak',
    sendButton: 'Send',
    recordingButton: 'Recording...',
    processingButton: 'Processing...',
    switchToText: 'Text Input',
    switchToVoice: 'Voice Input',
    
    // Chat Interface
    welcomeTitle: 'Welcome to Agriculture Advisor',
    welcomeMessage: 'Ask me about weather in any city and get farming advice!',
    exampleQuestions: 'Example questions:',
    example1: 'What\'s the weather in Tokyo?',
    example2: 'Should I plant today in Kyoto?',
    example3: 'Do I need irrigation in Osaka?',
    
    // Messages
    thinking: 'Thinking...',
    fetchingWeather: 'Fetching weather data...',
    
    // Errors
    errorMicrophone: 'Failed to access microphone. Please check browser permissions.',
    errorTranscription: 'Failed to transcribe audio. Please try again.',
    errorChat: 'Failed to get response. Please try again.',
    errorGeneric: 'An error occurred. Please try again.',
    
    // Footer
    poweredBy: 'Powered by Groq (Llama 3.3 70B + Whisper) & OpenWeather API',
  },
  ja: {
    // Header
    appTitle: '農業アドバイザー',
    appSubtitle: '天気に基づく農業アドバイス',
    
    // Input Area
    textInputPlaceholder: 'どの都市の天気についても質問してください...',
    voiceInputPlaceholder: 'マイクをクリックして話してください',
    sendButton: '送信',
    recordingButton: '録音中...',
    processingButton: '処理中...',
    switchToText: 'テキスト入力',
    switchToVoice: '音声入力',
    
    // Chat Interface
    welcomeTitle: '農業アドバイザーへようこそ',
    welcomeMessage: 'どの都市の天気についても質問して、農業アドバイスを受けてください！',
    exampleQuestions: '質問例：',
    example1: '東京の天気はどうですか？',
    example2: '京都で今日種まきをすべきですか？',
    example3: '大阪で灌漑が必要ですか？',
    
    // Messages
    thinking: '考え中...',
    fetchingWeather: '天気データを取得中...',
    
    // Errors
    errorMicrophone: 'マイクへのアクセスに失敗しました。ブラウザの設定を確認してください。',
    errorTranscription: '音声の文字起こしに失敗しました。もう一度お試しください。',
    errorChat: '応答の取得に失敗しました。もう一度お試しください。',
    errorGeneric: 'エラーが発生しました。もう一度お試しください。',
    
    // Footer
    poweredBy: 'Powered by Groq (Llama 3.3 70B + Whisper) & OpenWeather API',
  },
};

export function useTranslation(lang: Language) {
  return translations[lang];
}

