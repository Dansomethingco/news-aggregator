'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting user details:', formData);
      
      const response = await fetch('/api/user/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Details submission response status:', response.status);
      
      const data = await response.json();
      console.log('Details submission response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save details');
      }

      console.log('Details saved successfully, redirecting to preferences page');
      
      // In development mode, fetch updated debug info
      if (debugMode) {
        await fetchDebugInfo();
      }
      
      // Redirect to preferences page after successful submission
      router.push('/preferences');
    } catch (err: any) {
      console.error('Error saving details:', err);
      setError(err.message || 'An error occurred');
      
      // In development mode, fetch updated debug info on error too
      if (debugMode) {
        await fetchDebugInfo();
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md px-8">
        <h1 className="text-xl tracking-wider mb-2 text-center">tell us about yourself</h1>
        <p className="text-sm text-gray-500 mb-8 text-center tracking-wider">
          we'll use this to personalize your experience
        </p>
        
        {debugMode && (
          <div className="mb-6 p-4 bg-gray-100 rounded-md text-xs overflow-auto max-h-40">
            <p className="font-bold mb-1">Development Mode</p>
            {debugInfo && (
              <>
                <p>User Count: {debugInfo.userCount}</p>
                <p>Latest Log: {debugInfo.logs[debugInfo.logs.length - 1]}</p>
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

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="surname"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1 tracking-wider">
              date of birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
              required
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-sm tracking-wider text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'saving...' : 'continue'}
            </button>
          </div>
          
          <div className="text-center">
            <Link href="/preferences" className="text-sm text-gray-500 hover:text-gray-700 tracking-wider">
              skip for now
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
