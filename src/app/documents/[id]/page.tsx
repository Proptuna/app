"use client";

import React, { useState, useEffect } from "react";
import { fetchDocumentById } from "@/lib/documents-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadDocument = async () => {
      try {
        console.log("Loading document with ID:", params.id);
        setIsLoading(true);
        
        if (!params.id) {
          console.error("Invalid document ID");
          setError("Invalid document ID");
          setIsLoading(false);
          return;
        }
        
        console.log("Making API call to fetch document...");
        const doc = await fetchDocumentById(params.id);
        console.log("Document loaded successfully:", doc.title);
        
        if (!doc) {
          console.error("Document not found");
          setError("Document not found");
          setIsLoading(false);
          return;
        }
        
        setDocument(doc);
        setError(null);
        
        // Update the URL to use the correct documents-page path for consistency
        // but do this silently without affecting browser history
        window.history.replaceState(
          {}, 
          document.title, 
          `/documents-page?docId=${params.id}`
        );
      } catch (err: any) {
        console.error("Error loading document:", err);
        setError(err.message || "Failed to load document");
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [params.id]);

  const handleDownload = () => {
    if (!document) return;

    // For markdown documents, we can create a blob and download it
    if (document.type === "markdown") {
      const blob = new Blob([document.data], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${document.title}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push('/documents-page')} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Button>
        
        {!isLoading && document && (
          <Button 
            variant="outline"
            onClick={handleDownload} 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <div className="space-y-2 mt-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="my-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/documents-page')}
              >
                Return to Documents
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : document && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{document.title}</h1>
              <Badge variant="outline">{document.type}</Badge>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              <p>Created: {formatDate(document.created_at)}</p>
              <p>Last Updated: {formatDate(document.updated_at)}</p>
              <p>Visibility: {document.visibility}</p>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              {document.type === "markdown" ? (
                <div className="whitespace-pre-wrap border p-4 rounded-md bg-gray-50 dark:bg-gray-900">
                  {document.data}
                </div>
              ) : (
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      This document type cannot be previewed directly.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="mt-4"
                    >
                      Download to View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
