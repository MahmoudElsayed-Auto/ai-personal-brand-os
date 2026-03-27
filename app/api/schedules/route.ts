import { NextRequest, NextResponse } from 'next/server'
import { scheduleService } from '@/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const platform = searchParams.get('platform')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const schedules = await scheduleService.getByUserId(userId)

    // Filter by platform if provided
    const filtered = platform
      ? schedules.filter(s => s.platform === platform)
      : schedules

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.userId || !body.contentId || !body.platform || !body.scheduledAt) {
      return NextResponse.json(
        { error: 'userId, contentId, platform, and scheduledAt are required' },
        { status: 400 }
      )
    }

    const schedule = await scheduleService.create(body)
    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}