import { NextRequest, NextResponse } from 'next/server'
import { agentService } from '@/services'
import { AgentType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.userId || !body.type) {
      return NextResponse.json(
        { error: 'userId and type are required' },
        { status: 400 }
      )
    }

    // Validate agent type
    if (!Object.values(AgentType).includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid agent type' },
        { status: 400 }
      )
    }

    const task = await agentService.triggerTask({
      userId: body.userId,
      agentType: body.type,
      input: JSON.stringify(body.input || {})
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error triggering agent task:', error)
    return NextResponse.json(
      { error: 'Failed to trigger agent task' },
      { status: 500 }
    )
  }
}