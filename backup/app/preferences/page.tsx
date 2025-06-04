'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PreferencesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([
    { id: 'tech', name: 'Technology', selected: false },
    { id: 'business', name: 'Business', selected: false },
    { id: 'science', name: 'Science', selected: false },
    { id: 'health', name: 'Health', selected: false },
    { id: 'entertainment', name: 'Entertainment', selected: false },
    { id: 'sports', name: 'Sports', selected: false },
    { id: 'politics', name: 'Politics', selected: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [debugMode, setDebugMode] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Check if we're in development mode
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    setDebugMode(isDev);
    
    // Fetch debug info in development mode
    if (isDev) {
      fetchDebugInfo();
    }
  }, []);
  
  // Function to fetch debug info
  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      setDebugInfo(data);
      console.log('Debug info fetched:', data);
    } catch (err) {
      console.error('Error fetching debug info:', err);
    }
  };

  const toggleCategory = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, selected: !cat.selected } : cat
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Log the selected categories in development mode
    if (debugMode) {
      const selectedCategories = categories.filter(cat => cat.selected).map(cat => cat.name);
      console.log('Selected categories:', selectedCategories);
      await fetchDebugInfo();
    }
    
    // In a real app, we would save these preferences to the database
    // For now, we'll just simulate a successful save
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[600px] mx-auto pt-12 px-8">
        <div className="text-center mb-8">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={180}
            height={60}
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-xl tracking-wider mb-8 text-center">
          let's personalize your feed
        </h1>
        
        {debugMode && (
          <div className="mb-6 p-4 bg-gray-100 rounded-md text-xs overflow-auto max-h-40">
            <p className="font-bold mb-1">Development Mode</p>
            {debugInfo && (
              <>
                <p>User Count: {debugInfo.userCount}</p>
                {debugInfo.users && debugInfo.users.length > 0 && (
                  <p>Latest User: {debugInfo.users[0].firstName || 'Unknown'} {debugInfo.users[0].lastName || 'User'}</p>
                )}
                <button 
                  type="button" 
                  onClick={fetchDebugInfo}
                  className="mt-2 text-xs text-blue-600 hover:underline"
                >
                  Refresh Debug Info
                </button>
              </>
            )}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 text-green-600 p-4 rounded-md text-center mb-8">
            <p className="text-sm tracking-wider mb-2">preferences saved successfully!</p>
            <p className="text-xs text-green-500">redirecting to home page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4 tracking-wider">select categories you're interested in:</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <div 
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${category.selected ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400'}`}
                  >
                    <p className="text-sm tracking-wider">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-sm tracking-wider text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'saving...' : 'save preferences'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
