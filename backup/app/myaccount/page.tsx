'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePreferences } from '../contexts/PreferencesContext';

type Tab = 'details' | 'preferences' | 'disclaimer';

export default function MyAccount() {
  const { preferences, updatePreferences } = usePreferences();
  const [activeTab, setActiveTab] = useState('details');

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 font-rockwell tracking-wider lowercase">my details</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 md:mb-0 md:mr-6">
                  <Image 
                    src="https://picsum.photos/id/1005/200/200" 
                    alt="Profile picture" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-rockwell tracking-wider lowercase">john doe</h3>
                  <p className="text-gray-900 mb-2 font-rockwell tracking-wider lowercase text-base font-medium">john.doe@example.com</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-rockwell tracking-wider lowercase">
                    change profile picture
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-1">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="John"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="Doe"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="john.doe@example.com"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="1990-01-01"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="United Kingdom"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-rockwell tracking-wider lowercase">
                  edit details
                </button>
              </div>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 font-rockwell tracking-wider lowercase text-gray-900">my preferences</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 font-rockwell tracking-wider lowercase text-gray-900">news categories</h3>
                <p className="text-gray-900 mb-4 font-rockwell tracking-wider lowercase text-lg font-medium">select the categories you're interested in:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-gray-900 p-4 rounded-md">
                  {['General', 'Business', 'Technology', 'Sports', 'Entertainment', 'Health', 'Science'].map((category) => (
                    <label key={category} className="flex items-center space-x-3 py-2">
                      <input 
                        type="checkbox" 
                        className="h-6 w-6 text-white rounded focus:ring-white"
                        checked={preferences.categories.includes(category)}
                        onChange={(e) => {
                          updatePreferences({
                            categories: e.target.checked 
                              ? [...preferences.categories, category]
                              : preferences.categories.filter(c => c !== category)
                          });
                        }}
                      />
                      <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">{category.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 font-rockwell tracking-wider lowercase text-gray-900">content preferences</h3>
                <p className="text-gray-900 mb-4 font-rockwell tracking-wider lowercase text-lg font-medium">customize your content preferences:</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-1 font-rockwell tracking-wider lowercase">
                      article length
                    </label>
                    <select 
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 bg-gray-900 text-white text-lg font-rockwell tracking-wider lowercase"
                      value={preferences.articleLength}
                      onChange={(e) => updatePreferences({ articleLength: e.target.value })}
                    >
                      <option value="short" className="font-rockwell tracking-wider lowercase bg-gray-900 text-white">short articles</option>
                      <option value="medium" className="font-rockwell tracking-wider lowercase bg-gray-900 text-white">medium articles</option>
                      <option value="long" className="font-rockwell tracking-wider lowercase bg-gray-900 text-white">long articles</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-1 font-rockwell tracking-wider lowercase">
                      content type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 py-2 bg-gray-900 rounded-md p-2 mb-1">
                        <input type="checkbox" className="h-6 w-6 text-white rounded focus:ring-white" defaultChecked />
                        <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">text articles</span>
                      </label>
                      <label className="flex items-center space-x-3 py-2 bg-gray-900 rounded-md p-2 mb-1">
                        <input type="checkbox" className="h-6 w-6 text-white rounded focus:ring-white" defaultChecked />
                        <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">videos</span>
                      </label>
                      <label className="flex items-center space-x-3 py-2 bg-gray-900 rounded-md p-2 mb-1">
                        <input type="checkbox" className="h-6 w-6 text-white rounded focus:ring-white" defaultChecked />
                        <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">podcasts</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 font-rockwell tracking-wider lowercase text-gray-900">notification settings</h3>
                <p className="text-gray-900 mb-4 font-rockwell tracking-wider lowercase text-lg font-medium">choose how you want to be notified:</p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 py-2 bg-gray-900 rounded-md p-2 mb-1">
                    <input type="checkbox" className="h-6 w-6 text-white rounded focus:ring-white" defaultChecked />
                    <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">breaking news alerts</span>
                  </label>
                  <label className="flex items-center space-x-3 py-2 bg-gray-900 rounded-md p-2 mb-1">
                    <input type="checkbox" className="h-6 w-6 text-white rounded focus:ring-white" defaultChecked />
                    <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">daily news digest</span>
                  </label>
                  <label className="flex items-center space-x-3 py-2 bg-gray-900 rounded-md p-2 mb-1">
                    <input type="checkbox" className="h-6 w-6 text-white rounded focus:ring-white" />
                    <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">recommended stories</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-rockwell tracking-wider lowercase">
                  save preferences
                </button>
              </div>
            </div>
          </div>
        );
      case 'disclaimer':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 font-rockwell tracking-wider lowercase">disclaimer</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="prose max-w-none">
                <p className="text-gray-900 mb-4 font-rockwell tracking-wider lowercase text-base font-medium">this section will contain the disclaimer text. currently, it is a placeholder that will be updated with the final text.</p>
                <p className="text-gray-900 mb-4 font-rockwell tracking-wider lowercase text-base font-medium">the disclaimer will provide important information about the terms of use, data privacy, and other legal considerations for users of the news aggregator application.</p>
                <div className="mt-8 p-4 bg-gray-100 rounded-md">
                  <h3 className="text-lg font-semibold mb-2 font-rockwell tracking-wider lowercase">acknowledgment</h3>
                  <label className="flex items-center space-x-3 py-2 bg-gray-900 rounded-md p-2 mb-1">
                    <input type="checkbox" className="h-6 w-6 text-white rounded focus:ring-white" />
                    <span className="font-rockwell tracking-wider lowercase text-white text-lg font-medium">i have read and agree to the disclaimer</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto pt-6 px-4">
        <div className="mb-6">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            back to news feed
          </Link>
        </div>
        
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
          <h1 className="text-3xl font-bold font-rockwell tracking-wider lowercase">my account</h1>
        </header>
        
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'details'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    my details
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'preferences'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    my preferences
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('disclaimer')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'disclaimer'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    disclaimer
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
