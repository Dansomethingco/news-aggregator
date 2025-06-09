import { NewsArticle } from '@/app/services/newsApiService';
import NewsStoryViewer from '@/app/components/NewsStoryViewer';
import { getNewsByCategory } from '@/app/services/newsApiService';

export default async function NewsFeed({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category?.toLowerCase() || 'general';
  const articles = await getNewsByCategory(category);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <NewsStoryViewer articles={articles} />
    </div>
  );
}
}
