"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePreferences } from '../contexts/PreferencesContext'

export default function Header() {
  const { preferences } = usePreferences()

  return (
    <>
      {/* Large centered logo */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Today Logo"
                width={180}
                height={180}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <nav className="hidden md:flex space-x-8">
                {/* Categories will be added here */}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/myaccount"
                className="font-rockwell-regular text-black text-sm tracking-wider hover:text-gray-600 transition-colors"
              >
                my account
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
