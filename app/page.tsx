'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchNews } from '@/app/services/newsApiService';
import { Article } from '@/lib/mockNews';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const fetchNewsArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/news');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch news articles: ${errorText}`);
      }

      const data = await response.json();
      if (!data.articles) {
        throw new Error('Invalid response structure');
      }

      if (data.articles.length === 0) {
        setError('No articles found');
        return;
      }

      setArticles(data.articles);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch news articles');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <nav className="flex overflow-x-auto hide-scrollbar">
              <div className="flex min-w-full gap-2">
                <Link
                  href="/myaccount"
                  className="px-4 py-2 rounded-full text-sm font-rockwell-bold text-black hover:text-gray-600"
                  style={{
                    textTransform: 'lowercase'
                  }}
                >
                  my account
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Loading news...</p>
            </div>
          )}

          {error && (
            <div className="text-center mb-8">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">
                Try selecting a different category or check your country preference in settings.
              </p>
              <button
                onClick={() => fetchNewsArticles()}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div
                  key={article.url}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-2">{article.description}</p>
                    <p className="text-sm text-gray-500">{article.source.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {articles.length === 0 && !isLoading && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">No articles available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
