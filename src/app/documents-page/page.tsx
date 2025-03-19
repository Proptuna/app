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
  Document
} from "@/lib/documents-client";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

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
    const tempError = setError;
    setError("Document deleted successfully.");
    setTimeout(() => {
      if (error === "Document deleted successfully.") {
        setError(null);
      }
    }, 3000);
  };

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="container mx-auto py-8">
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
          <div className={`p-4 rounded-md ${error === "Document deleted successfully." ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border h-[600px] w-full">
          <DocumentsAgGrid 
            documents={documents} 
            onDocumentDeleted={handleDocumentDeleted}
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
    </div>
  );
}

// Debounce helper function
function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
