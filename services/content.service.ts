import { prisma } from '@/lib/prisma';
import type { Content, ContentStatus } from '@prisma/client';

export const contentService = {
  create: async (data: {
    title: string;
    body: string;
    type: string;
    pillarId: string;
    userId: string;
  }) => {
    return prisma.content.create({
      data: {
        title: data.title,
        body: data.body,
        type: data.type,
        pillarId: data.pillarId,
        userId: data.userId,
        status: 'DRAFT'
      }
    });
  },

  getByUserId: async (userId: string, filters?: {
    status?: ContentStatus;
    type?: string;
  }) => {
    return prisma.content.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { type: filters.type })
      },
      include: { pillar: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  update: async (id: string, data: Partial<Content>) => {
    return prisma.content.update({
      where: { id },
      data
    });
  },

  updateStatus: async (id: string, status: ContentStatus) => {
    return prisma.content.update({
      where: { id },
      data: { status }
    });
  },

  delete: async (id: string) => {
    return prisma.content.delete({
      where: { id }
    });
  }
};