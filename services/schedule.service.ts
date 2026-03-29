import { prisma } from '@/lib/prisma';
import type { Schedule } from '@prisma/client';
import { ScheduleStatus, Platform } from '@prisma/client';

export interface UpdateScheduleRequest {
  scheduledAt?: Date;
  platform?: Platform;
  status?: ScheduleStatus;
  publishedUrl?: string | null;
  metadata?: Record<string, any>;
}

export const scheduleService = {
  create: async (data: {
    contentId: string;
    scheduledAt: Date;
    platform: Platform;
    metadata?: Record<string, any>;
  }) => {
    return prisma.schedule.create({
      data: {
        contentId: data.contentId,
        scheduledAt: data.scheduledAt,
        platform: data.platform,
        status: ScheduleStatus.SCHEDULED,
        metadata: data.metadata || {}
      }
    });
  },

  getByUserId: async (userId: string, filters?: {
    status?: ScheduleStatus;
    platform?: Platform;
    startDate?: Date;
    endDate?: Date;
  }) => {
    return prisma.schedule.findMany({
      where: {
        content: { userId },
        ...(filters?.status && { status: filters.status }),
        ...(filters?.platform && { platform: filters.platform }),
        ...(filters?.startDate && { scheduledAt: { gte: filters.startDate } }),
        ...(filters?.endDate && { scheduledAt: { lte: filters.endDate } })
      },
      include: { content: true },
      orderBy: { scheduledAt: 'asc' }
    });
  },

  getByContentId: async (contentId: string) => {
    return prisma.schedule.findMany({
      where: { contentId },
      orderBy: { scheduledAt: 'asc' }
    });
  },

  getById: async (id: string) => {
    return prisma.schedule.findUnique({
      where: { id },
      include: { content: true }
    });
  },

  update: async (id: string, data: UpdateScheduleRequest) => {
    return prisma.schedule.update({
      where: { id },
      data
    });
  },

  updateStatus: async (id: string, status: ScheduleStatus) => {
    return prisma.schedule.update({
      where: { id },
      data: { status }
    });
  },

  delete: async (id: string) => {
    return prisma.schedule.delete({
      where: { id }
    });
  },

  getUpcoming: async (userId: string, limit: number = 10) => {
    return prisma.schedule.findMany({
      where: {
        content: { userId },
        status: ScheduleStatus.SCHEDULED,
        scheduledAt: { gte: new Date() }
      },
      include: { content: true },
      orderBy: { scheduledAt: 'asc' },
      take: limit
    });
  }
};
