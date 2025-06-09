import { Suspense } from 'react';
import Link from 'next/link';
import { usePreferences } from './contexts/PreferencesContext';
import { useSearchParams } from 'next/navigation';
import NewsFeed from './components/NewsFeed.server';

export default function Home() {
  const searchParams = useSearchParams();
  const { preferences } = usePreferences();

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
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-rockwell-bold mb-4">Loading news...</h1>
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        }>
          <NewsFeed />
        </Suspense>
      </div>
    </div>
  );
}
