import { NextRequest, NextResponse } from 'next/server'
import { scriptService } from '@/services'

export async function GET(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const scripts = await scriptService.getByContentId(params.contentId)

    return NextResponse.json(scripts)
  } catch (error) {
    console.error('Error fetching scripts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}