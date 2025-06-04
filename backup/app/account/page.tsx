'use client';

import { useState } from 'react';
import Link from 'next/link';

type Tab = 'details' | 'preferences';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('details');

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="p-6">
            <h2 className="text-xl mb-4">my details</h2>
            {/* Details content will go here */}
          </div>
        );
      case 'preferences':
        return (
          <div className="p-6">
            <h2 className="text-xl mb-4">preferences</h2>
            {/* Preferences content will go here */}
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto pt-4">
        <div className="mb-6">
          <Link href="/" className="text-sm tracking-wider text-black hover:text-gray-600">
            ← back to feed
          </Link>
        </div>
        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 border-r">
            <nav className="pr-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`w-full text-left px-4 py-2 text-sm tracking-wider rounded-lg transition-colors ${
                      activeTab === 'details'
                        ? 'bg-gray-800 text-white'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    my details
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full text-left px-4 py-2 text-sm tracking-wider rounded-lg transition-colors ${
                      activeTab === 'preferences'
                        ? 'bg-gray-800 text-white'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    preferences
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
}
