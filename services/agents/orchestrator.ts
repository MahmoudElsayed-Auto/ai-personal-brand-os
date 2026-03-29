import { prisma } from '@/lib/prisma'
import { AgentType } from '@prisma/client'
import { ContentWriter } from './contentWriter'
import { SeoAgent } from './seoAgent'
import { SocialMediaManager } from './socialAgent'

export interface PipelineResult {
  taskId: string
  topic: string
  script: string
  outline: string[]
  title: string
  keywords: string[]
  description: string
  social: {
    captions: Record<string, string>
    hashtags: string[]
  }
}

export const runContentPipeline = async (
  userId: string,
  topic: string
): Promise<PipelineResult> => {
  // 1. Initialize Task in Memory (DB)
  const task = await prisma.agentTask.create({
    data: {
      userId,
      agentType: AgentType.CONTENT_WRITER, // Mark primary agent type
      input: JSON.stringify({ topic }),
      status: 'PROCESSING',
      startedAt: new Date(),
    },
  })

  try {
    // 2. Phase 1: Content Writer
    const writer = new ContentWriter()
    const writerOutput = await writer.run({ topic })

    // Save intermediate result
    await prisma.agentTask.update({
      where: { id: task.id },
      data: {
        metadata: {
          step: 'CONTENT_WRITER_COMPLETE',
          writerOutput: writerOutput as Record<string, any>,
        },
      },
    })

    // 3. Phase 2: SEO Specialist
    const seoAgent = new SeoAgent()
    const seoOutput = await seoAgent.run({
      topic,
      script: writerOutput.script,
    })

    // Save intermediate result
    await prisma.agentTask.update({
      where: { id: task.id },
      data: {
        metadata: {
          step: 'SEO_COMPLETE',
          writerOutput: writerOutput as Record<string, any>,
          seoOutput: seoOutput as Record<string, any>,
        },
      },
    })

    // 4. Phase 3: Social Media Manager
    const socialAgent = new SocialMediaManager()
    const socialOutput = await socialAgent.run({
      topic,
      title: seoOutput.title,
      script: writerOutput.script,
      keywords: seoOutput.keywords,
    })

    // 5. Finalize Task and Memory
    const finalResult = {
      taskId: task.id,
      topic,
      script: writerOutput.script,
      outline: writerOutput.outline,
      title: seoOutput.title,
      keywords: seoOutput.keywords,
      description: seoOutput.description,
      social: socialOutput,
    }

    await prisma.agentTask.update({
      where: { id: task.id },
      data: {
        status: 'COMPLETED',
        output: JSON.stringify(finalResult),
        completedAt: new Date(),
        metadata: {
          step: 'PIPELINE_COMPLETE',
          finalResult: finalResult as Record<string, any>,
        },
      },
    })

    return finalResult
  } catch (error: any) {
    // Handle Failure
    await prisma.agentTask.update({
      where: { id: task.id },
      data: {
        status: 'FAILED',
        output: error.message || 'Pipeline failed',
        completedAt: new Date(),
      },
    })
    throw error
  }
}
