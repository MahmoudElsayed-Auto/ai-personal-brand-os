import { Agent } from './types'
import { generateContent } from '../ai/gemini'

export interface ContentWriterInput {
  topic: string
}

export interface ContentWriterOutput {
  script: string
  outline: string[]
}

export class ContentWriter implements Agent<ContentWriterInput, ContentWriterOutput> {
  async run(input: ContentWriterInput): Promise<ContentWriterOutput> {
    const prompt = `You are an expert Content Writer.
Write a comprehensive video script and an outline about the topic: "${input.topic}".
Format the output EXACTLY as valid JSON with the following structure:
{
  "script": "The full video script text",
  "outline": ["Point 1", "Point 2", "Point 3"]
}
Do not include any markdown block wrappers around the JSON, just return raw JSON text.`

    const response = await generateContent(prompt, { temperature: 0.7 })

    if (!response.success || !response.text) {
      throw new Error(response.error || 'Failed to generate content')
    }

    try {
      let jsonStr = response.text
      const jsonMatch = response.text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }
      const data = JSON.parse(jsonStr)
      return {
        script: data.script || 'Script generated',
        outline: data.outline || ['Outline point 1'],
      }
    } catch (e) {
      console.error('Failed to parse Content Writer response:', e)
      throw new Error('Content Writer returned invalid JSON')
    }
  }
}
