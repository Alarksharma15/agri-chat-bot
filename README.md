# 農業アドバイザー (Agriculture Advisor Chatbot)

A Next.js-based conversational chatbot with Japanese voice support that provides AI-powered agricultural advice using Groq's Llama 3.3 70B and OpenWeather API.

## Features

- 💬 **Conversational Interface**: Natural chat experience - just ask about weather in any city
- 🎤 **Japanese Voice Input**: Record your questions in Japanese using the browser's MediaRecorder API
- ⌨️ **Text Input**: Type your questions in Japanese or English
- 🌍 **Automatic Location Detection**: Bot extracts city names from your questions automatically
- 🌤️ **Real-time Weather**: Fetches current weather and 5-day forecasts from OpenWeather API
- 🤖 **AI-Powered Advice**: Contextual agricultural recommendations from Llama 3.3 70B
- 🌾 **Agriculture Focus**: Specialized advice for farming, crop management, irrigation, and planting
- 🌐 **Bilingual UI**: Toggle between Japanese and English interface languages
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌓 **Dark Mode**: Automatic dark mode support based on system preferences

## How It Works

1. **User asks naturally**: "What's the weather in Tokyo?" or "京都の天気はどうですか？"
2. **Bot extracts location**: Automatically detects "Tokyo" or "京都" from your question
3. **Fetches weather**: Gets real-time weather data if it's a weather-related query
4. **AI responds**: Provides agricultural advice based on weather conditions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI/ML**:
  - Groq Whisper (large-v3) for Japanese speech-to-text
  - Groq Llama 3.3 70B Versatile for AI responses
- **Weather API**: OpenWeather API
- **SDK**: Vercel AI SDK with Groq provider

## Prerequisites

Before you begin, ensure you have:

1. Node.js 18+ installed
2. A Groq API key (get one from [Groq Console](https://console.groq.com/))
3. An OpenWeather API key (get one from [OpenWeather](https://openweathermap.org/api))

## Installation

1. Clone the repository:
```bash
cd assignment-next
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```
GROQ_API_KEY=your_groq_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

## Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Text Input
1. Click **"Text Input"** button (default mode)
2. Type your question about weather in any city
3. Press Enter or click Send
4. Get AI-powered agricultural advice!

### Voice Input
1. Click **"Voice Input"** button to switch modes
2. Click the green microphone button to start recording
3. Speak your question in Japanese
4. Click again to stop recording
5. Audio will be automatically transcribed and processed

### Language Toggle
- Click the **EN/JP** button in the header to switch UI language
- Chat responses will be in the language you speak (Japanese or English)

## Example Questions

### English
```
What's the weather in Tokyo?
Should I plant rice in Kyoto today?
Is it good for irrigation in Osaka?
Will it rain in Sapporo tomorrow?
```

### Japanese
```
東京の天気はどうですか？
京都で今日種まきをすべきですか？
大阪で灌漑が必要ですか？
札幌で明日雨が降りますか？
```

## Project Structure

```
app/
├── api/
│   ├── transcribe/route.ts    # Groq Whisper transcription endpoint
│   ├── weather/route.ts        # OpenWeather API integration (legacy)
│   └── chat/route.ts           # Groq Llama 3.3 with location extraction & weather
├── components/
│   ├── InputArea.tsx           # Text/Voice input with mode toggle
│   └── ChatInterface.tsx       # Chat message display
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── translations.ts         # UI translations (EN/JP)
│   └── locationExtractor.ts    # Extract cities from messages
├── page.tsx                    # Main application page
└── globals.css                 # Global styles
```

## API Endpoints

### POST /api/transcribe
Transcribes Japanese audio to text using Groq Whisper.

**Request**: FormData with audio file
**Response**: `{ text: string }`

### POST /api/chat
Generates AI responses with automatic location detection and weather fetching.

**Request**: 
```json
{
  "message": "string"
}
```
**Response**: Streaming text response

**Features**:
- Automatically extracts location from message
- Fetches weather if it's a weather-related query
- Provides context-aware agricultural advice

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for Whisper and Llama access | Yes |
| `OPENWEATHER_API_KEY` | Your OpenWeather API key | Yes |

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (requires HTTPS or localhost)
- Mobile browsers: ✅ Supported with microphone permission

**Note**: Voice recording requires HTTPS in production or localhost for development.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- Environment variables
- API routes

## Troubleshooting

### Microphone not working
- Check browser permissions for microphone access
- Ensure you're using HTTPS or localhost
- Try refreshing the page

### Transcription fails
- Verify your Groq API key is correct
- Check that you're speaking clearly in Japanese
- Ensure audio is being recorded (red pulsing button)

### Weather data not loading
- Check if your message mentions a city name
- Verify your OpenWeather API key is correct
- Try using common city names (Tokyo, Osaka, etc.)

### AI responses are slow
- Groq provides fast inference, but network speed matters
- Check your internet connection
- Responses stream in real-time

## Features in Detail

### Automatic Location Detection
The chatbot automatically detects city names from your questions in both English and Japanese:
- Supports major Japanese cities (Tokyo, Osaka, Kyoto, etc.)
- Supports international cities
- Works with various question formats

### Weather Integration
When you ask about weather:
1. Location is extracted from your question
2. Current weather is fetched
3. 5-day forecast is retrieved
4. AI uses this data to provide contextual advice

### Bilingual Support
- **UI Language**: Toggle between English and Japanese
- **Chat Language**: Bot responds in the language you use
- All interface elements are translated

## License

This project is created for educational purposes.

## Credits

- **Groq**: For ultra-fast AI inference
- **OpenWeather**: For weather data
- **Vercel**: For the AI SDK and Next.js framework
