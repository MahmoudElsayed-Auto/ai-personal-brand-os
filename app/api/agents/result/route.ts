import { NextRequest, NextResponse } from 'next/server'
import { agentService } from '@/services'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.taskId || !body.result) {
      return NextResponse.json(
        { error: 'taskId and result are required' },
        { status: 400 }
      )
    }

    const task = await agentService.saveResult(body.taskId, body.result)
    return NextResponse.json(task)
  } catch (error) {
    console.error('Error saving agent result:', error)
    return NextResponse.json(
      { error: 'Failed to save agent result' },
      { status: 500 }
    )
  }
}