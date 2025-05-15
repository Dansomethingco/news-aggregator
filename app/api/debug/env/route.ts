import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return a sanitized version of environment variables
    // NEVER expose sensitive information like API keys or secrets
    return NextResponse.json({
      environment: process.env.NODE_ENV || 'unknown',
      hasNewsApiKey: !!process.env.NEXT_PUBLIC_NEWS_API_KEY,
      newsApiKeyLength: process.env.NEXT_PUBLIC_NEWS_API_KEY?.length || 0,
      nextVersion: process.env.NEXT_RUNTIME || 'unknown',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in env debug endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Environment debug endpoint error' },
      { status: 500 }
    );
  }
}
