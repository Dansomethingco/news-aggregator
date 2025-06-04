'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">Please try refreshing the page.</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
