import { NextRequest, NextResponse } from 'next/server'
import { generateProposal } from '@/services/freelance/proposalGenerator'
import { jobService } from '@/services/freelance/jobService'
import { getAuthenticatedUserId } from '@/lib/supabase.server'

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.jobId || !body.jobTitle || !body.jobDescription) {
      return NextResponse.json(
        { error: 'jobId, jobTitle, and jobDescription are required' },
        { status: 400 }
      )
    }

    // 1. Generate the proposal content using AI
    const proposalOutput = await generateProposal({
      jobTitle: body.jobTitle,
      jobDescription: body.jobDescription,
      budget: body.budget,
      clientName: body.clientName,
      freelancerName: body.freelancerName,
      freelancerSkills: body.freelancerSkills,
    })

    // 2. Save it to DB with DRAFT status
    const savedProposal = await jobService.createProposal(
      body.jobId,
      userId,
      proposalOutput.content
    )

    return NextResponse.json(savedProposal, { status: 201 })
  } catch (error: any) {
    console.error('Error generating and saving proposal:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate proposal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.proposalId || !body.status) {
      return NextResponse.json({ error: 'proposalId and status are required' }, { status: 400 })
    }

    // Approval system: DRAFT -> ACCEPTED (Approved) -> SUBMITTED (Sent)
    const updated = await jobService.updateProposalStatus(body.proposalId, body.status)

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating proposal status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update proposal status' },
      { status: 500 }
    )
  }
}
