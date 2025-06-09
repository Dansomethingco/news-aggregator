'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePreferences } from './contexts/PreferencesContext';
import { useSearchParams } from 'next/navigation';
import { NewsArticle } from '@/app/services/newsApiService';
import NewsStoryViewer from '@/app/components/NewsStoryViewer';

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { preferences } = usePreferences();

  useEffect(() => {
    const currentCategory = searchParams.get('category')?.toLowerCase() || 'general';

    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/news?category=${currentCategory}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          setError(`Failed to fetch news: ${errorText}`);
          return;
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError('Failed to fetch news articles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-rockwell-bold mb-4">Loading news...</h1>
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-rockwell-bold mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-rockwell-bold mb-4">No articles found</h1>
          <p className="text-gray-600">Try selecting a different category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-rockwell-bold">News</h1>
          <div className="flex gap-4">
            {preferences.categories.map((cat: string) => (
              <Link
                key={cat.toLowerCase()}
                href={`/category/${cat.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-rockwell-bold ${
                  cat.toLowerCase() === searchParams.get('category')?.toLowerCase()
                    ? 'bg-[#003366] text-white'
                    : 'text-black hover:text-gray-600'
                }`}
              >
                {cat.toLowerCase()}
              </Link>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <NewsStoryViewer articles={articles} />
        </div>
      </div>
    </div>
  );
}
