import { prisma } from '@/lib/prisma';
import type { Script } from '@prisma/client';

export interface UpdateScriptRequest {
  scriptText?: string;
  hooks?: string[];
  cta?: string | null;
  metadata?: any;
}

export const scriptService = {
  generate: async (data: {
    contentId: string;
    type: string;
    platform: string;
    tone: string;
  }) => {
    // AI generation placeholder - in production, call AI service
    const generatedScript = {
      scriptText: `# ${data.type}\n\nThis is a placeholder AI-generated script for ${data.platform}.\n\nTone: ${data.tone}\n\n## Introduction\n\nStart with an engaging hook...\n\n## Key Points\n\n1. Point 1\n2. Point 2\n3. Point 3\n\n## Call to Action\n\nEnd with a clear call to action.`,
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
        scriptText: generatedScript.scriptText,
        metadata: generatedScript.metadata as any
      }
    });
  },

  save: async (data: {
    contentId: string;
    scriptText: string;
    hooks?: string[];
    cta?: string;
    metadata?: Record<string, any>;
  }) => {
    return prisma.script.create({
      data: {
        contentId: data.contentId,
        scriptText: data.scriptText,
        hooks: data.hooks || [],
        cta: data.cta || null,
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

  update: async (id: string, data: UpdateScriptRequest) => {
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
