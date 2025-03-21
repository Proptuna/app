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
  AlertCircle,
  CheckCircle,
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
import { fetchDocuments, fetchDocumentById, createDocument } from "@/lib/documents-client";
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
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  
  // Document creation state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("markdown");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Load documents from API
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchDocuments({});
      setDocuments(response.data || []);
    } catch (err: any) {
      console.error("Error loading documents:", err);
      setError(err.message || "Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

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
    setSuccessMessage("Document successfully deleted.");
    setTimeout(() => {
      setSuccessMessage(null);
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

  const DynamicFileUploadForm = ({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void; isSubmitting: boolean }) => {
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
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4 flex items-center gap-2 border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 flex items-center gap-2 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <div className={`transition-all duration-300 ${isViewingDocument ? 'translate-x-[-100%]' : 'translate-x-0'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
                  <p className="text-muted-foreground">
                    Manage your documents and policies
                  </p>
                </div>
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
                            <DynamicFileUploadForm 
                              onSubmit={handleCreateDocument} 
                              isSubmitting={isSubmitting} 
                            />
                          )}
                        </Suspense>
                      </TabsContent>
                      
                      <TabsContent value="escalation-policy">
                        <Suspense fallback={<FormLoader />}>
                          {activeTab === "escalation-policy" && (
                            <DynamicEscalationForm 
                              onSubmit={handleCreateDocument} 
                              isSubmitting={isSubmitting} 
                            />
                          )}
                        </Suspense>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
              
              <DocumentsAgGrid
                documents={documents}
                onDocumentDeleted={handleDocumentDeleted}
                onDocumentView={handleViewDocument}
                isLoading={isLoading}
              />
            </div>
            
            <div className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${isViewingDocument ? 'translate-x-0' : 'translate-x-[100%]'}`}>
              {selectedDocument && (
                <DocumentViewer 
                  document={selectedDocument} 
                  onClose={handleCloseDocumentView}
                  onDelete={handleDocumentDeleted}
                />
              )}
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
