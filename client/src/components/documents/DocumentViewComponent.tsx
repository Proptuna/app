"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Trash, Edit, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteDocument } from "@/lib/documents-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReactMarkdown from 'react-markdown';

// Update interface to include all possible association types
interface DocumentAssociations {
  properties?: { address?: string; id: string }[];
  people?: { name?: string; id: string; type?: string }[];
  tags?: { name?: string; id: string }[];
  relatedDocuments?: { title?: string; id: string }[];
  [key: string]: any; // Allow for additional association types
}

interface DocumentData {
  id: string;
  title: string;
  content?: string;    // Content may be here
  data?: string;       // Or data might be used for content
  type: string;
  visibility?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Alternative field name
  updated_at?: string; // Alternative field name
  metadata?: Record<string, any>;
  associations?: DocumentAssociations;
  version?: number;
}

interface DocumentViewComponentProps {
  document: DocumentData;
  onClose?: () => void;
  onDelete?: (id: string) => void;
  isInspiration?: boolean;
}

export default function DocumentViewComponent({ document, onClose, onDelete }: DocumentViewComponentProps) {
  console.log("Rendering document view component with document:", document);
  
  // Determine where the content is stored
  const documentContent = document.content || document.data || '';
  console.log("Document content source:", document.content ? "content field" : document.data ? "data field" : "not found");
  console.log("Document content fields:", {
    content: document.content,
    data: document.data,
    fullData: JSON.stringify(document)
  });
  
  // URL debugging
  useEffect(() => {
    console.log("DocumentViewComponent mounted with URL:", window.location.href);
    
    return () => {
      console.log("DocumentViewComponent unmounted");
    };
  }, []);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDownload = () => {
    // For markdown documents, we can create a blob and download it
    if (document.type === "markdown") {
      const blob = new Blob([documentContent], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${document.title}.md`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // For other document types, we would need to implement a different download method
      console.log("Download not implemented for this document type");
    }
  };

  const handleDelete = async () => {
    if (!document || !document.id) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      console.log(`Deleting document with ID: ${document.id}`);
      const result = await deleteDocument(document.id);
      console.log("Delete result:", result);
      
      if (result.success) {
        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete(document.id);
        }
        // Close the document view
        onClose?.();
      }
    } catch (error: any) {
      console.error("Error deleting document:", error);
      setDeleteError(error.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  const handleBack = () => {
    console.log("Back button clicked");
    
    // Clean URL if needed
    if (window.location.search.includes('docId=')) {
      // Only modify the URL if we're viewing a document
      const newUrl = window.location.pathname;
      console.log("Cleaning URL on back to:", newUrl);
      window.history.replaceState({}, '', newUrl);
    }
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Button>
        
        {document && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 text-red-500" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Document content */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <Badge variant="outline">{document.type}</Badge>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <p>Created: {formatDate(document.createdAt || document.created_at)}</p>
          <p>Last Updated: {formatDate(document.updatedAt || document.updated_at)}</p>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {document.type === "markdown" ? (
            <div className="markdown-content">
              <ReactMarkdown>
                {documentContent}
              </ReactMarkdown>
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

        {document.associations && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="text-lg font-semibold mb-2">Associations</h2>
            {document.associations.properties && document.associations.properties.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">Properties:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {document.associations.properties.map((property: any, index: number) => (
                    <a 
                      key={`property-${index}`} 
                      href={`/properties-page?id=${property.id}`}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      {property.address || property.id}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {document.associations.people && document.associations.people.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">People:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {document.associations.people.map((person: any, index: number) => (
                    <a 
                      key={`person-${index}`} 
                      href={`/people-page?personId=${person.id}`}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                      {person.name || person.id}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {document.associations.tags && document.associations.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Tags:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {document.associations.tags.map((tag: any, index: number) => (
                    <span key={`tag-${index}`} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {tag.name || tag.id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {document.associations.relatedDocuments && document.associations.relatedDocuments.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">Related Documents:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {document.associations.relatedDocuments.map((relatedDoc: any, index: number) => (
                    <a 
                      key={`doc-${index}`} 
                      href={`/documents-page?docId=${relatedDoc.id}`}
                      className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded hover:bg-indigo-200 transition-colors"
                    >
                      {relatedDoc.title || relatedDoc.id}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Document Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to delete the document "{document?.title}"?
              This action cannot be undone and will permanently remove this document and all its associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
              <div className="font-medium">Error</div>
              <div>{deleteError}</div>
            </div>
          )}
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash className="h-4 w-4" />
                  Delete Document
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
