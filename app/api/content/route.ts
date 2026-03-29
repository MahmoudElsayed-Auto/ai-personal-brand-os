import { NextRequest, NextResponse } from 'next/server'
import { contentService } from '@/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const platform = searchParams.get('platform')
    const contentType = searchParams.get('contentType')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const contents = await contentService.getByUserId(userId)

    // Filter by platform and contentType if provided
    let filtered = contents
    if (platform) {
      filtered = filtered.filter(c => c.platform === platform)
    }
    if (contentType) {
      filtered = filtered.filter(c => c.type === contentType)
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.userId || !body.title || !body.type || !body.platform) {
      return NextResponse.json(
        { error: 'userId, title, type, and platform are required' },
        { status: 400 }
      )
    }

    const content = await contentService.create({
      userId: body.userId,
      title: body.title,
      type: body.type,
      platform: body.platform,
      description: body.description,
      slug: body.slug,
    })
    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}