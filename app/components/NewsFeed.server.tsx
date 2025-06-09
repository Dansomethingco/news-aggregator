import { NewsArticle } from '@/app/services/newsApiService';
import NewsStoryViewer from '@/app/components/NewsStoryViewer';

export async function getNewsFeed() {
  const searchParams = new URLSearchParams(window.location.search);
  const category = searchParams.get('category')?.toLowerCase() || 'general';

  const response = await fetch(`/api/news?category=${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch news articles');
  }

  const data = await response.json();
  return data.articles || [];
}

export default async function NewsFeed() {
  const articles = await getNewsFeed();
  return <NewsFeedClient articles={articles} />;
}

interface NewsFeedClientProps {
  articles: NewsArticle[];
}

function NewsFeedClient({ articles }: NewsFeedClientProps) {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <NewsStoryViewer articles={articles} />
    </div>
  );
}
