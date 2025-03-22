"use client"

import React, { useState, Suspense, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createDocument } from "@/lib/documents-client";

// Form loader component
const FormLoader = () => (
  <div className="p-6 text-center">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
    <p className="mt-2">Loading form...</p>
  </div>
);

export default function CreateDocumentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("markdown");

  const handleSubmit = async (documentData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Creating document with data:", documentData);
      const document = await createDocument(documentData);
      console.log("Document created:", document);
      
      // Navigate to the document view page
      window.location.href = `/documents/${document.id}`;
    } catch (err: any) {
      console.error("Error creating document:", err);
      setError(err.message || "Failed to create document. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/documents-page"} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Document</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="markdown">Markdown Document</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="escalation-policy">Escalation Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="markdown">
            <Suspense fallback={<FormLoader />}>
              {activeTab === "markdown" && (
                <DynamicMarkdownForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="file">
            <Suspense fallback={<FormLoader />}>
              {activeTab === "file" && (
                <DynamicFileForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                />
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="escalation-policy">
            <Suspense fallback={<FormLoader />}>
              {activeTab === "escalation-policy" && (
                <DynamicEscalationForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                />
              )}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Dynamic form components with error handling
function DynamicMarkdownForm(props: { onSubmit: (data: any) => void; isSubmitting: boolean }) {
  const [Component, setComponent] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadComponent = async () => {
      try {
        // @ts-ignore - Ignore TypeScript errors for dynamic import
        const module = await import('./markdown-document-form');
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

  return Component ? <Component {...props} /> : <FormLoader />;
}

function DynamicFileForm(props: { onSubmit: (data: any) => void; isSubmitting: boolean }) {
  const [Component, setComponent] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadComponent = async () => {
      try {
        // @ts-ignore - Ignore TypeScript errors for dynamic import
        const module = await import('./file-upload-form');
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

  return Component ? <Component {...props} /> : <FormLoader />;
}

function DynamicEscalationForm(props: { onSubmit: (data: any) => void; isSubmitting: boolean }) {
  const [Component, setComponent] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadComponent = async () => {
      try {
        // @ts-ignore - Ignore TypeScript errors for dynamic import
        const module = await import('./escalation-policy-form');
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

  return Component ? <Component {...props} /> : <FormLoader />;
}
