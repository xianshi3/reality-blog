"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Message } from '../types/message';

const AVATAR = {
  user: (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
      我
    </div>
  ),
  assistant: (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
      🤖
    </div>
  ),
};

const MessageBubble = ({ message }: { message: Message }) => (
  <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    {message.role === 'assistant' && AVATAR.assistant}
    <div
      className={`max-w-[80%] min-w-[120px] px-4 py-3 rounded-2xl text-sm whitespace-pre-line shadow-sm ${
        message.role === 'user' 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
      }`}
    >
      {message.content}
    </div>
    {message.role === 'user' && AVATAR.user}
  </div>
);

const ChatHeader = ({ onFullscreen, onClose }: { 
  onFullscreen: () => void; 
  onClose: () => void 
}) => (
  <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-[#23272f] dark:to-[#23273f] rounded-t-xl border-b border-gray-200 dark:border-gray-700">
    <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold text-lg">
      <span className="text-xl">🤖</span>AI 对话
    </span>
    <div className="flex gap-2">
      <button
        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 text-xl font-bold transition"
        onClick={onFullscreen}
        aria-label="全屏"
      >
        🔲
      </button>
      <button
        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-xl font-bold transition"
        onClick={onClose}
        aria-label="关闭"
      >
        ×
      </button>
    </div>
  </div>
);

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  loading 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  onSend: () => void; 
  loading: boolean 
}) => (
  <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23272f]">
    <input
      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition-all"
      placeholder="请输入你的问题..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && !loading && onSend()}
      disabled={loading}
    />
    <button
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow disabled:opacity-50 transition-all active:scale-95"
      onClick={onSend}
      disabled={loading}
    >
      {loading ? (
        <span className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          发送中
        </span>
      ) : '发送'}
    </button>
  </div>
);

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 点击外部关闭聊天窗口
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open && 
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[aria-label="打开AI对话"]')
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = res.ok 
        ? await res.json() 
        : { reply: 'AI 服务异常' };

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'AI 服务异常，请稍后再试' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleFullscreen = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.set('messages', JSON.stringify(messages));
    router.push(`/ai-chat/fullscreen?${queryParams.toString()}`);
  }, [messages, router]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* 修改为正方形圆角按钮 */}
      <button
        className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-all focus:outline-none active:scale-95"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="打开AI对话"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {open && (
        <div 
          ref={chatContainerRef}
          className="fixed bottom-24 left-6 w-[380px] max-w-[calc(100vw-48px)] flex flex-col bg-white/95 dark:bg-[#23272f]/95 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg transition-all duration-200 origin-bottom-left"
          style={{
            maxHeight: 'calc(100vh - 120px)',
            height: 'min(600px, 70vh)'
          }}
        >
          <ChatHeader 
            onFullscreen={handleFullscreen} 
            onClose={() => setOpen(false)} 
          />

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm text-center select-none p-8">
                <div className="text-4xl mb-2">🤖</div>
                <p>和 AI 聊聊技术、生活或任何问题吧！</p>
                <p className="text-xs mt-2 text-gray-300 dark:text-gray-500">输入你的问题开始对话</p>
              </div>
            ) : (
              messages.map((message, idx) => (
                <MessageBubble key={idx} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput 
            value={input}
            onChange={setInput}
            onSend={handleSend}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}