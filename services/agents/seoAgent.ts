import { Agent } from './types'
import { generateContent } from '../ai/gemini'

export interface SeoAgentInput {
  topic: string
  script: string
}

export interface SeoAgentOutput {
  title: string
  keywords: string[]
  description: string
}

export class SeoAgent implements Agent<SeoAgentInput, SeoAgentOutput> {
  async run(input: SeoAgentInput): Promise<SeoAgentOutput> {
    const prompt = `You are an expert SEO Specialist.
Based on the following topic and script, generate an SEO-optimized title, a list of target keywords, and a compelling meta description for a video or blog post.

Topic: "${input.topic}"
Script Snippet: "${input.script.substring(0, 1500)}"

Format the output EXACTLY as valid JSON with the following structure:
{
  "title": "SEO Optimized Title",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "description": "A compelling meta description under 160 characters"
}
Do not include any markdown block wrappers around the JSON, just return raw JSON text.`

    const response = await generateContent(prompt, { temperature: 0.5 })

    if (!response.success || !response.text) {
      throw new Error(response.error || 'Failed to generate SEO content')
    }

    try {
      let jsonStr = response.text
      const jsonMatch = response.text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }
      const data = JSON.parse(jsonStr)
      return {
        title: data.title || 'Optimized Title',
        keywords: data.keywords || ['seo', input.topic],
        description: data.description || 'Optimized description',
      }
    } catch (e) {
      console.error('Failed to parse SEO Agent response:', e)
      throw new Error('SEO Agent returned invalid JSON')
    }
  }
}
