// pages/api/ai-chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAIResponse } from '../../lib/aiChatHelper';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { messages } = req.body;
      const inputText = messages[messages.length - 1]?.content || '';  // 获取用户的最后一条消息

      // 调用 helper 函数与 AI 交互，获取 AI 回复
      const aiReply = await getAIResponse(inputText);

      // 返回 AI 回复
      res.status(200).json({ reply: aiReply });
    } catch (error: any) {
      console.error('AI 服务异常:', error);
      res.status(500).json({ error: error.message || '未知的错误' });
    }
  } else {
    res.status(405).json({ error: '不允许的请求方式' });  // 如果不是 POST 请求，返回 405 状态码
  }
};

export default handler;
