'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  country?: string;
  createdAt?: Date;
}

interface DebugInfo {
  users: User[];
  userCount: number;
  logs: string[];
  timestamp: string;
}

interface EnvInfo {
  environment: string;
  hasNewsApiKey: boolean;
  newsApiKeyLength: number;
  nextVersion: string;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [envInfo, setEnvInfo] = useState<EnvInfo | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

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

  // Function to fetch environment info
  const fetchEnvInfo = async () => {
    try {
      const response = await fetch('/api/debug/env');
      const data = await response.json();
      setEnvInfo(data);
      console.log('Environment info fetched:', data);
    } catch (err) {
      console.error('Error fetching environment info:', err);
    }
  };

  // Set up auto-refresh when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch debug info immediately
      fetchDebugInfo();
      fetchEnvInfo();
      
      // Set up interval to refresh every 5 seconds
      const interval = setInterval(() => {
        fetchDebugInfo();
        fetchEnvInfo();
      }, 5000);
      setRefreshInterval(interval);
      
      // Clean up interval on unmount
      return () => {
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
      };
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.email === 'dan.somethingco@gmail.com' && credentials.password === '1234568Ds!') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-8">
          <h1 className="text-xl tracking-wider mb-8 text-center">admin login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-2 text-sm tracking-wider border-b border-gray-200 focus:border-gray-400 outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-sm tracking-wider text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-xl tracking-wider mb-8">admin panel</h1>
      
      {debugInfo ? (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg">users ({debugInfo.userCount})</h2>
              <button 
                onClick={fetchDebugInfo}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition-colors text-sm"
              >
                refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">id</th>
                    <th className="py-2 px-4 border-b text-left">email</th>
                    <th className="py-2 px-4 border-b text-left">name</th>
                    <th className="py-2 px-4 border-b text-left">created</th>
                  </tr>
                </thead>
                <tbody>
                  {debugInfo.users.length > 0 ? (
                    debugInfo.users.map(user => (
                      <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.id}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.firstName} {user.lastName}</td>
                        <td className="py-2 px-4 border-b">{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-2 px-4 border-b text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg mb-4">debug logs</h2>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
              {debugInfo.logs.length > 0 ? (
                <ul className="space-y-1">
                  {debugInfo.logs.map((log, index) => (
                    <li key={index} className="font-mono">{log}</li>
                  ))}
                </ul>
              ) : (
                <p>No logs available</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg mb-4">environment info</h2>
            {envInfo ? (
              <div className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-semibold">Environment:</div>
                  <div>{envInfo.environment}</div>
                  
                  <div className="font-semibold">News API Key:</div>
                  <div>{envInfo.hasNewsApiKey ? '✅ Present' : '❌ Missing'} (Length: {envInfo.newsApiKeyLength})</div>
                  
                  <div className="font-semibold">Next.js Runtime:</div>
                  <div>{envInfo.nextVersion}</div>
                  
                  <div className="font-semibold">Last Updated:</div>
                  <div>{new Date(envInfo.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ) : (
              <p>Loading environment information...</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p>Loading debug information...</p>
        </div>
      )}
      
      <button
        onClick={() => router.push('/')}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors"
      >
        back to home
      </button>
    </main>
  );
}
