import { prisma } from '@/lib/prisma';
import type { FreelanceJob, Proposal, ProposalStatus, JobStatus } from '@prisma/client';

export const freelanceService = {
  saveJob: async (data: {
    platform: string;
    title: string;
    description: string;
    url: string;
    budget?: string;
    deadline?: Date;
  }) => {
    return prisma.freelanceJob.create({
      data: {
        platform: data.platform,
        title: data.title,
        description: data.description,
        url: data.url,
        budget: data.budget,
        deadline: data.deadline,
        status: 'OPEN'
      }
    });
  },

  getByUserId: async (userId: string, filters?: {
    status?: JobStatus;
    platform?: string;
  }) => {
    return prisma.freelanceJob.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.platform && { platform: filters.platform })
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getJobs: async (filters?: {
    status?: JobStatus;
    platform?: string;
    limit?: number;
  }) => {
    return prisma.freelanceJob.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.platform && { platform: filters.platform })
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50
    });
  },

  getJobById: async (jobId: string) => {
    return prisma.freelanceJob.findUnique({
      where: { id: jobId },
      include: { proposals: true }
    });
  },

  generateProposal: async (jobId: string, template?: string) => {
    const job = await prisma.freelanceJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // AI generation placeholder - in production, call AI service
    const generatedProposal = {
      content: `# Proposal for: ${job.title}

## Introduction

I am excited to submit this proposal for your project. Based on the project requirements, I believe my skills and experience make me an excellent fit.

## Understanding of the Project

${job.description.substring(0, 200)}...

## Approach

I will approach this project by:
1. Understanding your specific requirements in detail
2. Creating a comprehensive plan with milestones
3. Communicating regularly throughout the process
4. Delivering high-quality work within the deadline

## Experience

I have extensive experience in similar projects and can deliver results that meet your expectations.

## Timeline

I can start immediately and deliver within your specified deadline.

## Why Choose Me?

- Proven track record on ${job.platform}
- Clear communication
- Quality-focused delivery
- Competitive pricing

Looking forward to working with you!

---
*This is a placeholder AI-generated proposal. Customize as needed.*`,
      metadata: {
        template: template || 'default',
        platform: job.platform,
        generatedAt: new Date().toISOString()
      }
    };

    return generatedProposal;
  },

  saveProposal: async (data: {
    jobId: string;
    userId?: string;
    content: string;
    metadata?: Record<string, any>;
  }) => {
    return prisma.proposal.create({
      data: {
        jobId: data.jobId,
        userId: data.userId,
        content: data.content,
        status: 'DRAFT',
        metadata: data.metadata || {}
      }
    });
  },

  getProposals: async (jobId: string) => {
    return prisma.proposal.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' }
    });
  },

  getProposalById: async (proposalId: string) => {
    return prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { job: true }
    });
  },

  getUserProposals: async (userId: string, filters?: {
    status?: ProposalStatus;
  }) => {
    return prisma.proposal.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status })
      },
      include: { job: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  updateProposalStatus: async (proposalId: string, status: ProposalStatus) => {
    const updateData: any = { status };
    
    if (status === 'SUBMITTED') {
      updateData.submittedAt = new Date();
    }
    
    return prisma.proposal.update({
      where: { id: proposalId },
      data: updateData
    });
  },

  updateJobStatus: async (jobId: string, status: JobStatus) => {
    return prisma.freelanceJob.update({
      where: { id: jobId },
      data: { status }
    });
  }
};