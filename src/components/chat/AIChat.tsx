"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Message } from "@/types/message";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoSend, IoStop } from "react-icons/io5";
import { RiRobot2Line, RiUserLine } from "react-icons/ri";
import { IoClose, IoExpand } from "react-icons/io5";

const AVATAR = {
  user: (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e5e7eb] dark:bg-[#374151] flex items-center justify-center">
      <RiUserLine className="w-4 h-4 text-[#1f2937] dark:text-[#d1d5db]" />
    </div>
  ),
  assistant: (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#f3f4f6] dark:bg-[#23272f] flex items-center justify-center">
      <RiRobot2Line className="w-4 h-4 text-[#4b5563] dark:text-[#9ca3af]" />
    </div>
  ),
};

const MessageBubble = ({ message }: { message: Message }) => (
  <div
    className={`flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ${
      message.role === "user" ? "justify-end" : "justify-start"
    }`}
  >
    {message.role === "assistant" && AVATAR.assistant}
    <div
      className={`max-w-[70%] px-3 py-2 text-sm shadow-sm ${
        message.role === "user"
          ? "bg-[#2563eb] text-white rounded-2xl rounded-tr-none"
          : "bg-white dark:bg-[#23272f] text-[#374151] dark:text-[#cbd5e1] rounded-2xl rounded-tl-none"
      }`}
    >
      {message.role === "assistant" ? (
        <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#1e1e1e] [&_pre]:p-3 [&_code]:bg-transparent [&_p]:leading-relaxed [&_p]:mb-1 [&_ul]:my-1 [&_ol]:my-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      )}
    </div>
    {message.role === "user" && AVATAR.user}
  </div>
);

const ChatHeader = ({
  onFullscreen,
  onClose,
  onMouseDown,
}: {
  onFullscreen: () => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}) => (
  <div
    className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] cursor-move select-none"
    onMouseDown={onMouseDown}
  >
    <span className="flex items-center gap-2">
      <HiOutlineSparkles className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
      <span className="text-sm font-medium text-[#111827] dark:text-white">
        AI 助手
      </span>
    </span>
    <div className="flex gap-1">
      <button
        onClick={onFullscreen}
        aria-label="全屏"
        className="p-1.5 text-[#6b7280] hover:text-[#2563eb] dark:text-[#9ca3af] dark:hover:text-[#60a5fa] rounded-md hover:bg-white/50 dark:hover:bg-[#374151] transition-colors cursor-pointer"
      >
        <IoExpand className="w-4 h-4" />
      </button>
      <button
        onClick={onClose}
        aria-label="关闭"
        className="p-1.5 text-[#6b7280] hover:text-[#ef4444] dark:text-[#9ca3af] dark:hover:text-[#f87171] rounded-md hover:bg-white/50 dark:hover:bg-[#374151] transition-colors cursor-pointer"
      >
        <IoClose className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const ChatInput = ({
  value,
  onChange,
  onSend,
  onStop,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  loading: boolean;
}) => (
  <div className="flex items-center gap-2 p-3 bg-white dark:bg-[#23272f]">
    <div className="flex-1 flex items-center bg-[#f3f4f6] dark:bg-[#374151] rounded-full px-4 py-1.5">
      <input
        className="flex-1 bg-transparent border-0 outline-none text-sm text-[#1f2937] dark:text-[#f3f4f6] placeholder-[#9ca3af] dark:placeholder-[#6b7280]"
        placeholder="输入消息..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && onSend()}
        disabled={loading}
      />
    </div>
    {loading ? (
      <button
        onClick={onStop}
        className="bg-[#ef4444] text-white rounded-full w-8 h-8 flex items-center justify-center transition-all hover:bg-[#dc2626] active:scale-95"
        title="停止生成"
      >
        <IoStop className="w-4 h-4" />
      </button>
    ) : (
      <button
        className="bg-[#2563eb] text-white rounded-full w-8 h-8 flex items-center justify-center transition-all hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2563eb]"
        onClick={onSend}
        disabled={loading || !value.trim()}
      >
        <IoSend className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [position, setPosition] = useState({ x: 20, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      if (isDesktop && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const chatWidth = 320;
        const chatHeight = 560;

        let x = buttonRect.left;
        let y = buttonRect.top - chatHeight - 10;

        if (y < 10) {
          y = buttonRect.bottom + 10;
        }
        if (x + chatWidth > window.innerWidth - 10) {
          x = window.innerWidth - chatWidth - 10;
        }
        if (x < 10) {
          x = 10;
        }

        setPosition({ x, y });
      }
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [open, isDesktop]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const messagesParam = params.get('messages');
    if (messagesParam) {
      try {
        const parsedMessages = JSON.parse(messagesParam);
        setMessages(parsedMessages);
        const url = new URL(window.location.href);
        url.searchParams.delete('messages');
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        console.error('Failed to parse messages from URL:', error);
      }
    }
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-chat-messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    } else {
      localStorage.removeItem('ai-chat-messages');
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDesktop) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: position.x, y: position.y });
  }, [position, isDesktop]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    let newX = initialPos.x + dx;
    let newY = initialPos.y + dy;

    const container = chatContainerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      newX = Math.max(10, Math.min(newX, windowWidth - containerWidth - 10));
      newY = Math.max(10, Math.min(newY, windowHeight - containerHeight - 10));
    }

    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, initialPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleStop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setError(null);
    setLoading(true);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        assistantMessage += text;

        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: "assistant", content: assistantMessage };
          return newMsgs;
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error("Chat error:", error);
      setError("AI 服务异常，请稍后再试");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [input, loading, messages]);

  const handleFullscreen = useCallback(() => {
    localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    const queryParams = new URLSearchParams();
    queryParams.set("messages", JSON.stringify(messages));
    router.push(`/ai-chat/fullscreen?${queryParams.toString()}`);
    setOpen(false);
  }, [messages, router]);

  const handleClear = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('ai-chat-messages');
    setShowClearConfirm(false);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        aria-label="打开AI Chat"
        className={`fixed bottom-6 left-4 z-[999] group transition-opacity duration-200 ${open ? 'opacity-0 pointer-events-none' : ''}`}
        style={{ touchAction: "manipulation" }}
      >
        <div className="relative">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-white dark:bg-[#23272f] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ring-1 ring-gray-200 dark:ring-gray-700">
            <HiOutlineSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563eb] dark:text-[#60a5fa]" />
          </div>
          <span className="hidden sm:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1f2937] dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            AI 助手
          </span>
        </div>
      </button>

      {open && (
        <>
          <div
            className={`fixed inset-0 bg-black/20 dark:bg-black/40 z-[70] sm:hidden transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setOpen(false)}
          />

          <div
            ref={chatContainerRef}
            className={`fixed flex flex-col rounded-xl shadow-xl overflow-hidden z-[80]
                       bg-white dark:bg-[#23272f] transition-all duration-300 ease-out
                       ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={isDesktop ? {
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: '320px',
              maxHeight: 'min(560px, 80vh)',
              height: 'min(560px, 80vh)',
              cursor: isDragging ? 'grabbing' : 'default',
              transformOrigin: 'left top',
            } : {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              maxHeight: '85vh',
              height: 'min(600px, 90vh)',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s ease-out',
            }}
          >
            <ChatHeader
              onFullscreen={handleFullscreen}
              onClose={() => setOpen(false)}
              onMouseDown={handleMouseDown}
            />

            {messages.length > 0 && (
              <div className="flex justify-between items-center px-4 py-2 bg-[#f8fafc] dark:bg-[#18181b]">
                <span className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                  共 {messages.length} 条消息
                </span>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-[#6b7280] hover:text-[#ef4444] dark:text-[#9ca3af] dark:hover:text-[#f87171]"
                >
                  清空
                </button>
              </div>
            )}

            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full animate-in fade-in-0 duration-500">
                  <div className="w-12 h-12 mb-3 rounded-xl bg-[#f3f4f6] dark:bg-[#374151] flex items-center justify-center">
                    <HiOutlineSparkles className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                  <p className="text-sm text-[#1f2937] dark:text-[#f3f4f6] mb-1">开始和 AI 聊天</p>
                  <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                    输入消息开始对话
                  </p>
                </div>
              ) : (
                messages.map((message, idx) => (
                  <MessageBubble key={idx} message={message} />
                ))
              )}

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">
                  <span className="flex-1">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300 font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
              )}

              {showClearConfirm && (
                <div className="flex items-center justify-between px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-xs">
                  <span className="text-yellow-700 dark:text-yellow-300">确定清空所有消息？</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleClear}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium"
                    >
                      确定
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              onStop={handleStop}
              loading={loading}
            />
          </div>
        </>
      )}
    </>
  );
}
