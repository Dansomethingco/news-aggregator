'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsCategory } from './services/newsApi';
import { Article } from '@/lib/mockNews';
import { usePreferences } from './contexts/PreferencesContext';

export default function Home() {
  const { preferences } = usePreferences();
  const [currentCategory, setCurrentCategory] = useState<NewsCategory>('general');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsArticles();
  }, [currentCategory]);

  const fetchNewsArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const country = preferences?.country?.toLowerCase() || 'gb';
      const response = await fetch(`/api/news?category=${currentCategory}&country=${country}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch news articles: ${errorText}`);
      }

      const data = await response.json();
      if (!data.articles) {
        throw new Error('Invalid response structure');
      }

      if (data.articles.length === 0) {
        setError('No articles found for this category and country combination');
        return;
      }

      setArticles(data.articles);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch news articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: NewsCategory) => {
    setCurrentCategory(category);
  };

  const categories: NewsCategory[] = preferences.categories.map(cat => cat.toLowerCase() as NewsCategory);

  return (
    <div className="min-h-screen">
      <div className="absolute z-10 top-4 right-4">
        <Link 
          href="/myaccount"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          My Account
        </Link>
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Today Logo"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
            </Link>
            <nav className="hidden md:block">
              <div className="flex space-x-8">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      category === currentCategory
                        ? 'bg-red-500 text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="bg-red-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Today's News</h1>
        </div>
      </div>

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
              <p className="text-gray-500">No articles available for this category</p>
              <button 
                onClick={() => handleCategoryChange('general')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try General News
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
