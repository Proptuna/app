"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This is just a redirect page to the documents-page
export default function DocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    // This ensures the redirect happens as soon as the component mounts
    router.replace("/documents-page");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-500">Redirecting to documents...</p>
      </div>
    </div>
  );
}
