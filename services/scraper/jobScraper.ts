import { prisma } from '@/lib/prisma'
import { JobStatus } from '@prisma/client'

export interface ScrapedJob {
  platform: string
  title: string
  description: string
  url: string
  budget?: string | null
  deadline?: Date | null
  status: JobStatus
}

export interface JobScraperResult {
  success: boolean
  jobsFound: number
  jobsAdded: number
  errors: string[]
}

const mockJobs: ScrapedJob[] = [
  {
    platform: 'Upwork',
    title: 'AI Content Writer for Tech Blog',
    description:
      'Looking for an experienced AI content writer to create engaging blog posts about AI trends, machine learning applications, and tech innovations. Must have experience with SEO optimization and content strategy.',
    url: 'https://upwork.com/jobs/ai-content-writer-tech-blog-001',
    budget: '$50-100 per article',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: JobStatus.OPEN,
  },
  {
    platform: 'Fiverr',
    title: 'Social Media Manager for Personal Brand',
    description:
      'Need a social media manager to help build and maintain a personal brand presence across LinkedIn, Twitter, and Instagram. Content creation, scheduling, and engagement strategy required.',
    url: 'https://fiverr.com/jobs/social-media-manager-personal-brand-002',
    budget: '$200-300/month',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: JobStatus.OPEN,
  },
  {
    platform: 'Freelancer',
    title: 'Video Editor for YouTube Channel',
    description:
      'Seeking a creative video editor to edit YouTube videos for a personal branding channel. Experience with motion graphics, color grading, and storytelling is essential.',
    url: 'https://freelancer.com/jobs/video-editor-youtube-channel-003',
    budget: '$30-50 per video',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: JobStatus.OPEN,
  },
  {
    platform: 'Upwork',
    title: 'Newsletter Writer for Tech Startup',
    description:
      'Writing weekly newsletter content about AI tools, productivity hacks, and industry insights. Research-driven content with actionable insights.',
    url: 'https://upwork.com/jobs/newsletter-writer-tech-startup-004',
    budget: '$75-150 per newsletter',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: JobStatus.OPEN,
  },
  {
    platform: 'Toptal',
    title: 'Personal Branding Consultant',
    description:
      'Expert consultant needed to develop comprehensive personal branding strategy including LinkedIn optimization, thought leadership positioning, and content calendar creation.',
    url: 'https://toptal.com/jobs/personal-branding-consultant-005',
    budget: '$100-200/hour',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: JobStatus.OPEN,
  },
  {
    platform: 'Fiverr',
    title: 'LinkedIn Profile Optimizer',
    description:
      'Optimize LinkedIn profiles for maximum visibility and engagement. Includes headline optimization, about section rewriting, and content strategy recommendations.',
    url: 'https://fiverr.com/jobs/linkedin-profile-optimizer-006',
    budget: '$100-250 per profile',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: JobStatus.OPEN,
  },
  {
    platform: 'Upwork',
    title: 'AI Voiceover Artist for YouTube Shorts',
    description:
      'Create engaging AI-generated voiceovers for short-form video content. Must have experience with text-to-speech tools and sound editing.',
    url: 'https://upwork.com/jobs/ai-voiceover-youtube-shorts-007',
    budget: '$25-40 per minute',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: JobStatus.OPEN,
  },
  {
    platform: 'Freelancer',
    title: 'SEO Content Strategist',
    description:
      'Develop comprehensive SEO strategy including keyword research, content planning, and on-page optimization for personal branding websites.',
    url: 'https://freelancer.com/jobs/seo-content-strategist-008',
    budget: '$500-1000/month',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    status: JobStatus.OPEN,
  },
]

export const jobScraper = {
  async scrapeJobs(): Promise<JobScraperResult> {
    const result: JobScraperResult = {
      success: false,
      jobsFound: 0,
      jobsAdded: 0,
      errors: [],
    }

    try {
      result.jobsFound = mockJobs.length

      for (const job of mockJobs) {
        try {
          const existing = await prisma.freelanceJob.findFirst({
            where: {
              platform: job.platform,
              title: job.title,
            },
          })

          if (!existing) {
            await prisma.freelanceJob.create({
              data: job,
            })
            result.jobsAdded++
          }
        } catch (error) {
          result.errors.push(`Failed to add job "${job.title}": ${error}`)
        }
      }

      result.success = true
    } catch (error) {
      result.errors.push(`Scraping failed: ${error}`)
    }

    return result
  },

  async getRecentJobs(limit: number = 10) {
    return prisma.freelanceJob.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  },

  async getJobsByPlatform(platform: string) {
    return prisma.freelanceJob.findMany({
      where: { platform },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getOpenJobs() {
    return prisma.freelanceJob.findMany({
      where: { status: JobStatus.OPEN },
      orderBy: { deadline: 'asc' },
    })
  },
}
