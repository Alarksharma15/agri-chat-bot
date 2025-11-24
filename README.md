# 農業アドバイザー (Agriculture Advisor Chatbot)

A Next.js-based Japanese voice-enabled weather chatbot that provides AI-powered agricultural advice using Groq's Llama 3.3 70B and OpenWeather API.

## Features

- 🎤 **Japanese Voice Input**: Record your questions in Japanese using the browser's MediaRecorder API
- 🌤️ **Real-time Weather Data**: Get current weather and 5-day forecasts from OpenWeather API
- 🤖 **AI-Powered Advice**: Receive contextual agricultural recommendations from Llama 3.3 70B
- 🌾 **Agriculture Focus**: Get suggestions for farming, crop management, irrigation, and planting schedules
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌓 **Dark Mode**: Automatic dark mode support based on system preferences

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

1. **Set Location**: Click the "場所を変更" (Change Location) button to set your location (default: Tokyo)

2. **Load Weather**: Click "天気を取得" (Get Weather) to fetch current weather and forecast data

3. **Voice Input**: 
   - Click the green microphone button to start recording
   - Speak your question in Japanese
   - Click again to stop recording
   - The audio will be automatically transcribed and sent to the AI

4. **Get Advice**: The AI will analyze the weather data and provide agricultural recommendations in Japanese

## Example Questions (in Japanese)

- "今日は種まきに適していますか？" (Is today suitable for sowing?)
- "この天気で灌漑は必要ですか？" (Do I need irrigation in this weather?)
- "明日の天気で外作業はできますか？" (Can I work outside in tomorrow's weather?)
- "今週は害虫対策が必要ですか？" (Do I need pest control this week?)

## Project Structure

```
app/
├── api/
│   ├── transcribe/route.ts    # Groq Whisper transcription endpoint
│   ├── weather/route.ts        # OpenWeather API integration
│   └── chat/route.ts           # Groq Llama 3.3 chat endpoint
├── components/
│   ├── VoiceRecorder.tsx       # Voice recording component
│   ├── ChatInterface.tsx       # Chat message display
│   └── WeatherCard.tsx         # Weather information display
├── lib/
│   └── types.ts                # TypeScript type definitions
├── page.tsx                    # Main application page
└── globals.css                 # Global styles
```

## API Endpoints

### POST /api/transcribe
Transcribes Japanese audio to text using Groq Whisper.

**Request**: FormData with audio file
**Response**: `{ text: string }`

### GET /api/weather
Fetches weather data from OpenWeather API.

**Query Parameters**: 
- `city`: City name (e.g., "Tokyo", "Osaka")
- OR `lat` & `lon`: Coordinates

**Response**: `{ data: WeatherData }`

### POST /api/chat
Generates AI responses using Llama 3.3 70B.

**Request**: 
```json
{
  "message": "string",
  "weatherData": "WeatherData | null"
}
```
**Response**: Streaming text response

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
- Verify your OpenWeather API key is correct
- Check that the location name is correct (English names work best)
- Free tier has 60 calls/minute limit

### AI responses are slow
- Groq provides fast inference, but network speed matters
- Check your internet connection
- Responses stream in real-time

## License

This project is created for educational purposes.

## Credits

- **Groq**: For ultra-fast AI inference
- **OpenWeather**: For weather data
- **Vercel**: For the AI SDK and Next.js framework
