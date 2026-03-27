import { NextRequest, NextResponse } from 'next/server'
import { scriptService } from '@/services'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.contentId || !body.scriptType || !body.content) {
      return NextResponse.json(
        { error: 'contentId, scriptType, and content are required' },
        { status: 400 }
      )
    }

    const script = await scriptService.saveScript(body)
    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    console.error('Error saving script:', error)
    return NextResponse.json(
      { error: 'Failed to save script' },
      { status: 500 }
    )
  }
}