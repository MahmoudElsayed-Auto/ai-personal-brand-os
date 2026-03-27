import { prisma } from '@/lib/prisma';
import type { AgentTask, AgentTaskStatus, AgentType } from '@prisma/client';

export const agentService = {
  triggerTask: async (data: {
    userId?: string;
    agentType: AgentType;
    input: string;
    metadata?: Record<string, any>;
  }) => {
    return prisma.agentTask.create({
      data: {
        userId: data.userId,
        agentType: data.agentType,
        input: data.input,
        status: 'PENDING',
        metadata: data.metadata || {}
      }
    });
  },

  saveResult: async (taskId: string, result: {
    output: string;
    status?: AgentTaskStatus;
    metadata?: Record<string, any>;
  }) => {
    return prisma.agentTask.update({
      where: { id: taskId },
      data: {
        output: result.output,
        status: result.status || 'COMPLETED',
        metadata: result.metadata,
        completedAt: new Date()
      }
    });
  },

  getByUserId: async (userId: string, filters?: {
    agentType?: AgentType;
    status?: AgentTaskStatus;
  }) => {
    return prisma.agentTask.findMany({
      where: {
        userId,
        ...(filters?.agentType && { agentType: filters.agentType }),
        ...(filters?.status && { status: filters.status })
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getById: async (taskId: string) => {
    return prisma.agentTask.findUnique({
      where: { id: taskId }
    });
  },

  updateStatus: async (taskId: string, status: AgentTaskStatus) => {
    const updateData: any = { status };
    
    if (status === 'PROCESSING') {
      updateData.startedAt = new Date();
    } else if (status === 'COMPLETED' || status === 'FAILED') {
      updateData.completedAt = new Date();
    }
    
    return prisma.agentTask.update({
      where: { id: taskId },
      data: updateData
    });
  },

  getPendingTasks: async (limit: number = 10) => {
    return prisma.agentTask.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      take: limit
    });
  },

  delete: async (taskId: string) => {
    return prisma.agentTask.delete({
      where: { id: taskId }
    });
  }
};