"use client"

import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  BuildingIcon,
  UserIcon,
  HomeIcon,
  FileTextIcon,
  ClockIcon,
  ShieldIcon,
  PlusIcon,
  CheckIcon,
  CircleIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  MailIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
  completedAt?: string;
}

interface AIConversation {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
  completedAt?: string;
}

interface Property {
  id: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  tag?: string;
  tenants: Tenant[];
  documents: Document[];
  jobs?: Job[];
  aiConversations?: AIConversation[];
  createdAt: string;
  updatedAt: string;
  image?: string;
}

interface PropertyDetailV2Props {
  property: Property;
  onClose: () => void;
  onAddDocument?: (propertyId: string, document: Partial<Document>) => void;
  onAddTenant?: (propertyId: string, tenant: Partial<Tenant>) => void;
  onAddJob?: (propertyId: string, job: Partial<Job>) => void;
}

export function PropertyDetailV2({ 
  property, 
  onClose,
  onAddDocument,
  onAddTenant,
  onAddJob
}: PropertyDetailV2Props) {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    console.log('PropertyDetailV2 mounted');
    
    // If activeTab is 'jobs', change it to 'aiConversations'
    if (activeTab === 'jobs') {
      setActiveTab('aiConversations');
    }
    
    return () => {
      console.log('PropertyDetailV2 unmounted');
    };
  }, [activeTab]);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleAddDocument = (document: Partial<Document>) => {
    if (onAddDocument) {
      onAddDocument(property.id, document);
    }
  };

  const handleAddTenant = (tenant: Partial<Tenant>) => {
    if (onAddTenant) {
      onAddTenant(property.id, tenant);
    }
  };

  const handleAddJob = (job: Partial<Job>) => {
    if (onAddJob) {
      onAddJob(property.id, job);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-col overflow-hidden h-full">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Properties
        </Button>
        <div className="flex items-center">
          {property.tag && (
            <Badge variant="outline" className="mr-2">
              {property.tag}
            </Badge>
          )}
          <h2 className="text-xl font-semibold">
            {property.address}
            {property.unit && ` Unit ${property.unit}`}
          </h2>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {/* Main content */}
        <div className="space-y-6">
          {/* Property header with image and basic info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Property image */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {property.image ? (
                  <img 
                    src={property.image} 
                    alt={property.address} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x400?text=Property";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <HomeIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Property details */}
            <div className="flex-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Address
                      </h3>
                      <p className="text-base font-medium mt-1 flex items-center">
                        <HomeIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        {property.address}{property.unit && `, Unit ${property.unit}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {property.city}, {property.state} {property.zip}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Property Type
                      </h3>
                      <p className="text-base font-medium mt-1 flex items-center">
                        <BuildingIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        {property.type}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Added On
                      </h3>
                      <p className="text-base font-medium mt-1 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        {formatDate(property.createdAt)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last Updated
                      </h3>
                      <p className="text-base font-medium mt-1 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        {formatDate(property.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950 dark:data-[state=active]:text-indigo-300"
              >
                <HomeIcon className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="tenants" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950 dark:data-[state=active]:text-indigo-300"
              >
                <UserIcon className="h-4 w-4" />
                Tenants
                {property.tenants.length > 0 && (
                  <Badge className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100">
                    {property.tenants.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950 dark:data-[state=active]:text-indigo-300"
              >
                <FileTextIcon className="h-4 w-4" />
                Documents
                {property.documents.length > 0 && (
                  <Badge className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100">
                    {property.documents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="aiConversations" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950 dark:data-[state=active]:text-indigo-300"
              >
                <MessageSquareIcon className="h-4 w-4" />
                AI Conversations
                {property.aiConversations && property.aiConversations.length > 0 && (
                  <Badge className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100">
                    {property.aiConversations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Property Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      This {property.type.toLowerCase()} property is located at {property.address}
                      {property.unit && `, Unit ${property.unit}`}, {property.city}, {property.state} {property.zip}.
                      It was added to the system on {formatDate(property.createdAt)} and last updated on {formatDate(property.updatedAt)}.
                    </p>
                    <p>
                      {property.tenants.length > 0 
                        ? `Currently occupied by ${property.tenants.length} tenant${property.tenants.length > 1 ? 's' : ''}.` 
                        : 'This property is currently vacant.'}
                    </p>
                    <p>
                      {property.documents.length > 0 
                        ? `There are ${property.documents.length} document${property.documents.length > 1 ? 's' : ''} associated with this property.` 
                        : 'No documents have been uploaded for this property yet.'}
                    </p>
                    {property.aiConversations && property.aiConversations.length > 0 && (
                      <p>
                        {`There ${property.aiConversations.length > 1 ? 'are' : 'is'} ${property.aiConversations.length} AI conversation${property.aiConversations.length > 1 ? 's' : ''} associated with this property.`}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tenants Tab Content */}
            <TabsContent value="tenants" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Tenants</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Tenant
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Tenant</DialogTitle>
                          <DialogDescription>
                            Add a new tenant to this property.
                          </DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="tenant-name">Name</Label>
                            <Input id="tenant-name" placeholder="Enter tenant name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tenant-email">Email</Label>
                            <Input id="tenant-email" type="email" placeholder="Enter tenant email" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tenant-phone">Phone</Label>
                            <Input id="tenant-phone" placeholder="Enter tenant phone number" />
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Add Tenant</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {property.tenants.length > 0 ? (
                    <div className="space-y-4">
                      {property.tenants.map((tenant) => (
                        <div key={tenant.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={tenant.avatar} />
                                <AvatarFallback>{getInitials(tenant.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{tenant.name}</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  <div className="flex items-center">
                                    <MailIcon className="h-3.5 w-3.5 mr-1" />
                                    <a href={`mailto:${tenant.email}`} className="hover:underline">{tenant.email}</a>
                                  </div>
                                  <div className="flex items-center mt-1 sm:mt-0">
                                    <PhoneIcon className="h-3.5 w-3.5 mr-1" />
                                    <a href={`tel:${tenant.phone}`} className="hover:underline">{tenant.phone}</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No tenants</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        This property doesn't have any tenants yet.
                      </p>
                      <div className="mt-6">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              <PlusIcon className="h-4 w-4 mr-1" />
                              Add Tenant
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Tenant</DialogTitle>
                              <DialogDescription>
                                Add a new tenant to this property.
                              </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="tenant-name-empty">Name</Label>
                                <Input id="tenant-name-empty" placeholder="Enter tenant name" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="tenant-email-empty">Email</Label>
                                <Input id="tenant-email-empty" type="email" placeholder="Enter tenant email" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="tenant-phone-empty">Phone</Label>
                                <Input id="tenant-phone-empty" placeholder="Enter tenant phone number" />
                              </div>
                              <DialogFooter>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Add Tenant</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab Content */}
            <TabsContent value="documents" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Documents</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Document</DialogTitle>
                          <DialogDescription>
                            Upload a new document for this property.
                          </DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="document-name">Document Name</Label>
                            <Input id="document-name" placeholder="Enter document name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="document-type">Document Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lease">Lease Agreement</SelectItem>
                                <SelectItem value="inspection">Property Inspection</SelectItem>
                                <SelectItem value="maintenance">Maintenance Report</SelectItem>
                                <SelectItem value="insurance">Insurance Document</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="document-tags">Tags</Label>
                            <Input id="document-tags" placeholder="Enter tags separated by commas" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="document-file">File</Label>
                            <Input id="document-file" type="file" />
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Upload Document</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {property.documents.length > 0 ? (
                    <div className="space-y-4">
                      {property.documents.map((document) => (
                        <div key={document.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <FileTextIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <h4 className="font-medium">{document.name}</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {document.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>Updated {formatDate(document.updatedAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More options">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileTextIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No documents</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No documents have been uploaded for this property yet.
                      </p>
                      <div className="mt-6">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              <PlusIcon className="h-4 w-4 mr-1" />
                              Add Document
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Document</DialogTitle>
                              <DialogDescription>
                                Upload a new document for this property.
                              </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="document-name-empty">Document Name</Label>
                                <Input id="document-name-empty" placeholder="Enter document name" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="document-type-empty">Document Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select document type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="lease">Lease Agreement</SelectItem>
                                    <SelectItem value="inspection">Property Inspection</SelectItem>
                                    <SelectItem value="maintenance">Maintenance Report</SelectItem>
                                    <SelectItem value="insurance">Insurance Document</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="document-tags-empty">Tags</Label>
                                <Input id="document-tags-empty" placeholder="Enter tags separated by commas" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="document-file-empty">File</Label>
                                <Input id="document-file-empty" type="file" />
                              </div>
                              <DialogFooter>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Upload Document</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Conversations Tab Content */}
            <TabsContent value="aiConversations" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">AI Conversations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {property.aiConversations && property.aiConversations.length > 0 ? (
                    <div className="space-y-4">
                      {property.aiConversations.map((conversation) => (
                        <div key={conversation.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2">
                              <div
                                className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${
                                  conversation.status === "completed" ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-gray-100 dark:bg-gray-700"
                                }`}
                              >
                                {conversation.status === "completed" ? (
                                  <CheckIcon className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                ) : (
                                  <CircleIcon className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{conversation.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {conversation.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className={`
                                    ${conversation.priority === 'high' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300' : ''}
                                    ${conversation.priority === 'medium' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300' : ''}
                                    ${conversation.priority === 'low' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300' : ''}
                                  `}>
                                    {conversation.priority.charAt(0).toUpperCase() + conversation.priority.slice(1)} Priority
                                  </Badge>
                                  <Badge variant="outline" className={`
                                    ${conversation.status === 'completed' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300' : ''}
                                    ${conversation.status === 'in_progress' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : ''}
                                    ${conversation.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300' : ''}
                                  `}>
                                    {conversation.status === 'in_progress' ? 'In Progress' : conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>Created on {formatDate(conversation.createdAt)}</span>
                                </div>
                                {conversation.assignedTo && (
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <UserIcon className="h-3.5 w-3.5 mr-1" />
                                    <span>Assigned to {conversation.assignedTo}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                          >
                            <MessageSquareIcon className="h-3 w-3 mr-2" />
                            View Conversation
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquareIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No AI conversations</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No AI conversations have been generated for this property yet.
                      </p>
                      <div className="mt-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          AI conversations are automatically generated when users interact with the AI assistant about this property.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
