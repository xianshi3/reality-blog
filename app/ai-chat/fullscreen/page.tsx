"use client";  // 标记为客户端组件

import React, { useState, useEffect } from "react";

/**
 * 全屏聊天页面组件
 * 该组件实现了一个简单的聊天界面，用户可以输入消息并接收 AI 的回复。
 */
export default function FullscreenChat() {
  const [messages, setMessages] = useState<any[]>([]);  // 存储聊天消息
  const [input, setInput] = useState("");               // 存储用户输入的消息
  const [loading, setLoading] = useState(false);        // 加载状态，用于控制发送消息时的加载动画

  /**
   * 从 URL 查询参数中获取消息内容，并设置到消息列表
   */
  useEffect(() => {
    const queryMessages = new URLSearchParams(window.location.search).get("messages");
    if (queryMessages) {
      try {
        setMessages(JSON.parse(queryMessages));  // 解析 URL 中的消息并设置
      } catch (error) {
        console.error("消息解析失败:", error);  // 错误处理
      }
    }
  }, []);

  /**
   * 处理发送消息
   * 模拟 AI 回复，实际应用中应该调用 API 获取 AI 回复
   */
  const handleSend = async () => {
    if (!input.trim() || loading) return;  // 如果输入为空或正在加载，则不发送消息
    setLoading(true);  // 设置加载状态
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages); 
    setInput(""); 

    // 模拟 AI 回复 (模拟延迟)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `AI 回复: ${input}` },  // AI 的回复
      ]);
      setLoading(false);
    }, 1000); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* 返回按钮 */}
      <button
        onClick={() => window.history.back()}  // 返回上一页
        className="absolute top-4 left-4 text-xl text-gray-600 hover:text-gray-800"
      >
        ← 返回
      </button>
      
      <h1 className="text-center text-2xl font-semibold my-6">AI 全屏对话</h1>
      
      {/* 聊天消息区 */}
      <div className="flex-1 overflow-y-auto pb-16 px-4">
        {/* 如果没有消息，则显示提示语 */}
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm text-center mt-12 select-none">
            和 AI 聊聊技术、生活或任何问题吧！
          </div>
        )}
        {/* 渲染消息 */}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {/* 如果是助手的消息，显示机器人头像 */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                🤖
              </div>
            )}
            {/* 显示消息内容 */}
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm whitespace-pre-line shadow-sm transition-all duration-200 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-md"
                  : "bg-gray-300 text-gray-800 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {/* 如果是用户的消息，显示用户头像 */}
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                我
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 输入区 */}
      <div className="flex gap-2 p-4 border-t border-gray-300 bg-white">
        {/* 用户输入框 */}
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="输入你的问题..."
          value={input}
          onChange={(e) => setInput(e.target.value)}  // 更新输入框内容
          onKeyDown={(e) => e.key === "Enter" && handleSend()}  // 回车键发送消息
        />
        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={loading}  // 如果正在发送消息，则禁用按钮
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "发送中..." : "发送"}  {/* 根据加载状态显示按钮文字 */}
        </button>
      </div>
    </div>
  );
}
