import { NextRequest, NextResponse } from 'next/server'
import { freelanceService } from '@/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any

    // Fetch all jobs
    const jobs = await freelanceService.getJobs({
      ...(status && { status })
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.description || !body.platform || !body.url) {
      return NextResponse.json(
        { error: 'title, description, platform, and url are required' },
        { status: 400 }
      )
    }

    const job = await freelanceService.saveJob(body)
    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error saving job:', error)
    return NextResponse.json(
      { error: 'Failed to save job' },
      { status: 500 }
    )
  }
}
