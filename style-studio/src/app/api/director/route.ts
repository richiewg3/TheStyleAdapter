import { NextRequest, NextResponse } from 'next/server';
import { generateDirectorTreatment } from '@/lib/gemini';

export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conceptText, referenceImage } = body;

    if (!conceptText || typeof conceptText !== 'string') {
      return NextResponse.json(
        { error: 'Concept text is required' },
        { status: 400 }
      );
    }

    if (conceptText.length > 2000) {
      return NextResponse.json(
        { error: 'Concept text is too long. Maximum 2000 characters.' },
        { status: 400 }
      );
    }

    // Generate the Director's Treatment
    const treatment = await generateDirectorTreatment(conceptText, referenceImage);

    return NextResponse.json({
      treatment,
      metadata: {
        model: 'gemini-2.0-flash',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Director API Error:', error);
    
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
      { error: 'An unexpected error occurred while generating the treatment.' },
      { status: 500 }
    );
  }
}
