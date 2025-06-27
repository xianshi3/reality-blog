"use client";

import React, { useState, useEffect } from "react";

export default function FullscreenChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryMessages = new URLSearchParams(window.location.search).get("messages");
    queryMessages && setMessages(JSON.parse(queryMessages) || []);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    setLoading(true);
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: `AI 回复: ${input}` 
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 pb-24">
        {/* 标题栏 - 优化为更精致的卡片样式 */}
        <div className="relative bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-4">
          <button
            onClick={() => window.history.back()}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-center text-xl font-semibold text-gray-800">AI 全屏对话</h1>
        </div>
        
        {/* 消息区域 - 优化为卡片式布局 */}
        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="bg-gray-100 rounded-full p-6 mb-4 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-center text-lg">和 AI 聊聊技术、生活或任何问题吧！</p>
                <p className="text-gray-400 text-sm mt-2">在下方输入框开始对话</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-4 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${
                    msg.role === "user" 
                      ? "flex flex-col items-end" 
                      : "flex flex-col items-start"
                  }`}>
                    <div className={`
                      px-5 py-3 rounded-2xl text-sm whitespace-pre-line shadow-sm
                      ${msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 px-1">
                      {msg.role === "user" ? "你" : "AI助手"} · {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 固定在底部的输入区域 - 优化为更精致的样式 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3 items-center bg-gray-50 rounded-xl p-2">
            <input
              type="text"
              className="flex-1 border-0 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-0"
              placeholder="输入你的问题..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`bg-blue-500 text-white p-3 rounded-lg shadow-md transition-all duration-200 ${
                loading ? "opacity-50" : "hover:bg-blue-600 active:scale-95"
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}