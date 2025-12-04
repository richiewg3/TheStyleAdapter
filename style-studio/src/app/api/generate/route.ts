import { NextRequest, NextResponse } from 'next/server';
import { generateStyledImage } from '@/lib/gemini';

export const maxDuration = 120; // Allow up to 120 seconds for image generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, structureReference, styleReference } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 5000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 5000 characters.' },
        { status: 400 }
      );
    }

    // Generate the styled image
    const imageUrl = await generateStyledImage(
      prompt,
      structureReference,
      styleReference
    );

    return NextResponse.json({
      imageUrl,
      metadata: {
        model: 'gemini-2.0-flash-exp-image-generation',
        timestamp: new Date().toISOString(),
        hasStructureRef: !!structureReference,
        hasStyleRef: !!styleReference,
      },
    });
  } catch (error) {
    console.error('Generate API Error:', error);
    
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

      // Check for content filtering
      if (error.message.includes('blocked') || error.message.includes('safety')) {
        return NextResponse.json(
          { error: 'Content was blocked by safety filters. Please try a different prompt.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while generating the image.' },
      { status: 500 }
    );
  }
}
