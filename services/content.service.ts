import { prisma } from '@/lib/prisma';
import type { Content, Platform, ContentType } from '@prisma/client';
import { ContentStatus } from '@prisma/client';

export interface UpdateContentRequest {
  title?: string;
  description?: string;
  platform?: Platform;
  type?: ContentType;
  status?: ContentStatus;
  publishDate?: Date;
  excerpt?: string;
  featuredImage?: string;
  seo?: any;
}

export const contentService = {
  create: async (data: {
    userId: string;
    title: string;
    platform: Platform;
    type: ContentType;
    description?: string;
    slug?: string;
  }) => {
    const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return prisma.content.create({
      data: {
        title: data.title,
        slug,
        description: data.description || null,
        platform: data.platform,
        type: data.type,
        userId: data.userId,
        status: ContentStatus.IDEA
      }
    });
  },

  getById: async (id: string) => {
    return prisma.content.findUnique({
      where: { id },
    });
  },

  getByUserId: async (userId: string, filters?: {
    status?: ContentStatus;
    type?: ContentType;
  }) => {
    return prisma.content.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { type: filters.type })
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  update: async (id: string, data: UpdateContentRequest) => {
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
