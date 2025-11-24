'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import type { Language } from '@/app/lib/translations';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  language: Language;
  translations: any;
}

export default function InputArea({
  onSendMessage,
  disabled = false,
  language,
  translations: t,
}: InputAreaProps) {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleSendText = () => {
    if (textInput.trim() && !disabled) {
      onSendMessage(textInput.trim());
      setTextInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendAudioToServer(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(t.errorMicrophone);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      if (data.text) {
        onSendMessage(data.text);
      } else if (data.error) {
        alert(`${t.errorTranscription}: ${data.error}`);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert(t.errorTranscription);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              inputMode === 'text'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t.switchToText}
          </button>
          <button
            onClick={() => setInputMode('voice')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              inputMode === 'voice'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t.switchToVoice}
          </button>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.textInputPlaceholder}
              disabled={disabled}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendText}
              disabled={disabled || !textInput.trim()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed flex items-center gap-2"
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {t.sendButton}
            </button>
          </div>
        )}

        {/* Voice Input Mode */}
        {inputMode === 'voice' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || isProcessing}
              className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-green-600 hover:bg-green-700'
              } ${
                disabled || isProcessing
                  ? 'opacity-50 cursor-not-allowed'
                  : 'shadow-lg hover:shadow-xl'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isProcessing ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isRecording ? (
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              ) : (
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <div className="text-center">
              {isProcessing ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.processingButton}
                </p>
              ) : isRecording ? (
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                  {t.recordingButton}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.voiceInputPlaceholder}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

