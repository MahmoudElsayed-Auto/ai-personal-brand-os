import { prisma } from '@/lib/prisma'

export interface TrendingTopic {
  topic: string
  category: string
  relevance: number // 1-100 score
  sources: string[]
  keywords: string[]
  createdAt: Date
}

export interface TrendScraperResult {
  success: boolean
  trendsFound: number
  trendsAdded: number
  errors: string[]
}

const mockTrends: TrendingTopic[] = [
  {
    topic: 'AI Personal Branding Revolution',
    category: 'Technology',
    relevance: 95,
    sources: ['Hacker News', 'Product Hunt', 'Twitter'],
    keywords: ['AI', 'personal brand', 'automation', 'career'],
    createdAt: new Date(),
  },
  {
    topic: 'Content Repurposing Strategies',
    category: 'Marketing',
    relevance: 88,
    sources: ['Medium', 'LinkedIn', 'YouTube'],
    keywords: ['content strategy', 'repurposing', 'multi-platform'],
    createdAt: new Date(),
  },
  {
    topic: 'LinkedIn Algorithm Updates 2024',
    category: 'Social Media',
    relevance: 92,
    sources: ['LinkedIn Blog', 'Social Media Today', 'Sprout Social'],
    keywords: ['LinkedIn', 'algorithm', 'engagement', 'visibility'],
    createdAt: new Date(),
  },
  {
    topic: 'YouTube Shorts Monetization',
    category: 'Video',
    relevance: 85,
    sources: ['Creator Insider', 'TubeBuddy', 'VidIQ'],
    keywords: ['YouTube Shorts', 'monetization', 'short-form content'],
    createdAt: new Date(),
  },
  {
    topic: 'Newsletter Growth Hacking',
    category: 'Email Marketing',
    relevance: 82,
    sources: ['Substack', 'ConvertKit', 'Beehiiv Blog'],
    keywords: ['newsletter', 'growth', 'subscribers', 'email'],
    createdAt: new Date(),
  },
  {
    topic: 'AI Writing Assistants Comparison',
    category: 'Technology',
    relevance: 90,
    sources: ['G2', 'Capterra', 'Product Hunt'],
    keywords: ['AI writing', 'ChatGPT', 'Claude', 'Gemini'],
    createdAt: new Date(),
  },
  {
    topic: 'Personal Brand Photography Tips',
    category: 'Creative',
    relevance: 75,
    sources: ['Instagram', 'Pinterest', 'Unsplash Blog'],
    keywords: ['personal brand', 'photography', 'headshots', 'visual'],
    createdAt: new Date(),
  },
  {
    topic: 'Podcast Guesting Strategies',
    category: 'Audio',
    relevance: 78,
    sources: ['Podcast Movement', 'Buzzsprout', 'Anchor'],
    keywords: ['podcast', 'guesting', 'authority', 'networking'],
    createdAt: new Date(),
  },
  {
    topic: 'Micro-Influencer Partnerships',
    category: 'Marketing',
    relevance: 83,
    sources: ['Influencer Marketing Hub', 'AspireIQ', 'Upfluence'],
    keywords: ['micro-influencer', 'partnerships', 'collaboration'],
    createdAt: new Date(),
  },
  {
    topic: 'Personal Brand Website Trends',
    category: 'Web Design',
    relevance: 87,
    sources: ['Dribbble', 'Behance', 'Awwwards'],
    keywords: ['personal website', 'portfolio', 'design trends'],
    createdAt: new Date(),
  },
]

export const trendScraper = {
  async scrapeTrends(): Promise<TrendScraperResult> {
    const result: TrendScraperResult = {
      success: false,
      trendsFound: 0,
      trendsAdded: 0,
      errors: [],
    }

    try {
      result.trendsFound = mockTrends.length

      for (const trend of mockTrends) {
        try {
          const existing = await prisma.agentTask.findFirst({
            where: {
              agentType: 'TREND_ANALYST',
              input: {
                contains: trend.topic,
              },
            },
          })

          if (!existing) {
            await prisma.agentTask.create({
              data: {
                agentType: 'TREND_ANALYST',
                input: JSON.stringify({
                  ...trend,
                  description: `TREND: ${trend.topic} - Category: ${trend.category}, Relevance: ${trend.relevance}/100`,
                }),
                status: 'PENDING',
              },
            })
            result.trendsAdded++
          }
        } catch (error) {
          result.errors.push(`Failed to add trend "${trend.topic}": ${error}`)
        }
      }

      result.success = true
    } catch (error) {
      result.errors.push(`Trend scraping failed: ${error}`)
    }

    return result
  },

  async getTrendingTopics(limit: number = 10) {
    const tasks = await prisma.agentTask.findMany({
      where: {
        agentType: 'TREND_ANALYST',
        status: 'PENDING',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return tasks
      .map((task) => {
        try {
          return JSON.parse(task.input || '{}') as TrendingTopic
        } catch {
          return null
        }
      })
      .filter((t): t is TrendingTopic => t !== null)
  },

  async getTrendsByCategory(category: string) {
    const tasks = await prisma.agentTask.findMany({
      where: {
        agentType: 'TREND_ANALYST',
        input: { contains: category },
      },
      orderBy: { createdAt: 'desc' },
    })

    return tasks
      .map((task) => {
        try {
          return JSON.parse(task.input || '{}') as TrendingTopic
        } catch {
          return null
        }
      })
      .filter((t): t is TrendingTopic => t !== null)
  },

  async getHighRelevanceTrends(minRelevance: number = 85) {
    const tasks = await prisma.agentTask.findMany({
      where: {
        agentType: 'TREND_ANALYST',
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
    })

    return tasks
      .map((task) => {
        try {
          const trend = JSON.parse(task.input || '{}') as TrendingTopic
          return trend.relevance >= minRelevance ? trend : null
        } catch {
          return null
        }
      })
      .filter((t): t is TrendingTopic => t !== null)
  },
}
