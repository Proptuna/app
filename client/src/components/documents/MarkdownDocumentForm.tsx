"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarkdownDocumentFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function MarkdownDocumentForm({ onSubmit, isSubmitting }: MarkdownDocumentFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"internal" | "external" | "confidential">("internal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      data: content,
      type: "markdown",
      visibility,
      metadata: {
        created_via: "web_form"
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Document Title</Label>
        <Input
          id="title"
          placeholder="Enter a title for your document"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="visibility">Visibility</Label>
        <Select
          value={visibility}
          onValueChange={(value: "internal" | "external" | "confidential") => setVisibility(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="internal">Internal (Staff Only)</SelectItem>
            <SelectItem value="external">External (Public)</SelectItem>
            <SelectItem value="confidential">Confidential (Restricted)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">
          {visibility === "internal" && "Only staff members can view this document."}
          {visibility === "external" && "This document is visible to the public."}
          {visibility === "confidential" && "This document has restricted access."}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          placeholder="Write your document content using Markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] font-mono"
          required
        />
        <p className="text-sm text-gray-500">
          You can use Markdown syntax for formatting.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : "Create Document"}
        </Button>
      </div>
    </form>
  );
}
