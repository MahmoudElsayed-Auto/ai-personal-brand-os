import { prisma } from '@/lib/prisma';
import type { Schedule, ScheduleStatus } from '@prisma/client';

export const scheduleService = {
  create: async (data: {
    contentId: string;
    scheduledAt: Date;
    platform: string;
    metadata?: Record<string, any>;
  }) => {
    return prisma.schedule.create({
      data: {
        contentId: data.contentId,
        scheduledAt: data.scheduledAt,
        platform: data.platform,
        status: 'SCHEDULED',
        metadata: data.metadata || {}
      }
    });
  },

  getByUserId: async (userId: string, filters?: {
    status?: ScheduleStatus;
    platform?: string;
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

  update: async (id: string, data: Partial<Schedule>) => {
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
        status: 'SCHEDULED',
        scheduledAt: { gte: new Date() }
      },
      include: { content: true },
      orderBy: { scheduledAt: 'asc' },
      take: limit
    });
  }
};