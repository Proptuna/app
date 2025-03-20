"use client";

import React, { useState } from "react";
import { ArrowLeft, Download, Trash, Edit, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Document, deleteDocument } from "@/lib/documents-client";
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

interface Associations {
  properties?: { address?: string; id?: string }[];
  people?: { name?: string; id?: string }[];
  groups?: { name?: string; id?: string }[];
}

interface DocumentViewComponentProps {
  document: Document;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export default function DocumentViewComponent({ document, onClose, onDelete }: DocumentViewComponentProps) {
  console.log("Rendering document view component with document:", document);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDownload = () => {
    // For markdown documents, we can create a blob and download it
    if (document.type === "markdown") {
      const blob = new Blob([document.data], { type: "text/markdown" });
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
        onClose();
      }
    } catch (error: any) {
      console.error("Error deleting document:", error);
      setDeleteError(error.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onClose} 
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
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : "Delete"}
            </Button>
          </div>
        )}
      </div>

      {document ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{document.title}</h1>
              <Badge variant="outline">{document.type}</Badge>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <p>Created: {formatDate(document.created_at)}</p>
              <p>Last Updated: {formatDate(document.updated_at)}</p>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {document.type === "markdown" ? (
                <div className="whitespace-pre-wrap">{document.data}</div>
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

          {document.associations && (
            <div className="px-6 py-4 border-t">
              <h2 className="text-lg font-semibold mb-2">Associations</h2>
              
              {document.associations.properties && document.associations.properties.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Properties:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.associations.properties.map((property: any, index: number) => (
                      <span key={`property-${index}`} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {property.address || property.id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {document.associations.people && document.associations.people.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700">People:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.associations.people.map((person: any, index: number) => (
                      <span key={`person-${index}`} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {person.name || person.id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {document.associations.groups && document.associations.groups.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Groups:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.associations.groups.map((group: any, index: number) => (
                      <span key={`group-${index}`} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {group.name || group.id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading document...</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Document Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              <p className="mb-2">
                Are you sure you want to delete the document <span className="font-semibold">"{document?.title}"</span>?
              </p>
              <p className="text-gray-500">
                This action cannot be undone and will permanently remove this document and all its associations.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
              <p className="font-medium">Error</p>
              <p>{deleteError}</p>
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
