'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TestUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  country?: string;
  createdAt?: string;
}

export default function TestPage() {
  const [users, setUsers] = useState<TestUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test/user');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/test/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message || 'User created successfully');
        setFormData({ email: '', password: '' });
        fetchUsers(); // Refresh the user list
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-xl tracking-wider mb-8">test page</h1>
      
      <div className="mb-8 max-w-md">
        <h2 className="text-lg mb-4">create test user</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'creating...' : 'create user'}
          </button>
        </form>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">current users ({users.length})</h2>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition-colors text-sm disabled:bg-gray-100"
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
              {users.length > 0 ? (
                users.map(user => (
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
      
      <div className="space-x-4">
        <Link href="/" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors inline-block">
          home
        </Link>
        <Link href="/admin" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors inline-block">
          admin
        </Link>
      </div>
    </main>
  );
}
