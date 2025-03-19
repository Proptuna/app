"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This is just a redirect page to the documents-page
export default function DocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/documents-page");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
    </div>
  );
}
