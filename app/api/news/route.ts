import { NextRequest, NextResponse } from 'next/server';
import { fetchNews } from '@/app/services/newsApiService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category')?.toLowerCase() || 'general';
    const country = searchParams.get('country') || 'gb'; // Default to Great Britain
    
    const articles = await fetchNews(category, country);
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
