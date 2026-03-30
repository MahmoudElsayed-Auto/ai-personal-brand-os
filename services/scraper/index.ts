export { jobScraper, type ScrapedJob, type JobScraperResult } from './jobScraper'
export { trendScraper, type TrendingTopic, type TrendScraperResult } from './trendScraper'

import { jobScraper } from './jobScraper'
import { trendScraper } from './trendScraper'

export const scraperService = {
  job: jobScraper,
  trend: trendScraper,

  async runAllScrapers() {
    const [jobResult, trendResult] = await Promise.all([
      jobScraper.scrapeJobs(),
      trendScraper.scrapeTrends(),
    ])

    return {
      jobs: jobResult,
      trends: trendResult,
      totalSuccess: jobResult.success && trendResult.success,
    }
  },
}
