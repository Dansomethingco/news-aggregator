// Mock news data generator for client-side use
// This replaces the server-side API route for static export compatibility

// Valid categories
export const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

// Article type definition
export interface Article {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsResponse {
  status: string;
  totalResults?: number;
  articles: Article[];
  message?: string;
}

// Generate mock news data
export function generateMockNews(category: string = 'general'): NewsResponse {
  // Default to 'general' if category is invalid
  const validCategory = categories.includes(category) ? category : 'general';
  
  const articles: Article[] = [];
  // Generate 10 mock articles
  for (let i = 1; i <= 10; i++) {
    articles.push({
      source: { 
        id: `source-${i}`, 
        name: `${validCategory.charAt(0).toUpperCase() + validCategory.slice(1)} News ${i}` 
      },
      author: `Author ${i}`,
      title: `${validCategory.charAt(0).toUpperCase() + validCategory.slice(1)} News Article ${i}`,
      description: `This is a mock description for a ${validCategory} news article.`,
      url: 'https://example.com',
      urlToImage: `https://picsum.photos/id/${(i * 10) + categories.indexOf(validCategory)}/600/400`,
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is mock content for ${validCategory} news.`,
    });
  }
  
  return { 
    status: 'ok', 
    totalResults: articles.length,
    articles 
  };
}
