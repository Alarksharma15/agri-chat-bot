# 🌾 Agriculture Advisor Chatbot - Setup Guide

Congratulations! Your Japanese voice-enabled agriculture weather chatbot is ready. This guide will help you get it up and running.

## 📋 What Has Been Built

A complete Next.js application with:

### ✅ Backend (API Routes)
- **`/api/transcribe`** - Groq Whisper API for Japanese speech-to-text
- **`/api/weather`** - OpenWeather API integration for current weather and forecasts
- **`/api/chat`** - Groq Llama 3.3 70B for AI-powered agricultural advice

### ✅ Frontend (React Components)
- **VoiceRecorder** - Browser-based audio recording with visual feedback
- **WeatherCard** - Beautiful weather display with 5-day forecast
- **ChatInterface** - Conversational UI with message history

### ✅ Features
- 🎤 Japanese voice input using MediaRecorder API
- 🌤️ Real-time weather data and 5-day forecasts
- 🤖 AI-powered agricultural recommendations
- 📱 Fully responsive design
- 🌓 Dark mode support
- ⚡ Streaming AI responses
- 🎨 Modern, polished UI with Tailwind CSS

## 🚀 Quick Start

### Step 1: Get Your API Keys

#### Groq API Key (Required)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

#### OpenWeather API Key (Required)
1. Visit [OpenWeather](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to [API Keys](https://home.openweathermap.org/api_keys)
4. Copy your default API key or create a new one
5. Note: It may take a few minutes to activate

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your API keys:
```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
OPENWEATHER_API_KEY=your_actual_openweather_key_here
```

⚠️ **Important**: Never commit `.env.local` to version control!

### Step 3: Run the Application

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

### First Time Setup
1. **Set Location**: Click "場所を変更" (Change Location) button in the header
2. **Enter City**: Type a city name (e.g., "Tokyo", "Osaka", "Sapporo")
3. **Load Weather**: Click "更新" (Update) to fetch weather data

### Using Voice Input
1. **Allow Microphone**: Your browser will ask for microphone permission - click "Allow"
2. **Start Recording**: Click the green microphone button
3. **Speak in Japanese**: Ask your agriculture question clearly
4. **Stop Recording**: Click the red square button
5. **Get AI Response**: The audio will be transcribed and the AI will respond

### Sample Questions (in Japanese)

```
今日は種まきに適していますか？
(Is today suitable for sowing seeds?)

この天気で灌漑は必要ですか？
(Do I need irrigation in this weather?)

明日の天気で外作業はできますか？
(Can I work outside in tomorrow's weather?)

今週は害虫対策が必要ですか？
(Do I need pest control this week?)

この湿度で収穫しても大丈夫ですか？
(Is it okay to harvest in this humidity?)
```

## 🔧 Technical Details

### Project Structure
```
app/
├── api/
│   ├── transcribe/route.ts    # Whisper transcription
│   ├── weather/route.ts        # Weather data fetching
│   └── chat/route.ts           # AI chat responses
├── components/
│   ├── VoiceRecorder.tsx       # Audio recording UI
│   ├── WeatherCard.tsx         # Weather display
│   └── ChatInterface.tsx       # Chat messages
├── lib/
│   └── types.ts                # TypeScript types
├── page.tsx                    # Main application
└── globals.css                 # Styles
```

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI Provider**: Groq (Whisper + Llama 3.3 70B)
- **Weather**: OpenWeather API
- **Audio**: Browser MediaRecorder API

### API Models Used
- **Speech-to-Text**: `whisper-large-v3` with Japanese language support
- **Text Generation**: `llama-3.3-70b-versatile` for high-quality responses
- **Weather**: OpenWeather Current Weather + 5 Day Forecast

## 🐛 Troubleshooting

### "Microphone not accessible"
- **Solution**: Use HTTPS or localhost (required by browsers)
- Check browser permissions: Settings → Site Settings → Microphone
- Try refreshing the page
- Ensure no other app is using the microphone

### "Failed to fetch weather data"
- **Solution**: Check your OpenWeather API key is correct
- Verify the city name (English names work best)
- Free tier limits: 60 calls/minute, 1000 calls/day
- New API keys may take 10-15 minutes to activate

### "Transcription failed"
- **Solution**: Verify your Groq API key is set correctly
- Ensure you're speaking clearly in Japanese
- Check the recording worked (red pulsing button during recording)
- Try recording for at least 2-3 seconds

### "AI response is empty"
- **Solution**: Check your Groq API key
- Verify internet connection
- Check browser console for errors (F12)
- Try refreshing the page

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 🌐 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full support | Recommended |
| Edge | ✅ Full support | Chromium-based |
| Firefox | ✅ Full support | - |
| Safari | ✅ Full support | Requires HTTPS/localhost |
| Mobile Chrome | ✅ Full support | - |
| Mobile Safari | ✅ Full support | iOS 14.3+ |

## 📱 Mobile Usage

The app works great on mobile! Tips:
- Use landscape mode for better layout
- Grant microphone permissions when prompted
- Speak clearly and close to the microphone
- Stable internet connection recommended

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub (without `.env.local`)
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GROQ_API_KEY`
   - `OPENWEATHER_API_KEY`
4. Deploy!

### Deploy to Other Platforms

Requirements:
- Node.js 18+
- Support for Next.js App Router
- Environment variable configuration
- HTTPS (for microphone access)

## 📊 API Usage & Costs

### Groq (Free Tier)
- **Whisper**: 600 free requests/minute
- **Llama 3.3 70B**: $0.59/M input tokens, $0.79/M output tokens
- Very generous free tier for development

### OpenWeather (Free Tier)
- 60 calls/minute
- 1,000,000 calls/month
- Current weather + 5-day forecast included

## 🎨 Customization Ideas

### Change the Theme
Edit the system prompt in `app/api/chat/route.ts` to change from agriculture to:
- Fashion recommendations
- Travel suggestions
- Outdoor activities
- Sports advice
- Music event planning

### Add More Languages
Modify the `language` parameter in `/api/transcribe/route.ts`

### Customize UI Colors
Edit Tailwind classes in components for your brand colors

## 📚 Additional Resources

- [Groq Documentation](https://console.groq.com/docs)
- [OpenWeather API Docs](https://openweathermap.org/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## 💡 Tips for Best Results

1. **Speak Naturally**: The AI understands conversational Japanese
2. **Be Specific**: Mention specific crops or farming activities
3. **Ask Follow-ups**: The weather context is maintained in the conversation
4. **Try Different Locations**: Compare advice for different climates
5. **Use Clear Audio**: Minimize background noise for better transcription

## 🤝 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify all environment variables are set
3. Check the browser console (F12) for errors
4. Ensure API keys are valid and have quota remaining

---

**Happy Farming! 🌾**

Built with ❤️ using Groq, OpenWeather, and Next.js

