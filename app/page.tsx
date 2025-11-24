'use client';

import { useState, useCallback } from 'react';
import ChatInterface from './components/ChatInterface';
import InputArea from './components/InputArea';
import type { Message } from './lib/types';
import type { Language } from './lib/translations';
import { useTranslation } from './lib/translations';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [language, setLanguage] = useState<Language>('ja');
  
  const t = useTranslation(language);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ja' ? 'en' : 'ja');
  };

  const sendMessageToAI = useCallback(
    async (userMessage: string) => {
      console.log('📨 [Main] Sending message to AI:', userMessage);

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
        console.log('📤 [Main] Fetching /api/chat...');
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        });

        console.log('📥 [Main] Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('❌ [Main] Chat request failed:', errorData);
          throw new Error('Chat request failed: ' + (errorData.error || response.statusText));
        }

        // Read the streaming response
        console.log('📖 [Main] Reading streaming response...');
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';

        if (!reader) {
          console.error('❌ [Main] No reader available from response.body');
          throw new Error('No response body reader');
        }

        console.log('✅ [Main] Starting stream...');
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('✅ [Main] Stream complete! Total response length:', aiResponse.length);
            break;
          }

          // Decode the chunk - toTextStreamResponse sends plain text
          const chunk = decoder.decode(value, { stream: true });
          aiResponse += chunk;
          console.log('📝 [Main] Received:', chunk);
        }

        console.log('💬 [Main] AI Response:', aiResponse.substring(0, 100) + '...');

        // Add AI response message
        const aiMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse || t.errorChat,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessageObj]);
      } catch (error) {
        console.error('❌ [Main] Chat error:', error);
        
        // Add error message
        const errorMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: t.errorChat + (error instanceof Error ? ': ' + error.message : ''),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessageObj]);
      } finally {
        setIsLoadingChat(false);
      }
    },
    [t]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
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
                {t.appTitle}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            aria-label="Toggle language"
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
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            {language === 'ja' ? 'EN' : 'JP'}
          </button>
        </div>
      </header>

      {/* Main Content - Chat Interface */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={messages}
            isLoading={isLoadingChat}
            language={language}
            translations={t}
          />
        </div>

        {/* Input Area */}
        <InputArea
          onSendMessage={sendMessageToAI}
          disabled={isLoadingChat}
          language={language}
          translations={t}
        />
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50">
        <p>{t.poweredBy}</p>
      </footer>
    </div>
  );
}
