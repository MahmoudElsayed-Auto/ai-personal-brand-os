import { generateContent } from '../ai/gemini'

export interface TransformInput {
  content: string
  sourceFormat?: string // Optional context, e.g., 'youtube_script' or 'blog_post'
  tone?: string
}

export interface TransformedContent {
  youtube: string
  tiktok: string
  instagram: string
  twitter: string
  linkedin: string
}

export const transformContent = async (input: TransformInput): Promise<TransformedContent> => {
  const toneInstruction = input.tone
    ? `Use a ${input.tone} tone across all formats.`
    : 'Adapt the tone naturally for each platform.'
  const sourceInstruction = input.sourceFormat
    ? `The source material is a ${input.sourceFormat}.`
    : ''

  const prompt = `You are an expert Content Repurposing Engine and Social Media Strategist.
Your task is to take the following source content and transform it into highly engaging, platform-optimized formats.

${sourceInstruction}
${toneInstruction}

Source Content:
"""
${input.content}
"""

Format the output EXACTLY as valid JSON with the following structure:
{
  "youtube": "A full, engaging YouTube script based on the content (include Intro, Body, Outro).",
  "tiktok": "A punchy, fast-paced 15-60 second TikTok script with visual cues/hooks.",
  "instagram": "A highly engaging Instagram caption with storytelling, line breaks, emojis, and hashtags.",
  "twitter": "A compelling Twitter thread (format as a single string, use '🧵' or numbers to separate tweets).",
  "linkedin": "A professional, thought-leadership style LinkedIn post with clear takeaways."
}

CRITICAL RULES:
- Do not include any markdown block wrappers around the JSON.
- Just return raw JSON text.
- Ensure all text strings properly escape newlines (\\n) and quotes to keep the JSON valid.`

  const response = await generateContent(prompt, { temperature: 0.7, maxOutputTokens: 8192 })

  if (!response.success || !response.text) {
    throw new Error(response.error || 'Failed to transform content')
  }

  try {
    let jsonStr = response.text
    const jsonMatch = response.text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }
    const data = JSON.parse(jsonStr)

    return {
      youtube: data.youtube || '',
      tiktok: data.tiktok || '',
      instagram: data.instagram || '',
      twitter: data.twitter || '',
      linkedin: data.linkedin || '',
    }
  } catch (error) {
    console.error('Failed to parse Transformed Content response:', error)
    throw new Error('Content Transformer returned invalid JSON')
  }
}
