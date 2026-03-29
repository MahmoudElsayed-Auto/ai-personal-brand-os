import { NextRequest, NextResponse } from 'next/server'
import { agentService } from '@/services'
import { AgentType } from '@prisma/client'
import { getAuthenticatedUserId } from '@/lib/supabase.server'

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 })
    }

    // Validate agent type
    if (!Object.values(AgentType).includes(body.type)) {
      return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 })
    }

    const task = await agentService.triggerTask({
      userId: userId,
      agentType: body.type,
      input: JSON.stringify(body.input || {}),
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error triggering agent task:', error)
    return NextResponse.json({ error: 'Failed to trigger agent task' }, { status: 500 })
  }
}
