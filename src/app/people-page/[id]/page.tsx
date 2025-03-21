"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPersonById } from '@/lib/people-client';

export default function PersonRedirect({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAndRedirect = async () => {
      try {
        // Verify the person exists before redirecting
        const personExists = await fetchPersonById(params.id);
        
        if (personExists) {
          // Redirect to the people page with explicit instruction to open
          router.replace(`/people-page?personId=${params.id}&view=true`);
        } else {
          setError(`Person with ID ${params.id} not found`);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error verifying person:", err);
        setError(`Error loading person: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };
    
    if (params.id) {
      loadAndRedirect();
    } else {
      router.replace('/people-page');
    }
  }, [params.id, router]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">Person Not Found</h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/people-page')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to People
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300">Loading person details...</p>
      </div>
    </div>
  );
}
