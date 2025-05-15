import { generateMockNews, Article, NewsResponse } from '@/lib/mockNews';

export type NewsCategory = 
  | 'breaking'
  | 'business'
  | 'technology'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'sports'
  | 'general';

// Re-export the Article type
export type { Article } from '@/lib/mockNews';

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface FetchNewsParams {
  category?: NewsCategory;
  pageSize?: number;
}

export async function fetchNews({ 
  category = 'general', 
  pageSize = 10
}: FetchNewsParams = {}): Promise<NewsApiResponse> {
  try {
    console.log('Client - Fetching news:', { category, pageSize });

    // Generate mock news directly
    const response = generateMockNews(category);

    if (!response || !response.articles) {
      console.error('Client - Invalid response structure:', response);
      throw new Error('Invalid response structure from mock generator');
    }

    console.log('Client - Mock data generated successfully:', { 
      articleCount: response.articles.length 
    });

    return response as NewsApiResponse;
  } catch (error: any) {
    console.error('Client - Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error('Failed to fetch news articles');
  }
}

export function convertToAppArticle(article: Article): Article {
  return {
    ...article,
    urlToImage: article.urlToImage || '/placeholder-image.jpg'
  };
}
