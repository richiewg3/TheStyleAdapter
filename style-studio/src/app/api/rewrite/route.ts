import { NextRequest, NextResponse } from 'next/server';
import { rewritePrompt } from '@/lib/gemini';

export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalPrompt, referenceImage } = body;

    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Original prompt is required' },
        { status: 400 }
      );
    }

    if (originalPrompt.length > 5000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 5000 characters.' },
        { status: 400 }
      );
    }

    // Rewrite the prompt
    const rewrittenPrompt = await rewritePrompt(originalPrompt, referenceImage);

    return NextResponse.json({
      rewrittenPrompt,
      metadata: {
        model: 'gemini-2.0-flash',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Rewrite API Error:', error);
    
    if (error instanceof Error) {
      // Check for API key errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API key not configured. Please set GOOGLE_AI_API_KEY environment variable.' },
          { status: 500 }
        );
      }
      
      // Check for rate limiting
      if (error.message.includes('429') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while rewriting the prompt.' },
      { status: 500 }
    );
  }
}
