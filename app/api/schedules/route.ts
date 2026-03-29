import { NextRequest, NextResponse } from 'next/server'
import { scheduleService } from '@/services'
import { getAuthenticatedUserId } from '@/lib/supabase.server'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    const schedules = await scheduleService.getByUserId(userId)

    // Filter by platform if provided
    const filtered = platform ? schedules.filter((s) => s.platform === platform) : schedules

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.contentId || !body.platform || !body.scheduledAt) {
      return NextResponse.json(
        { error: 'contentId, platform, and scheduledAt are required' },
        { status: 400 }
      )
    }

    // Pass the real authenticated user ID as context if needed by service
    const schedule = await scheduleService.create({ ...body, userId })
    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 })
  }
}
