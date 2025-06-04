import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY || 'ee5ff44e5ba240dc91d5d2289077d65d';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  message?: string;
}

export async function fetchNews(category: string, country: string): Promise<NewsArticle[]> {
  try {
    // Normalize category and country
    const normalizedCategory = category.toLowerCase();
    const normalizedCountry = country.toLowerCase();
    
    // Validate category
    const validCategories = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];
    if (!validCategories.includes(normalizedCategory)) {
      console.warn('Invalid category:', category, 'using default: general');
      return [];
    }

    // Validate country
    if (!normalizedCountry) {
      console.warn('No country specified, using default: gb');
      return [];
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      category: normalizedCategory,
      country: normalizedCountry,
      apiKey: NEWS_API_KEY,
      language: 'en'
    });

    console.log('Fetching news with params:', Object.fromEntries(queryParams));
    
    const response = await fetch(`${NEWS_API_URL}?${queryParams}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data: NewsApiResponse = await response.json();
    
    if (data.status !== 'ok') {
      console.error('API Response Error:', data);
      throw new Error(`News API request failed: ${data.message || 'Unknown error'}`);
    }

    if (data.articles.length === 0) {
      console.log('No articles found for category:', normalizedCategory, 'country:', normalizedCountry);
      return [];
    }

    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getNewsByCategory(category: string, country: string): Promise<NextResponse> {
  try {
    const articles = await fetchNews(category, country);
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error in getNewsByCategory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
