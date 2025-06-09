import { NewsArticle } from '@/app/services/newsApiService';

interface NewsFeedProps {
  articles: NewsArticle[];
}

export default function NewsFeed({ articles }: NewsFeedProps) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-rockwell-bold">News</h1>
          <div className="flex gap-4">
            {/* Categories will be handled by the client component */}
          </div>
        </div>
        <NewsStoryViewer articles={articles} />
      </div>
    </div>
  );
}
