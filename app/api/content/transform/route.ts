import { NextRequest, NextResponse } from 'next/server'
import { transformContent } from '@/services/transformer/contentTransformer'
import { getAuthenticatedUserId } from '@/lib/supabase.server'

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'content text is required' }, { status: 400 })
    }

    const result = await transformContent({
      content: body.content,
      sourceFormat: body.sourceFormat,
      tone: body.tone,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error transforming content:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to transform content' },
      { status: 500 }
    )
  }
}
