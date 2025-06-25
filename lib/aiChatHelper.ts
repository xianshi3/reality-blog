import axios from 'axios';

// 从环境变量中获取 API URL 和 API 密钥
const HUGGING_FACE_API_URL = process.env.HUGGING_FACE_API_URL!;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY!;

// 向 AI API 发送请求，获取回复
export const getAIResponse = async (inputText: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API_URL}/v1/completions`,  // API 请求地址
      {
        model: 'gpt-3.5-turbo',  // 使用的 LLM 模型
        prompt: inputText,  // 用户的输入
        max_tokens: 150,  // 回复的最大 token 数
        temperature: 0.7,  // 控制生成内容的创意度
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,  // 使用 Bearer Token 验证
          'Content-Type': 'application/json',
        },
      }
    );

    // 返回生成的文本（AI 回复）
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error in AI response:', error);
    throw new Error('AI 服务异常，请稍后再试');
  }
};
