"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  FileTextIcon,
  FileIcon,
  ShieldIcon,
  EyeIcon,
  EyeOffIcon,
  BuildingIcon,
  UserIcon,
  HomeIcon,
} from "lucide-react";
import { DocumentsTable } from "(components)/documents-table";

interface Document {
  id: string;
  title: string;
  type: string;
  summary: string;
  isPublic: boolean;
  lastUpdated: string;
  associations: Array<{
    type: string;
    name: string;
  }>;
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documentType, setDocumentType] = useState("all");

  // Mock documents data
  const documents: Document[] = [
    {
      id: "1",
      title: "Maintenance Policy",
      type: "markdown",
      summary:
        "Standard procedures for handling maintenance requests and emergencies",
      isPublic: true,
      lastUpdated: "2023-05-15",
      associations: [
        { type: "group", name: "Vista Ridge" },
        { type: "group", name: "Oakwood" },
      ],
    },
    {
      id: "2",
      title: "Tenant Handbook",
      type: "markdown",
      summary:
        "Comprehensive guide for tenants including rules, amenities, and contact information",
      isPublic: true,
      lastUpdated: "2023-04-22",
      associations: [
        { type: "group", name: "Vista Ridge" },
        { type: "property", name: "935 Woodmoor" },
      ],
    },
    {
      id: "3",
      title: "Emergency Contact List",
      type: "markdown",
      summary:
        "List of emergency contacts for various situations including maintenance, security, and medical",
      isPublic: false,
      lastUpdated: "2023-06-01",
      associations: [
        { type: "group", name: "Vista Ridge" },
        { type: "group", name: "Oakwood" },
        { type: "property", name: "935 Woodmoor" },
      ],
    },
    {
      id: "4",
      title: "Building Plumbing Plan",
      type: "file",
      summary:
        "Detailed plumbing schematics for the building including main lines and shut-off valves",
      isPublic: false,
      lastUpdated: "2022-11-10",
      associations: [{ type: "property", name: "Vista Ridge Properties" }],
    },
    {
      id: "5",
      title: "Lease Agreement Template",
      type: "markdown",
      summary:
        "Standard lease agreement template with legal terms and conditions",
      isPublic: false,
      lastUpdated: "2023-01-15",
      associations: [{ type: "user", name: "Property Management Inc." }],
    },
    {
      id: "6",
      title: "Appliance Manuals",
      type: "file",
      summary:
        "Collection of user manuals for all standard appliances in rental units",
      isPublic: true,
      lastUpdated: "2022-08-30",
      associations: [
        { type: "group", name: "Vista Ridge" },
        { type: "group", name: "Oakwood" },
      ],
    },
    {
      id: "7",
      title: "Insurance Policy",
      type: "file",
      summary:
        "Property insurance policy documentation including coverage details and claim procedures",
      isPublic: false,
      lastUpdated: "2023-02-28",
      associations: [{ type: "user", name: "Property Management Inc." }],
    },
    {
      id: "8",
      title: "Escalation Policy - Standard",
      type: "escalation-policy",
      summary:
        "Standard escalation procedures for maintenance and tenant issues",
      isPublic: true,
      lastUpdated: "2023-03-10",
      associations: [{ type: "group", name: "Vista Ridge" }],
    },
    {
      id: "9",
      title: "Escalation Policy - Emergency",
      type: "escalation-policy",
      summary:
        "Emergency escalation procedures for urgent situations requiring immediate attention",
      isPublic: true,
      lastUpdated: "2023-03-12",
      associations: [
        { type: "group", name: "Vista Ridge" },
        { type: "group", name: "Oakwood" },
      ],
    },
  ];

  // Filter documents based on search query and document type
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.associations.some((assoc) =>
        assoc.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesType = documentType === "all" || doc.type === documentType;

    return matchesSearch && matchesType;
  });

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

      <DocumentsTable documents={filteredDocuments} />
    </div>
  );
}
