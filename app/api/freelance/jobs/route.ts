import { NextRequest, NextResponse } from 'next/server'
import { jobService } from '@/services/freelance/jobService'
import { getAuthenticatedUserId } from '@/lib/supabase.server'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any

    const jobs = await jobService.getJobs(status)

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.title || !body.description || !body.platform || !body.url) {
      return NextResponse.json(
        { error: 'title, description, platform, and url are required' },
        { status: 400 }
      )
    }

    const job = await jobService.createJob(body)
    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error saving job:', error)
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 })
  }
}
