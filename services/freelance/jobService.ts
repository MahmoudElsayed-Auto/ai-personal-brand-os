import { prisma } from '@/lib/prisma'
import { JobStatus, ProposalStatus } from '@prisma/client'

export interface CreateJobInput {
  platform: string
  title: string
  description: string
  url: string
  budget?: string
  deadline?: Date
}

export const jobService = {
  // Store jobs
  createJob: async (data: CreateJobInput) => {
    return prisma.freelanceJob.create({
      data: {
        platform: data.platform,
        title: data.title,
        description: data.description,
        url: data.url,
        budget: data.budget || null,
        deadline: data.deadline || null,
        status: JobStatus.OPEN,
      },
    })
  },

  getJobs: async (status?: JobStatus) => {
    return prisma.freelanceJob.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        proposals: true,
      },
    })
  },

  getJobById: async (id: string) => {
    return prisma.freelanceJob.findUnique({
      where: { id },
      include: {
        proposals: true,
      },
    })
  },

  // Store proposal
  createProposal: async (jobId: string, userId: string, content: string) => {
    return prisma.proposal.create({
      data: {
        jobId,
        userId,
        content,
        status: ProposalStatus.DRAFT, // Initially draft
      },
    })
  },

  getProposalsByUser: async (userId: string) => {
    return prisma.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: true,
      },
    })
  },

  // Approval system: draft -> approved (ACCEPTED) -> sent (SUBMITTED)
  updateProposalStatus: async (id: string, status: ProposalStatus) => {
    return prisma.proposal.update({
      where: { id },
      data: {
        status,
        ...(status === ProposalStatus.SUBMITTED ? { submittedAt: new Date() } : {}),
      },
    })
  },
}
