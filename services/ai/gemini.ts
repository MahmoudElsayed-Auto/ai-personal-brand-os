import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export async function generateContent(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  }
): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: options?.model || 'gemini-2.0-flash-exp',
    });

    const generationConfig = {
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxOutputTokens || 2048,
      topP: options?.topP || 0.95,
      topK: options?.topK || 40,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    return {
      text,
      success: true,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export default generateContent;