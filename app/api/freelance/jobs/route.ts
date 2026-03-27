import { NextRequest, NextResponse } from 'next/server'
import { freelanceService } from '@/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const jobs = await freelanceService.getByUserId(userId)

    // Filter by status if provided
    const filtered = status
      ? jobs.filter(j => j.status === status)
      : jobs

    return NextResponse.json(filtered)
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

    if (!body.userId || !body.title || !body.description || !body.platform || !body.budget || !body.skills) {
      return NextResponse.json(
        { error: 'userId, title, description, platform, budget, and skills are required' },
        { status: 400 }
      )
    }

    const job = await freelanceService.saveJob({
      ...body,
      skills: Array.isArray(body.skills) ? body.skills : body.skills.split(',').map((s: string) => s.trim())
    })
    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error saving job:', error)
    return NextResponse.json(
      { error: 'Failed to save job' },
      { status: 500 }
    )
  }
}