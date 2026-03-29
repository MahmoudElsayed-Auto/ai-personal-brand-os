import { NextRequest, NextResponse } from 'next/server'
import { scriptService } from '@/services'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.contentId || !body.scriptText) {
      return NextResponse.json(
        { error: 'contentId and scriptText are required' },
        { status: 400 }
      )
    }

    const script = await scriptService.save({
      contentId: body.contentId,
      scriptText: body.scriptText,
      hooks: body.hooks,
      cta: body.cta,
      metadata: body.metadata
    })
    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    console.error('Error saving script:', error)
    return NextResponse.json(
      { error: 'Failed to save script' },
      { status: 500 }
    )
  }
}
