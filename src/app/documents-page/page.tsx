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
  ChevronLeftIcon,
  ChevronRightIcon,
  RefreshCwIcon,
} from "lucide-react";
import { DocumentsAgGrid } from "(components)/documents-ag-grid";
import { fetchDocuments, Document } from "@/lib/documents-client";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [limit] = useState(20);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      // Reset pagination when search changes
      setCursor(null);
      setPrevCursors([]);
      loadDocuments();
    }, 300),
    [documentType] // Needed to update when filters change
  );

  // Effect for search query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Fetch documents from API
  const loadDocuments = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const params: any = { 
        limit,
        title: searchQuery || undefined,
      };
      
      // Add cursor for pagination if loading more
      if (loadMore && cursor) {
        params.cursor = cursor;
      } else if (!loadMore) {
        // Reset cursor when not loading more (fresh search/filter)
        setCursor(null);
        setPrevCursors([]);
      }
      
      if (documentType !== "all") {
        params.type = documentType;
      }
      
      const response = await fetchDocuments(params);
      
      if (loadMore) {
        setDocuments(prevDocs => [...prevDocs, ...response.data]);
      } else {
        setDocuments(response.data);
      }
      
      setHasMore(response.has_more);
      
      if (response.next_cursor) {
        // Save current cursor to history before setting new one
        if (cursor) {
          setPrevCursors(prev => [...prev, cursor]);
        }
        setCursor(response.next_cursor);
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.message || "Failed to load documents");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, [documentType]);

  const handleLoadMore = () => {
    loadDocuments(true);
  };

  const handlePrevious = () => {
    if (prevCursors.length > 0) {
      // Get the previous cursor
      const prevCursor = prevCursors[prevCursors.length - 1];
      
      // Remove it from history
      setPrevCursors(prev => prev.slice(0, prev.length - 1));
      
      // Set it as current cursor
      setCursor(prevCursor);
      
      // Load with that cursor
      loadDocuments(true);
    } else {
      // If no previous cursors, load from the beginning
      setCursor(null);
      loadDocuments();
    }
  };

  const handleRefresh = () => {
    setCursor(null);
    setPrevCursors([]);
    loadDocuments();
  };

  const handleAddDocument = () => {
    // In a real app, this would open a modal to add a new document
    console.log("Add document clicked");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Documents
        </h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleAddDocument}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Select
            value={documentType}
            onValueChange={setDocumentType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All types
              </SelectItem>
              <SelectItem value="markdown">
                Markdown
              </SelectItem>
              <SelectItem value="file">
                File
              </SelectItem>
              <SelectItem value="escalation-policy">
                Escalation Policy
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && documents.length === 0 ? (
        <div className="flex justify-center p-12">Loading documents...</div>
      ) : error ? (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">{error}</div>
      ) : (
        <>
          <DocumentsAgGrid documents={documents} />
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={prevCursors.length === 0}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLoadMore}
              disabled={!hasMore || isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
              {!isLoading && <ChevronRightIcon className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// Debounce helper function
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
