"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import styles from "./fullscreen-chat.module.css";

import { HiOutlineHome, HiOutlineSparkles, HiOutlinePlus, HiOutlineClock, HiOutlineDownload, HiOutlineSearch, HiOutlineX, HiOutlineChatAlt2, HiOutlineLightningBolt, HiOutlineCode, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { IoSend, IoStop, IoRefresh, IoTrash } from "react-icons/io5";
import { RiRobot2Line, RiUserLine } from "react-icons/ri";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import { VscSymbolKeyword } from "react-icons/vsc";
import { MdEdit } from "react-icons/md";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  messageCount: number;
};

const STORAGE_KEY = "ai-chat-conversations";
const CURRENT_ID_KEY = "ai-chat-current-id";
const SIDEBAR_COLLAPSED_KEY = "ai-chat-sidebar-collapsed";
const MAX_TITLE_LENGTH = 40;

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch {}
}

function getCurrentId(): string | null {
  try {
    return localStorage.getItem(CURRENT_ID_KEY);
  } catch {
    return null;
  }
}

function setCurrentId(id: string | null) {
  try {
    if (id) localStorage.setItem(CURRENT_ID_KEY, id);
    else localStorage.removeItem(CURRENT_ID_KEY);
  } catch {}
}

function generateTitle(msgs: Message[]): string {
  const firstUser = msgs.find(m => m.role === "user");
  if (!firstUser) return "新对话";
  const text = firstUser.content.replace(/\n/g, " ").trim();
  return text.length > MAX_TITLE_LENGTH ? text.slice(0, MAX_TITLE_LENGTH) + "…" : text;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
      title={copied ? "已复制!" : "复制代码"}
    >
      {copied ? <BsClipboardCheck /> : <BsClipboard />}
    </button>
  );
};

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");
  const language = match ? match[1] : "text";

  if (!inline && match) {
    return (
      <div className={styles.codeBlockWrapper}>
        <div className={styles.codeHeader}>
          <div className={styles.codeHeaderInfo}>
            <div className={styles.codeDots}>
              <span />
              <span />
              <span />
            </div>
            <span className={styles.codeLanguage}>
              <VscSymbolKeyword />
              {language}
            </span>
          </div>
          <CopyButton text={code} />
        </div>
        <div className={styles.codeBlockBody}>
          <pre className={`language-${language}`}>
            <code className={className}>{children}</code>
          </pre>
        </div>
      </div>
    );
  }

  return <code className={className} {...props}>{children}</code>;
};

const STARTERS = [
  {
    icon: <HiOutlineLightningBolt />,
    title: "高效任务助手",
    desc: "帮我规划今天的高效日程",
    prompt: "帮我制定今天的高效计划，包含重要/紧急分类",
  },
  {
    icon: <HiOutlineChatAlt2 />,
    title: "知识问答",
    desc: "用通俗的语言讲清复杂概念",
    prompt: "请用通俗易懂的方式给我解释一个复杂概念",
  },
  {
    icon: <HiOutlineCode />,
    title: "代码助手",
    desc: "生成、优化或讲解一段代码",
    prompt: "帮我写一段优雅且带注释的示例代码",
  },
];

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [conversationQuery, setConversationQuery] = useState("");
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const scrollToBottom = useCallback(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    setConversations(getConversations());
  }, []);

  useEffect(() => {
    const messagesParam = searchParams.get("messages");
    if (messagesParam) {
      try {
        const parsedMessages = JSON.parse(messagesParam);
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          id: generateId(),
        }));
        const convId = generateId();
        setMessages(formattedMessages);
        setCurrentConvId(convId);
        const url = new URL(window.location.href);
        url.searchParams.delete("messages");
        window.history.replaceState({}, "", url.toString());
      } catch (error) {
        console.error("Failed to parse messages from URL:", error);
      }
    } else {
      const savedId = getCurrentId();
      if (savedId) {
        const convs = getConversations();
        const found = convs.find(c => c.id === savedId);
        if (found) {
          setMessages(found.messages);
          setCurrentConvId(found.id);
        }
      }
    }
  }, [searchParams]);

  const persistConversations = useCallback((msgs: Message[], convId: string | null) => {
    if (msgs.length === 0) return;
    const id = convId || generateId();
    if (!convId) setCurrentConvId(id);

    const now = Date.now();
    const title = generateTitle(msgs);

    setConversations(prev => {
      const existing = prev.findIndex(c => c.id === id);
      const entry: Conversation = {
        id,
        title,
        messages: msgs,
        createdAt: existing >= 0 ? prev[existing].createdAt : now,
        updatedAt: now,
        messageCount: msgs.length,
      };
      const next = existing >= 0
        ? [...prev.slice(0, existing), entry, ...prev.slice(existing + 1)]
        : [entry, ...prev];
      saveConversations(next);
      setCurrentId(id);
      return next;
    });

    return id;
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !loading) {
      persistConversations(messages, currentConvId);
    }
  }, [messages, loading, currentConvId, persistConversations]);

  useEffect(() => {
    if (editingMsgId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }
  }, [editingMsgId]);

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
  };

  const sendMessages = useCallback(async (msgs: Message[]) => {
    setError(null);

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      id: generateId(),
      timestamp: Date.now() + 1,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs.map(m => ({ role: m.role, content: m.content }))
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        aiText += decoder.decode(value, { stream: true });

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsg.id
              ? { ...msg, content: aiText }
              : msg
          )
        );
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Error:", error);
      setError(error.message || "发送失败，请重试");
      setMessages(prev => prev.filter(msg => msg.id !== assistantMsg.id));
    } finally {
      setLoading(false);
      abortRef.current = null;
      textareaRef.current?.focus();
    }
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      id: generateId(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    sendMessages(newMessages);
  }, [input, loading, messages, sendMessages]);

  const handleRetry = useCallback((userMsgIndex: number) => {
    const msgs = messages.slice(0, userMsgIndex + 1);
    setMessages(msgs);
    sendMessages(msgs);
  }, [messages, sendMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
    setCurrentConvId(null);
    setEditingMsgId(null);
    setConversationQuery("");
    setSidebarOpen(false);
    textareaRef.current?.focus();
  };

  const handleToggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const handleExpandSidebar = () => {
    if (collapsed) {
      setCollapsed(false);
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "0");
      } catch {}
    }
  };

  const handleCopyMessage = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleLoadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setCurrentConvId(conv.id);
    setError(null);
    setEditingMsgId(null);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id);
      saveConversations(next);
      return next;
    });
    if (currentConvId === id) {
      setMessages([]);
      setCurrentConvId(null);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "昨天";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const handleExportMarkdown = () => {
    if (messages.length === 0) return;
    let md = `# AI Chat 对话记录\n\n`;
    md += `> 导出时间: ${new Date().toLocaleString()}\n\n`;
    md += `---\n\n`;

    for (const msg of messages) {
      const label = msg.role === "user" ? "**你**" : "**AI Chat**";
      md += `### ${label}\n\n`;
      md += `${msg.content}\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEditStart = (msg: Message) => {
    if (loading) return;
    setEditingMsgId(msg.id);
    setEditContent(msg.content);
  };

  const handleEditCancel = () => {
    setEditingMsgId(null);
    setEditContent("");
  };

  const handleEditSave = () => {
    if (!editingMsgId || !editContent.trim()) return;

    const msgIndex = messages.findIndex(m => m.id === editingMsgId);
    if (msgIndex < 0) return;

    const updatedMsg: Message = {
      ...messages[msgIndex],
      content: editContent.trim(),
    };

    const truncated = messages.slice(0, msgIndex + 1);
    truncated[msgIndex] = updatedMsg;

    setMessages(truncated);
    setEditingMsgId(null);
    setEditContent("");

    sendMessages(truncated);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const query = conversationQuery.trim().toLowerCase();
  const filteredConversations = query
    ? conversations.filter(c => c.title.toLowerCase().includes(query))
    : conversations;

  return (
    <div className={styles.app}>
      {/* 背景装饰 */}
      <div className={styles.dotGrid} />
      <div className={`${styles.orb} ${styles.orbA}`} />
      <div className={`${styles.orb} ${styles.orbB}`} />
      <div className={`${styles.orb} ${styles.orbC}`} />

      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===== 左侧对话栏 ===== */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""} ${collapsed ? styles.sidebarCollapsed : ""}`}
      >
        <button
          className={styles.sidebarCollapseBtn}
          onClick={handleToggleCollapse}
          title={collapsed ? "展开侧栏" : "收起侧栏"}
          aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
        >
          {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
        </button>

        <div className={styles.sidebarHeader} onClick={collapsed ? handleExpandSidebar : undefined}>
          <div className={styles.sidebarBrand}>
            <span className={styles.sidebarBrandIcon}>
              <HiOutlineChatAlt2 />
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 className={styles.sidebarTitle}>对话记录</h2>
              <span className={styles.sidebarCount}>{conversations.length}</span>
            </div>
          </div>
          <button
            className={styles.sidebarClose}
            onClick={() => setSidebarOpen(false)}
            title="关闭"
          >
            <HiOutlineX />
          </button>
        </div>

        <button className={styles.newChatBtn} onClick={handleNewChat} title="新建对话">
          <HiOutlinePlus />
          <span className={styles.newChatLabel}>新建对话</span>
        </button>

        <div className={styles.sidebarSearch}>
          <span className={styles.sidebarSearchIcon}><HiOutlineSearch /></span>
          <input
            className={styles.sidebarSearchInput}
            value={conversationQuery}
            onChange={(e) => setConversationQuery(e.target.value)}
            placeholder="搜索对话…"
          />
          {conversationQuery && (
            <button
              className={styles.sidebarSearchClear}
              onClick={() => setConversationQuery("")}
              title="清空"
            >
              <HiOutlineX />
            </button>
          )}
        </div>

        <div className={styles.sidebarList}>
          {filteredConversations.length === 0 ? (
            <div className={query ? styles.sidebarSearchEmpty : styles.sidebarEmpty}>
              {query ? "没有找到匹配的对话" : (
                <>
                  暂无对话记录
                  <br />
                  开始一段新的对话吧 ✨
                </>
              )}
            </div>
          ) : (
            filteredConversations.map((conv, index) => (
              <div
                key={conv.id}
                className={`${styles.sidebarItem} ${conv.id === currentConvId ? styles.sidebarItemActive : ""}`}
                onClick={() => handleLoadConversation(conv)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className={styles.sidebarItemTitle}>{conv.title}</div>
                <div className={styles.sidebarItemMeta}>
                  <span>{formatDate(conv.updatedAt)}</span>
                  <span>{conv.messageCount} 条消息</span>
                </div>
                <button
                  className={styles.sidebarItemDelete}
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  title="删除"
                >
                  <IoTrash />
                </button>
              </div>
            ))
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <span>
            <span className={styles.sidebarFooterDot} />
            本地存储
          </span>
          <span>{conversations.length} 段对话</span>
        </div>
      </aside>

      {/* ===== 主区域 ===== */}
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.headerMenuBtn}
              onClick={() => setSidebarOpen(true)}
              title="对话记录"
            >
              <HiOutlineClock />
            </button>
            <div className={styles.headerLogo}>
              <HiOutlineSparkles />
            </div>
            <div className={styles.headerTitles}>
              <h1 className={styles.headerTitle}>Reality AI</h1>
              <span className={styles.headerSubtitle}>智能对话助手</span>
            </div>
            <div className={`${styles.headerStatus} ${loading ? styles.thinking : ""}`}>
              <span className={styles.statusDot}></span>
              <span>{loading ? "思考中…" : "在线"}</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {messages.length > 0 && (
              <button className={styles.headerAction} onClick={handleExportMarkdown} title="导出 Markdown">
                <HiOutlineDownload />
                <span>导出</span>
              </button>
            )}
            <button className={styles.headerAction} onClick={handleNewChat} title="新建对话">
              <HiOutlinePlus />
              <span>新建</span>
            </button>
            <button className={styles.headerAction} onClick={() => router.push("/")} title="返回首页">
              <HiOutlineHome />
              <span>首页</span>
            </button>
          </div>
        </header>

        <main className={styles.chatArea} ref={chatAreaRef}>
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyOrb}>
                  <HiOutlineSparkles />
                </div>
                <h2 className={styles.emptyTitle}>
                  你好，我是 <span className={styles.gradientText}>Reality AI</span>
                </h2>
                <p className={styles.emptySubtitle}>随时为你解答问题、撰写文档、编写代码</p>

                <div className={styles.emptyStarters}>
                  {STARTERS.map((item) => (
                    <button
                      key={item.title}
                      className={styles.starterCard}
                      onClick={() => {
                        setInput(item.prompt);
                        textareaRef.current?.focus();
                      }}
                    >
                      <span className={styles.starterIcon}>{item.icon}</span>
                      <span className={styles.starterTitle}>{item.title}</span>
                      <p className={styles.starterDesc}>{item.desc}</p>
                    </button>
                  ))}
                </div>

                <p className={styles.emptyHint}>点击卡片或直接输入消息 · Enter 发送 · Shift+Enter 换行</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`${styles.messageItem} ${msg.role === "user" ? styles.user : ""}`}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className={styles.messageAvatar}>
                    {msg.role === "user" ? <RiUserLine /> : <RiRobot2Line />}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageSender}>
                      <span className={styles.messageSenderName}>
                        {msg.role === "user" ? "你" : "Reality AI"}
                      </span>
                      <span className={styles.messageTime}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {editingMsgId === msg.id ? (
                      <div className={styles.editContainer}>
                        <textarea
                          ref={editTextareaRef}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          className={styles.editTextarea}
                        />
                        <div className={styles.editActions}>
                          <span className={styles.editHint}>Enter 保存 · Esc 取消 · Shift+Enter 换行</span>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={handleEditCancel} className={styles.editCancelBtn}>取消</button>
                            <button onClick={handleEditSave} className={styles.editSaveBtn}>保存</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.messageBubble}>
                        {msg.role === "assistant" && msg.content === "" ? (
                          <div className={styles.typingIndicator}>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        ) : msg.role === "assistant" ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{ code: CodeBlock }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    )}

                    {!editingMsgId && msg.role === "user" && !loading && (
                      <div className={styles.messageActions}>
                        <button
                          className={styles.messageActionBtn}
                          onClick={() => handleEditStart(msg)}
                          title="编辑"
                        >
                          <MdEdit />
                          编辑
                        </button>
                      </div>
                    )}

                    {!editingMsgId && msg.role === "assistant" && msg.content && !loading && (
                      <div className={styles.messageActions}>
                        <button
                          className={styles.messageActionBtn}
                          onClick={() => {
                            const userIdx = index - 1;
                            if (userIdx >= 0 && messages[userIdx].role === "user") {
                              handleRetry(userIdx);
                            }
                          }}
                          title="重新生成"
                        >
                          <IoRefresh />
                          重试
                        </button>
                        <button
                          className={styles.messageActionBtn}
                          onClick={() => handleCopyMessage(msg.content)}
                          title="复制回复"
                        >
                          <BsClipboard />
                          复制
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {error && (
              <div className={styles.errorMessage}>
                <span>{error}</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    onClick={() => {
                      const lastUserIdx = messages
                        .map((m, i) => (m.role === "user" ? i : -1))
                        .filter(i => i >= 0)
                        .pop();
                      if (lastUserIdx !== undefined) handleRetry(lastUserIdx);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12.5,
                      fontWeight: 600,
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <IoRefresh /> 重试
                  </button>
                  <button onClick={() => setError(null)} className={styles.errorClose}>×</button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* ===== 输入区 ===== */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrap}>
            <div className={styles.inputContainer}>
              <div className={styles.inputInner}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息… (Shift + Enter 换行)"
                  disabled={loading}
                  className={styles.chatInput}
                  rows={1}
                />
              </div>
              <div className={styles.buttonGroup}>
                {loading ? (
                  <button onClick={handleStop} className={styles.stopBtn} title="停止生成">
                    <IoStop />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={styles.sendBtn}
                    title="发送 (Enter)"
                  >
                    <IoSend />
                  </button>
                )}
              </div>
            </div>
            <div className={styles.inputHint}>
              <span>{loading ? "AI 正在思考… 点击红色按钮停止" : "Enter 发送 · Shift + Enter 换行"}</span>
              {input.length > 0 && (
                <span className={`${styles.charCount} ${input.length > 2000 ? styles.warning : ""}`}>
                  {input.length}/2000
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FullscreenChat() {
  return (
    <Suspense fallback={
      <div className={styles.app}>
        <div className={styles.main}>
          <div className={styles.emptyState}>
            <div className={styles.emptyOrb}>
              <HiOutlineSparkles />
            </div>
            <h2 className={styles.emptyTitle}>Reality AI</h2>
            <p className={styles.emptySubtitle}>加载聊天记录…</p>
          </div>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}