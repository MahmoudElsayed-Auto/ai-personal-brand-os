import { generateContent } from '../ai/gemini'

export interface ProposalInput {
  jobTitle: string
  jobDescription: string
  clientName?: string
  freelancerName?: string
  freelancerSkills?: string[]
  budget?: string
}

export interface GeneratedProposal {
  content: string
}

export const generateProposal = async (input: ProposalInput): Promise<GeneratedProposal> => {
  const skillsContext = input.freelancerSkills?.length
    ? `My skills are: ${input.freelancerSkills.join(', ')}.`
    : ''

  const clientContext = input.clientName ? `The client's name is ${input.clientName}.` : ''
  const myNameContext = input.freelancerName ? `My name is ${input.freelancerName}.` : ''

  const prompt = `You are an expert Freelance Proposal Writer.
Your task is to write a highly converting, professional, and personalized proposal for a freelance job.

Job Title: "${input.jobTitle}"
Job Description: "${input.jobDescription}"
Budget: "${input.budget || 'Not specified'}"

${clientContext}
${myNameContext}
${skillsContext}

Write a personalized and professional proposal that directly addresses the client's needs, highlights relevant skills, and includes a clear call to action. Keep it concise, engaging, and professional. 

Format the output EXACTLY as valid JSON with the following structure:
{
  "content": "The full text of the proposal, with proper line breaks and paragraphs"
}

CRITICAL RULES:
- Do not include any markdown block wrappers around the JSON.
- Just return raw JSON text.
- Ensure all text strings properly escape newlines (\\\\n) and quotes to keep the JSON valid.`

  const response = await generateContent(prompt, { temperature: 0.7, maxOutputTokens: 2048 })

  if (!response.success || !response.text) {
    throw new Error(response.error || 'Failed to generate proposal')
  }

  try {
    let jsonStr = response.text
    const jsonMatch = response.text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }
    const data = JSON.parse(jsonStr)

    return {
      content: data.content || '',
    }
  } catch (error) {
    console.error('Failed to parse Generated Proposal response:', error)
    throw new Error('Proposal Generator returned invalid JSON')
  }
}
