"use client"

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  Eye,
  File,
  FileText,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchDocuments, searchDocuments, fetchDocumentById, createDocument } from "@/lib/documents-client";
import dynamic from "next/dynamic";

// Dynamically import the document viewer
const DocumentViewer = dynamic(() => import("../documents/[id]/document-view-component").then(module => module.default), {
  ssr: false,
});

// Import the AG Grid component directly
import DocumentsAgGrid from "../(components)/documents-ag-grid";

// Form loader component
const FormLoader = () => (
  <div className="p-6 text-center">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
    <p className="mt-2">Loading form...</p>
  </div>
);

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  
  // Document creation state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("markdown");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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

  // Load documents from API
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If we have a search query, use the search endpoint, otherwise use the regular fetch endpoint
      if (searchQuery) {
        const params: any = {
          query: searchQuery,
        };

        // Add document type filter if not "all"
        if (documentType !== "all") {
          params.type = documentType;
        }

        const response = await searchDocuments(params);
        setDocuments(response.data || []);
      } else {
        const params: any = {};

        // Add document type filter if not "all"
        if (documentType !== "all") {
          params.type = documentType;
        }

        const response = await fetchDocuments(params);
        setDocuments(response.data || []);
      }
    } catch (err: any) {
      console.error("Error loading documents:", err);
      setError(err.message || "Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [documentType, searchQuery]);

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Handle document type filter change
  const handleTypeChange = (value: string) => {
    setDocumentType(value);
    loadDocuments();
  };

  // Handle document selection for viewing
  const handleViewDocument = async (document: any) => {
    try {
      // Fetch the full document details
      const fullDocument = await fetchDocumentById(document.id);
      setSelectedDocument(fullDocument);
      setIsViewingDocument(true);
    } catch (err: any) {
      console.error("Error fetching document details:", err);
      setError(err.message || "Failed to load document details. Please try again.");
    }
  };

  // Handle closing document view
  const handleCloseDocumentView = () => {
    setSelectedDocument(null);
    setIsViewingDocument(false);
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

  // Handle document creation form submission
  const handleCreateDocument = async (documentData: any) => {
    setIsSubmitting(true);
    setCreateError(null);

    try {
      console.log("Creating document with data:", documentData);
      const document = await createDocument(documentData);
      console.log("Document created:", document);
      
      // Close the dialog and refresh the document list
      setIsCreateDialogOpen(false);
      loadDocuments();
    } catch (err: any) {
      console.error("Error creating document:", err);
      setCreateError(err.message || "Failed to create document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic form components with error handling
  const DynamicMarkdownForm = ({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void; isSubmitting: boolean }) => {
    const [Component, setComponent] = useState<any>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
      let isMounted = true;
      
      const loadComponent = async () => {
        try {
          // @ts-ignore - Ignore TypeScript errors for dynamic import
          const module = await import('../documents/create/markdown-document-form');
          if (isMounted) setComponent(() => module.default);
        } catch (err) {
          console.error("Failed to load markdown form:", err);
          if (isMounted) setLoadError("Failed to load form component");
        }
      };
      
      loadComponent();
      return () => { isMounted = false; };
    }, []);

    if (loadError) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {loadError}. Please refresh the page and try again.
        </div>
      );
    }

    return Component ? <Component onSubmit={onSubmit} isSubmitting={isSubmitting} /> : <FormLoader />;
  };

  const DynamicFileForm = ({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void; isSubmitting: boolean }) => {
    const [Component, setComponent] = useState<any>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
      let isMounted = true;
      
      const loadComponent = async () => {
        try {
          // @ts-ignore - Ignore TypeScript errors for dynamic import
          const module = await import('../documents/create/file-upload-form');
          if (isMounted) setComponent(() => module.default);
        } catch (err) {
          console.error("Failed to load file upload form:", err);
          if (isMounted) setLoadError("Failed to load form component");
        }
      };
      
      loadComponent();
      return () => { isMounted = false; };
    }, []);

    if (loadError) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {loadError}. Please refresh the page and try again.
        </div>
      );
    }

    return Component ? <Component onSubmit={onSubmit} isSubmitting={isSubmitting} /> : <FormLoader />;
  };

  const DynamicEscalationForm = ({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void; isSubmitting: boolean }) => {
    const [Component, setComponent] = useState<any>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
      let isMounted = true;
      
      const loadComponent = async () => {
        try {
          // @ts-ignore - Ignore TypeScript errors for dynamic import
          const module = await import('../documents/create/escalation-policy-form');
          if (isMounted) setComponent(() => module.default);
        } catch (err) {
          console.error("Failed to load escalation policy form:", err);
          if (isMounted) setLoadError("Failed to load form component");
        }
      };
      
      loadComponent();
      return () => { isMounted = false; };
    }, []);

    if (loadError) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {loadError}. Please refresh the page and try again.
        </div>
      );
    }

    return Component ? <Component onSubmit={onSubmit} isSubmitting={isSubmitting} /> : <FormLoader />;
  };

  return (
    <div className="container mx-auto py-8">
      {isViewingDocument && selectedDocument ? (
        <div>
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleCloseDocumentView}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Button>
          </div>
          <DocumentViewer 
            document={selectedDocument} 
            onClose={handleCloseDocumentView}
            onDelete={handleDocumentDeleted}
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Documents</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Document</DialogTitle>
                </DialogHeader>
                
                {createError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
                    {createError}
                  </div>
                )}
                
                <Tabs defaultValue="markdown" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="markdown">Markdown Document</TabsTrigger>
                    <TabsTrigger value="file">File Upload</TabsTrigger>
                    <TabsTrigger value="escalation-policy">Escalation Policy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="markdown">
                    <Suspense fallback={<FormLoader />}>
                      {activeTab === "markdown" && (
                        <DynamicMarkdownForm 
                          onSubmit={handleCreateDocument} 
                          isSubmitting={isSubmitting} 
                        />
                      )}
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="file">
                    <Suspense fallback={<FormLoader />}>
                      {activeTab === "file" && (
                        <DynamicFileForm 
                          onSubmit={handleCreateDocument} 
                          isSubmitting={isSubmitting} 
                        />
                      )}
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="escalation-policy">
                    <div className="max-h-[70vh] overflow-y-auto">
                      <Suspense fallback={<FormLoader />}>
                        {activeTab === "escalation-policy" && (
                          <DynamicEscalationForm 
                            onSubmit={handleCreateDocument} 
                            isSubmitting={isSubmitting} 
                          />
                        )}
                      </Suspense>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
            <div className="p-4 border-b flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-4 w-4" />
                <Select value={documentType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="escalation-policy">
                      Escalation Policy
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading documents...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-red-500">
                    <p>{error}</p>
                  </div>
                </div>
              ) : documents.length === 0 ? (
                <div className="flex items-center justify-center h-64 border rounded-lg">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchQuery
                        ? "Try a different search term or filter"
                        : "Create your first document to get started"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden border rounded-lg">
                  <DocumentsAgGrid 
                    documents={documents} 
                    onDocumentDeleted={handleDocumentDeleted}
                    onDocumentView={handleViewDocument}
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {documents.length} documents
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Type definitions
interface Document {
  id: string;
  title: string;
  type: string;
  visibility: "internal" | "external" | "confidential";
  created_at: string;
  updated_at: string;
  data: string;
  version: number;
  metadata: Record<string, any>;
}
