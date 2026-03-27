import { prisma } from '@/lib/prisma';
import type { Script } from '@prisma/client';

export const scriptService = {
  generate: async (data: {
    contentId: string;
    type: string;
    platform: string;
    tone: string;
  }) => {
    // AI generation placeholder - in production, call AI service
    const generatedScript = {
      title: `Generated ${data.type} for ${data.platform}`,
      content: `# ${data.type}\n\nThis is a placeholder AI-generated script for ${data.platform}.\n\nTone: ${data.tone}\n\n## Introduction\n\nStart with an engaging hook...\n\n## Key Points\n\n1. Point 1\n2. Point 2\n3. Point 3\n\n## Call to Action\n\nEnd with a clear call to action.`,
      metadata: {
        platform: data.platform,
        tone: data.tone,
        type: data.type,
        generatedAt: new Date().toISOString()
      }
    };

    return prisma.script.create({
      data: {
        contentId: data.contentId,
        title: generatedScript.title,
        content: generatedScript.content,
        metadata: generatedScript.metadata
      }
    });
  },

  save: async (data: {
    contentId: string;
    title: string;
    content: string;
    metadata?: Record<string, any>;
  }) => {
    return prisma.script.create({
      data: {
        contentId: data.contentId,
        title: data.title,
        content: data.content,
        metadata: data.metadata || {}
      }
    });
  },

  getByContentId: async (contentId: string) => {
    return prisma.script.findMany({
      where: { contentId },
      orderBy: { createdAt: 'desc' }
    });
  },

  getById: async (id: string) => {
    return prisma.script.findUnique({
      where: { id },
      include: { content: true }
    });
  },

  update: async (id: string, data: Partial<Script>) => {
    return prisma.script.update({
      where: { id },
      data
    });
  },

  delete: async (id: string) => {
    return prisma.script.delete({
      where: { id }
    });
  }
};