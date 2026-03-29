import { Agent } from './types'
import { generateContent } from '../ai/gemini'

export interface SocialAgentInput {
  topic: string
  title: string
  script: string
  keywords: string[]
}

export interface SocialAgentOutput {
  captions: Record<string, string>
  hashtags: string[]
}

export class SocialMediaManager implements Agent<SocialAgentInput, SocialAgentOutput> {
  async run(input: SocialAgentInput): Promise<SocialAgentOutput> {
    const prompt = `You are an expert Social Media Manager.
Generate engaging captions for Instagram, Twitter, and LinkedIn based on this content.

Title: "${input.title}"
Keywords: ${input.keywords.join(', ')}
Script Snippet: "${input.script.substring(0, 1000)}"

Format the output EXACTLY as valid JSON with the following structure:
{
  "captions": {
    "instagram": "Engaging IG caption with emojis",
    "twitter": "Punchy tweet under 280 chars",
    "linkedin": "Professional insight-driven post"
  },
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}
Do not include any markdown block wrappers around the JSON, just return raw JSON text.`

    const response = await generateContent(prompt, { temperature: 0.7 })

    if (!response.success || !response.text) {
      throw new Error(response.error || 'Failed to generate social content')
    }

    try {
      let jsonStr = response.text
      const jsonMatch = response.text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }
      const data = JSON.parse(jsonStr)
      return {
        captions: data.captions || { instagram: '', twitter: '', linkedin: '' },
        hashtags: data.hashtags || [],
      }
    } catch (e) {
      console.error('Failed to parse Social Agent response:', e)
      throw new Error('Social Agent returned invalid JSON')
    }
  }
}
