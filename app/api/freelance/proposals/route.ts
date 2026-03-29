import { NextRequest, NextResponse } from 'next/server'
import { freelanceService } from '@/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const proposals = await freelanceService.getProposals(userId)

    // Filter by status if provided
    const filtered = status
      ? proposals.filter(p => p.status === status)
      : proposals

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.userId || !body.jobId || !body.title || !body.coverLetter || !body.bidAmount || !body.timeline) {
      return NextResponse.json(
        { error: 'userId, jobId, title, coverLetter, bidAmount, and timeline are required' },
        { status: 400 }
      )
    }

    const proposal = await freelanceService.saveProposal(body)
    return NextResponse.json(proposal, { status: 201 })
  } catch (error) {
    console.error('Error saving proposal:', error)
    return NextResponse.json(
      { error: 'Failed to save proposal' },
      { status: 500 }
    )
  }
}