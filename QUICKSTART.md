# 🚀 Quick Start Guide

Get your Agriculture Advisor Chatbot running in 5 minutes!

## ✅ Prerequisites Checklist

Before you start, make sure you have:
- [ ] Node.js 18+ installed ([Download here](https://nodejs.org/))
- [ ] A Groq API key ([Get it here](https://console.groq.com/))
- [ ] An OpenWeather API key ([Get it here](https://openweathermap.org/api))

## 📝 Step-by-Step Setup

### 1. Install Dependencies (Already Done ✓)
The project dependencies are already installed!

### 2. Configure API Keys

Create a `.env.local` file:
```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and add your keys:
```env
GROQ_API_KEY=gsk_your_actual_groq_key_here
OPENWEATHER_API_KEY=your_actual_openweather_key_here
```

### 3. Start the Server

```bash
npm run dev
```

### 4. Open the App

Navigate to: **http://localhost:3000**

## 🎯 First Use

1. **Set Location**
   - Click "場所を変更" (Change Location) button
   - Enter a city name (e.g., "Tokyo")
   - Click "更新" (Update)

2. **Record Your Voice**
   - Click the green microphone button
   - Allow microphone access when prompted
   - Speak in Japanese: "今日は種まきに適していますか？"
   - Click to stop recording

3. **Get AI Advice**
   - Your speech will be transcribed automatically
   - The AI will analyze the weather and respond
   - Continue the conversation naturally!

## 📱 Testing Tips

### Sample Japanese Questions
```
今日は種まきに適していますか？
(Is today suitable for sowing?)

この天気で灌漑は必要ですか？
(Do I need irrigation in this weather?)

明日の天気で外作業はできますか？
(Can I work outside tomorrow?)
```

### If Something Goes Wrong

**Microphone not working?**
- Check browser permissions (usually a camera icon in address bar)
- Make sure you're on `localhost` or `https://`
- Try refreshing the page

**Weather not loading?**
- Verify your OpenWeather API key
- Wait 10-15 minutes if it's a brand new key
- Try a different city name

**AI not responding?**
- Check your Groq API key
- Look at the browser console (F12) for error messages
- Make sure you have internet connection

## 🎨 What You'll See

1. **Header** - App title and location controls
2. **Weather Card** - Current weather and 5-day forecast
3. **Voice Recorder** - Big green microphone button
4. **Chat Interface** - Your conversation with the AI

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Detailed Setup Guide**: See `SETUP_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't hear recording | That's normal! Only transcription is shown |
| Transcription is wrong | Speak clearly and slowly |
| Weather shows error | Check API key and city name |
| AI takes time | First response may be slower, be patient |

## ✨ Pro Tips

- Use Chrome or Edge for best compatibility
- Speak naturally in Japanese
- Ask specific questions about crops and farming
- Check weather data first before asking questions
- The AI remembers the weather context automatically

---

**That's it! You're ready to get agricultural advice! 🌾**

Need help? Check the detailed guides or the browser console for errors.

