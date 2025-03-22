"use client"

import React, { useState } from "react";
import {
  ArrowLeftIcon,
  UserIcon,
  BuildingIcon,
  UsersIcon,
  MailIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  MessageSquareIcon,
  FileTextIcon,
  ClipboardListIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Person } from "@/lib/people-client";

// Extended Property interface to include additional fields needed for display
interface PropertyExtended {
  id: string;
  address: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  type?: string;
  image?: string;
}

// Extended Group interface to include additional fields needed for display
interface GroupExtended {
  id: string;
  name: string;
  description?: string;
  members?: number;
}

interface Document {
  id: string;
  name: string;
  url: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  title: string;
  date: string;
  status: string;
  messages: number;
}

// Extended Person interface to include avatar for display purposes
interface PersonWithAvatar extends Person {
  avatar?: string;
}

interface PersonDetailProps {
  person: Person;
  onClose?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function PersonDetail({ 
  person, 
  onClose,
  onEdit,
  onDelete
}: PersonDetailProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Format phone number
  const formatPhone = (phone: string) => {
    if (!phone) return "";
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };
  
  // Get badge color based on type or role
  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "owner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "tenant":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pm":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "leasing_agent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  // Format display value for type or role
  const formatDisplayValue = (value: string) => {
    if (!value) return "";
    return value.replace("_", " ").split(" ").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };
  
  // Improve the back button to ensure proper routing
  const handleBack = () => {
    if (onClose) {
      // If there's an onClose handler, this is being used in a modal/dialog
      onClose();
    } else {
      // If being accessed directly via URL, navigate to people page
      window.location.href = '/people-page';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to People
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Person Details</h2>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(person.id)}
              className="flex items-center gap-1"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(person.id)}
              className="flex items-center gap-1 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Person Overview */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-full">
              {/* Use a fallback avatar since Person doesn't have an avatar property */}
              <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-lg">
                {getInitials(person.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {person.name}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {person.type && (
                  <Badge className={getBadgeColor(person.type)}>
                    {formatDisplayValue(person.type)}
                  </Badge>
                )}
                {person.role && (
                  <Badge className={getBadgeColor(person.role)}>
                    {formatDisplayValue(person.role)}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {person.email && (
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`mailto:${person.email}`} 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {person.email}
                    </a>
                  </div>
                )}
                {person.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${person.phone}`} 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {formatPhone(person.phone)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <TabsList className="h-12 px-6 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
              >
                Properties
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
              >
                Groups
              </TabsTrigger>
              <TabsTrigger 
                value="conversations" 
                className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
              >
                Conversations
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Full Name</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{person.name}</dd>
                    </div>
                    {person.email && (
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Email</dt>
                        <dd className="font-medium text-gray-900 dark:text-gray-100">{person.email}</dd>
                      </div>
                    )}
                    {person.phone && (
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Phone</dt>
                        <dd className="font-medium text-gray-900 dark:text-gray-100">{formatPhone(person.phone)}</dd>
                      </div>
                    )}
                    {person.type && (
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                        <dd>
                          <Badge className={getBadgeColor(person.type)}>
                            {formatDisplayValue(person.type)}
                          </Badge>
                        </dd>
                      </div>
                    )}
                    {person.role && (
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Role</dt>
                        <dd>
                          <Badge className={getBadgeColor(person.role)}>
                            {formatDisplayValue(person.role)}
                          </Badge>
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Associations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Properties</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">
                        {person.associations?.properties?.length || 0} properties
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Groups</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">
                        {person.associations?.groups?.length || 0} groups
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Associated Properties
              </h3>
              <Button size="sm" className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                <span>Add Property</span>
              </Button>
            </div>
            
            {person.associations?.properties && person.associations.properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {person.associations.properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="flex">
                      {/* Since property doesn't have image in the actual data model, use a fallback */}
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <BuildingIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="p-4 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {property.address}
                        </h4>
                        {/* Since we don't have city, state, zip in the actual data model, omit this line */}
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                          Property
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <BuildingIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No properties</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This person is not associated with any properties yet.
                </p>
                <Button size="sm" className="flex items-center gap-1 mx-auto">
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Property</span>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="groups" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Group Memberships
              </h3>
              <Button size="sm" className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                <span>Add to Group</span>
              </Button>
            </div>
            
            {person.associations?.groups && person.associations.groups.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {person.associations.groups.map((group) => (
                  <Card key={group.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <UsersIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {group.name}
                          </h4>
                          {/* Since group doesn't have description in the actual data model, omit this conditional */}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Group
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <UsersIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No groups</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This person is not a member of any groups yet.
                </p>
                <Button size="sm" className="flex items-center gap-1 mx-auto">
                  <PlusIcon className="h-4 w-4" />
                  <span>Add to Group</span>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="conversations" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Conversations
              </h3>
              <Button size="sm" className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                <span>New Conversation</span>
              </Button>
            </div>
            
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <MessageSquareIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No conversations</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no AI conversations with this person yet.
              </p>
              <Button size="sm" className="flex items-center gap-1 mx-auto">
                <PlusIcon className="h-4 w-4" />
                <span>Start Conversation</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Documents
              </h3>
              <Button size="sm" className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                <span>Upload Document</span>
              </Button>
            </div>
            
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <FileTextIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No documents</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no documents associated with this person yet.
              </p>
              <Button size="sm" className="flex items-center gap-1 mx-auto">
                <PlusIcon className="h-4 w-4" />
                <span>Upload Document</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
