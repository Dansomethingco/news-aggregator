'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Function to fetch debug info
  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      setDebugInfo(data);
    } catch (err) {
      console.error('Error fetching debug info:', err);
    }
  };

  // Fetch debug info on mount
  useEffect(() => {
    fetchDebugInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign up with:', { email: formData.email });
      
      // Actual signup logic
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('Signup response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Signup response data:', data);
      } catch (jsonError) {
        console.error('Error parsing response JSON:', jsonError);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      console.log('Signup successful, redirecting to details page');
      // Fetch updated debug info
      await fetchDebugInfo();
      
      // Redirect to details page after successful signup
      router.push('/details');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
      // Fetch updated debug info on error too
      await fetchDebugInfo();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-8">
        <div className="text-center mb-12">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={240}
            height={80}
            className="mx-auto"
          />
        </div>

        {debugInfo && (
          <div className="mb-6 p-4 bg-gray-100 rounded-md text-xs overflow-auto max-h-40">
            <p className="font-bold mb-1">Debug Info:</p>
            <p>User Count: {debugInfo.userCount}</p>
            <p>Latest Log: {debugInfo.logs[debugInfo.logs.length - 1]}</p>
            <button 
              type="button" 
              onClick={fetchDebugInfo}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              Refresh Debug Info
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm tracking-wider text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'signing up...' : 'sign up'}
          </button>
        </form>
      </div>
    </main>
  );
}
