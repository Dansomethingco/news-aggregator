import { useState, useRef, useEffect } from 'react';
import { NewsArticle } from '@/app/services/newsApiService';
import Image from 'next/image';
import { format } from 'date-fns';

interface NewsStoryViewerProps {
  articles: NewsArticle[];
}

export default function NewsStoryViewer({ articles }: NewsStoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchEndX.current - touchStartX.current > 50) {
      handleSwipe('right');
    } else if (touchEndX.current - touchStartX.current < -50) {
      handleSwipe('left');
    }
  };

  const currentArticle = articles[currentIndex];

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
    >
      {/* Navigation buttons */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => handleSwipe('right')}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          ←
        </button>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => handleSwipe('left')}
          disabled={currentIndex === articles.length - 1}
          className="p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          →
        </button>
      </div>

      {/* Article content */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-8">
        {/* Title */}
        <h1 className="font-rockwell-bold text-4xl text-center mb-4">
          {currentArticle.title}
        </h1>

        {/* Image */}
        {currentArticle.urlToImage && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <Image
              src={currentArticle.urlToImage}
              alt={currentArticle.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Source and Category */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="font-rockwell-regular text-gray-600">
              Source: {currentArticle.source?.name || 'Unknown'}
            </span>
            <span className="font-rockwell-regular text-gray-600">
              Category: {currentArticle.category || 'General'}
            </span>
          </div>

          {/* Timestamp */}
          {currentArticle.publishedAt && (
            <span className="font-rockwell-regular text-gray-600">
              Published: {format(new Date(currentArticle.publishedAt), 'MMM d, yyyy HH:mm')}
            </span>
          )}
        </div>

        {/* Description */}
        {currentArticle.description && (
          <p className="font-rockwell-regular text-gray-800 text-center">
            {currentArticle.description}
          </p>
        )}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {articles.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-600 w-4'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
