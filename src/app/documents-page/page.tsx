"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusIcon,
  SearchIcon,
  RefreshCwIcon,
} from "lucide-react";
import { DocumentsAgGrid } from "(components)/documents-ag-grid";
import { 
  fetchDocuments, 
  searchDocuments, 
  fetchDocumentById,
  Document
} from "@/lib/documents-client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AlertCircle } from "lucide-react";

// Import the DocumentViewComponent dynamically to avoid import errors
const DocumentViewComponent = dynamic(() => import("../documents/[id]/document-view-component"), {
  ssr: false,
});

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewingDocument, setIsViewingDocument] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setIsSearchMode(!!query);
      loadDocuments();
    }, 300),
    [documentType] // Needed to update when filters change
  );

  // Effect for search query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Handle document type filter change
  useEffect(() => {
    loadDocuments();
  }, [documentType]);

  // Fetch documents from API
  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If we have a search query, use the search endpoint, otherwise use the regular fetch endpoint
      if (searchQuery) {
        await loadSearchResults();
      } else {
        await loadAllDocuments();
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load documents using regular fetch endpoint
  const loadAllDocuments = async () => {
    const params: any = {};

    // Add document type filter if not "all"
    if (documentType !== "all") {
      params.type = documentType;
    }

    const response = await fetchDocuments(params);
    setDocuments(response.data);
  };

  // Load documents using search endpoint
  const loadSearchResults = async () => {
    const params: any = {
      query: searchQuery,
    };

    // Add document type filter if not "all"
    if (documentType !== "all") {
      params.type = documentType;
    }

    const response = await searchDocuments(params);
    setDocuments(response.data);
  };

  // Handle document deletion
  const handleDocumentDeleted = (id: string) => {
    // Remove the deleted document from the list
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
    
    // Show a temporary success message
    setError("Document successfully deleted.");
    setTimeout(() => {
      if (error === "Document successfully deleted.") {
        setError(null);
      }
    }, 3000);
  };

  // Handle document view
  const handleDocumentView = async (document: Document) => {
    console.log("Viewing document:", document);
    try {
      // Fetch the full document details
      const fullDocument = await fetchDocumentById(document.id);
      setSelectedDocument(fullDocument);
      setIsViewingDocument(true);
    } catch (err) {
      console.error("Error fetching document details:", err);
      setError("Failed to load document details. Please try again.");
    }
  };

  // Handle closing document view
  const handleCloseDocumentView = () => {
    setSelectedDocument(null);
    setIsViewingDocument(false);
  };

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, []);

  // Debounce helper function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="container mx-auto py-8">
      {isViewingDocument && selectedDocument ? (
        <DocumentViewComponent 
          document={selectedDocument} 
          onClose={handleCloseDocumentView} 
          onDelete={handleDocumentDeleted}
        />
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Documents</h1>
            <Button 
              onClick={() => router.push("/documents/create")}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select
                value={documentType}
                onValueChange={setDocumentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="escalation-policy">Escalation Policy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => loadDocuments()}
              disabled={isLoading}
              className="h-10 w-10"
            >
              <RefreshCwIcon className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {error && (
            <div className={`p-4 rounded-md flex items-center ${
              error === "Document successfully deleted." 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {error === "Document successfully deleted." ? (
                <>
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {error}
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  {error}
                </>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border h-[600px] w-full">
            <DocumentsAgGrid 
              documents={documents} 
              onDocumentDeleted={handleDocumentDeleted}
              onDocumentView={handleDocumentView}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {documents.length > 0 
                ? `Showing ${documents.length} documents${searchQuery ? ` matching "${searchQuery}"` : ""}` 
                : isLoading 
                  ? "Loading documents..." 
                  : "No documents found"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
