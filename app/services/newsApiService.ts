import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

// Log environment setup
console.log('Environment setup:', {
  hasApiKey: !!NEWS_API_KEY,
  apiKeyLength: NEWS_API_KEY ? NEWS_API_KEY.length : 0,
  envLoaded: process.env.NEXT_PUBLIC
});

if (!NEWS_API_KEY) {
  throw new Error('NEWS_API_KEY environment variable is not set');
}
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

export interface NewsArticle {
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

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  message?: string;
}

export async function fetchNews(category: string): Promise<NewsArticle[]> {
  try {
    console.log('Fetching news for:', { category });
    
    // Normalize category
    const normalizedCategory = category.toLowerCase();
    
    // Validate category
    const validCategories = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];
    if (!validCategories.includes(normalizedCategory)) {
      console.warn('Invalid category:', category, 'using default: general');
      return [];
    }

    // Build query parameters
    const url = `${NEWS_API_URL}?category=${normalizedCategory}&apiKey=${NEWS_API_KEY}&language=en`;
    console.log('API URL:', url);
    console.log('Request Headers:', { 'User-Agent': 'Next.js News Aggregator' });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Next.js News Aggregator'
      }
    });

    const apiData = await response.json();
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('API Response Data:', {
      status: apiData.status,
      totalResults: apiData.totalResults,
      articlesCount: apiData.articles?.length,
      message: apiData.message
    });

    console.log('API Response:', {
      status: apiData.status,
      totalResults: apiData.totalResults,
    });

    if (!response.ok) {
      console.error('API Error:', apiData);
      throw new Error(apiData.message || `API request failed with status ${response.status}`);
    }

    if (apiData.status !== 'ok') {
      console.error('API Status Error:', apiData);
      throw new Error(apiData.message || 'API returned non-ok status');
      throw new Error(`News API request failed: ${apiData.message || 'Unknown error'}`);
    }

    if (apiData.articles.length === 0) {
      console.log('No articles found for category:', normalizedCategory);
      return [];
    }

    return apiData.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`/api/news?category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news articles');
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news articles');
  }
}
