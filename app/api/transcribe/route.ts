import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 [API] Transcribe endpoint called');

    if (!process.env.GROQ_API_KEY) {
      console.error('❌ [API] GROQ_API_KEY is not configured');
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    console.log('✅ [API] GROQ_API_KEY is configured');

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log('📥 [API] Parsing form data...');
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      console.error('❌ [API] No audio file in form data');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('📦 [API] Audio file received:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Convert File to Buffer for Groq API
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('🔄 [API] Converted to buffer:', buffer.length, 'bytes');

    // Create a File-like object that Groq SDK expects
    const file = new File([buffer], audioFile.name || 'audio.webm', {
      type: audioFile.type || 'audio/webm',
    });

    console.log('🤖 [API] Calling Groq Whisper API...');
    console.log('📝 [API] Model: whisper-large-v3, Language: ja');

    // Transcribe using Groq Whisper with Japanese language
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: 'whisper-large-v3',
      language: 'ja', // Japanese language code
      response_format: 'json',
    });

    console.log('✅ [API] Transcription successful:', transcription.text);

    return NextResponse.json({
      text: transcription.text,
    });
  } catch (error: any) {
    console.error('❌ [API] Transcription error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...(error.response && { response: error.response }),
    });
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

