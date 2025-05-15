'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsCategory } from './services/newsApi';
import { generateMockNews, Article } from '@/lib/mockNews';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState<NewsCategory>('general');
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchNewsArticles();
  }, [currentCategory]);

  const fetchNewsArticles = async () => {
    if (!isInitialized) {
      setIsInitialized(true);
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Page - Generating mock news for category:', currentCategory);
      
      // Use client-side mock news generator
      const response = generateMockNews(currentCategory);

      if (!response || !response.articles) {
        console.error('Page - Invalid response structure:', response);
        throw new Error('Invalid response structure');
      }

      console.log('Page - Articles generated:', response.articles.length);
      setArticles(response.articles);
    } catch (error: any) {
      console.error('Page - Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setError(error.message || 'Failed to generate news articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: NewsCategory) => {
    if (category !== currentCategory) {
      setCurrentCategory(category);
      setCurrentIndex(0);
    }
  };

  const categories: NewsCategory[] = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-600">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchNewsArticles}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-gray-600 mb-4">No articles found for {currentCategory}</p>
        <button 
          onClick={() => handleCategoryChange('general')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try General News
        </button>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <main className="min-h-screen bg-white relative">
      <div className="absolute z-10" style={{ top: '2rem', right: '2rem' }}>
        <Link 
          href="/signup"
          className="text-sm text-black hover:text-gray-600 transition-colors tracking-wider lowercase mr-4"
        >
          my account
        </Link>
        <Link 
          href="/test"
          className="text-sm text-black hover:text-gray-600 transition-colors tracking-wider lowercase"
        >
          test
        </Link>
      </div>
      <div className="max-w-[600px] mx-auto">
        <header className="text-center pt-4 pb-0.25">
          <div className="relative mb-1">
            <div className="w-[175px] h-[87.5px] relative mx-auto overflow-hidden flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Today Logo"
                fill
                priority
                className="object-contain scale-150 -translate-y-[10%]"
              />
            </div>
          </div>
          
          <div className="relative mb-1 -mr-2 overflow-hidden">
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-10 flex items-center justify-start pl-2">
                <span className="text-gray-400 text-xl drop-shadow-sm">&lt;</span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-10 flex items-center justify-end pr-2">
                <span className="text-gray-400 text-xl drop-shadow-sm">&gt;</span>
              </div>
              <div className="overflow-x-auto flex gap-2 pb-2 pl-3 pr-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-1.5 rounded-full flex-shrink-0 whitespace-nowrap text-sm tracking-wider ${currentCategory === category ? 'bg-gray-800 text-white' : 'text-black hover:bg-gray-100'}`}
                  >
                    {category.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <article className="px-4 pb-6">
          <h1 className="text-2xl font-bold leading-tight mb-4 text-black">
            {currentArticle.title}
          </h1>

          <div className="bg-[#003366] text-white px-4 py-2 flex justify-between mb-4 text-sm font-rockwell">
            <span>{currentArticle.source.name}</span>
            <span>{currentCategory}</span>
            <span>{new Date(currentArticle.publishedAt).toLocaleString()}</span>
          </div>

          <p className="text-black leading-relaxed mb-6 font-rockwell">
            {currentArticle.description}
          </p>

          <div className="relative mb-3">
            <Image
              src={currentArticle.urlToImage || '/placeholder-image.jpg'}
              alt={currentArticle.title}
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

          <div className="text-sm italic text-black mt-2 font-rockwell">
            {currentArticle.source.name} • {new Date(currentArticle.publishedAt).toLocaleDateString()}
          </div>

          <div className="text-base leading-relaxed mb-4 font-rockwell">
            {currentArticle.content}
          </div>

          <div className="flex justify-between py-4">
            <button
              onClick={() => currentIndex > 0 && setCurrentIndex(i => i - 1)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-gray-100"
              disabled={currentIndex === 0 || isLoading}
            >
              Previous
            </button>
            <button
              onClick={() => currentIndex < articles.length - 1 && setCurrentIndex(i => i + 1)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-gray-100"
              disabled={currentIndex === articles.length - 1 || isLoading}
            >
              Next
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}
