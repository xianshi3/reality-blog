// types/message.ts

export interface Message {
  role: "user" | "assistant";  // 角色可以是 'user' 或 'assistant'
  content: string;            // 消息内容是一个字符串
}
