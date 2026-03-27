import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/services/agents/contentAgent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, platform = 'youtube' } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const result = await generateScript(topic.trim(), platform);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Content Agent API',
    endpoints: {
      'POST /api/agents/content': {
        body: { topic: 'string', platform: 'youtube | instagram | tiktok | twitter | linkedin (optional)' },
        response: { title: 'string', hooks: 'string[]', script: 'string', cta: 'string' }
      }
    }
  });
}