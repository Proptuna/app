"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to AI page on load
    router.replace("/ai-page");
  }, [router]);
  
  // Return a simple loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading Proptuna...</p>
      </div>
    </div>
  );
}
