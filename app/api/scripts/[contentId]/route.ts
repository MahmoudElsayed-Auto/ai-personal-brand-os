import { NextRequest, NextResponse } from 'next/server'
import { scriptService } from '@/services'
import { ScriptType } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const scriptType = searchParams.get('scriptType') as ScriptType | null

    const scripts = await scriptService.getByContentId(params.contentId)

    // Filter by scriptType if provided
    const filtered = scriptType
      ? scripts.filter(s => s.scriptType === scriptType)
      : scripts

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching scripts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}