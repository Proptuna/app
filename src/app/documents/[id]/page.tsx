"use client";

import React, { useState, useEffect } from "react";
import { fetchDocumentById } from "@/lib/documents-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { format } from "date-fns";

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
        const doc = await fetchDocumentById(params.id);
        console.log("Document loaded:", doc);
        setDocument(doc);
        setError(null);
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
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
    // For other document types, implement appropriate download logic
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Button>
        {document && (
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {document && !isLoading && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <div className="mt-2 text-sm text-gray-500">
              <span className="inline-block mr-4">
                Type: <span className="font-medium">{document.type}</span>
              </span>
              <span className="inline-block mr-4">
                Visibility: <span className="font-medium">{document.visibility}</span>
              </span>
              <span className="inline-block">
                Created: <span className="font-medium">{formatDate(document.created_at)}</span>
              </span>
            </div>
          </div>

          <div className="px-6 py-4">
            {document.type === "markdown" ? (
              <div className="prose max-w-none">
                {/* You may want to add a markdown renderer here */}
                <pre className="whitespace-pre-wrap">{document.data}</pre>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded">
                <p>Preview not available for this document type.</p>
              </div>
            )}
          </div>

          {document.associations && (
            <div className="px-6 py-4 border-t">
              <h2 className="text-lg font-semibold mb-2">Associations</h2>
              
              {document.document_property_associations && document.document_property_associations.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Properties:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.document_property_associations.map((assoc: any) => (
                      <span key={assoc.property_id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {assoc.property_id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {document.document_person_associations && document.document_person_associations.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700">People:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.document_person_associations.map((assoc: any) => (
                      <span key={assoc.person_id} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {assoc.person_id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {document.document_group_associations && document.document_group_associations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Groups:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.document_group_associations.map((assoc: any) => (
                      <span key={assoc.group_id} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {assoc.group_id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
