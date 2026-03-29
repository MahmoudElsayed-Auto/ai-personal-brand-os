import { NextRequest, NextResponse } from 'next/server'
import { runContentPipeline } from '@/services/agents/orchestrator'
import { getAuthenticatedUserId } from '@/lib/supabase.server'

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 })
    }

    // Trigger the orchestrator pipeline
    const result = await runContentPipeline(userId, body.topic)

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error running agent pipeline:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to run agent pipeline' },
      { status: 500 }
    )
  }
}
