"use client"

import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  FileTextIcon,
  ClipboardListIcon,
  UserIcon,
  CalendarIcon,
  SendIcon,
  CheckIcon,
  ClockIcon as Clock3Icon,
  AlertTriangleIcon,
  PlusIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  XIcon,
  CheckSquareIcon,
  CircleIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  HomeIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyInfo } from "(components)/property-info";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Task {
  id: string;
  description: string;
  status: string;
  created: string;
  createdBy: string;
  notified: string[];
  photos?: string[];
}

interface Conversation {
  sender: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

interface Document {
  title: string;
  type: string;
  icon?: React.ReactNode;
  uploadDate?: string;
  size?: string;
}

interface Property {
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  owner?: string;
  manager?: string;
  image?: string;
}

interface Contact {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface AIConversation {
  id: string;
  state: string;
  overview: string;
  date: string;
  property?: Property;
  person?: Contact;
  conversation?: Conversation[];
  tasks?: Task[];
  documents?: Document[];
  isLive?: boolean;
  needsAttention?: boolean;
  suggestedAction?: string;
}

interface AIConversationDetailProps {
  conversation: AIConversation;
  onClose: () => void;
}

export function AIConversationDetail({ conversation, onClose }: AIConversationDetailProps) {
  console.log('AIConversationDetail rendering with conversation:', conversation);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");
  const [showResolutionActions, setShowResolutionActions] = useState(
    conversation.needsAttention || false,
  );

  useEffect(() => {
    console.log('AIConversationDetail mounted');
    return () => {
      console.log('AIConversationDetail unmounted');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      setNewMessage("");
    }
  };

  const handleCloseTask = (taskId: string) => {
    // In a real app, this would update the task status in the backend
    console.log(`Closing task ${taskId}`);
  };

  const handleAcceptSuggestedAction = () => {
    // In a real app, this would implement the suggested action
    console.log("Accepted suggested action");
    setShowResolutionActions(false);
  };

  const handleRejectSuggestedAction = () => {
    // In a real app, this would mark the suggested action as rejected
    console.log("Rejected suggested action");
    setShowResolutionActions(false);
  };

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

  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col h-[600px]">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{conversation.overview}</h2>
        </div>
        <div className="flex items-center">
          {conversation.needsAttention && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 mr-3">
              Needs Attention
            </Badge>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Conversation details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-400 data-[state=active]:shadow-none rounded-none"
                >
                  <MessageSquareIcon className="h-4 w-4" />
                  Conversation
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-400 data-[state=active]:shadow-none rounded-none"
                >
                  <CheckSquareIcon className="h-4 w-4" />
                  Tasks
                  {conversation.tasks && conversation.tasks.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {conversation.tasks.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-400 data-[state=active]:shadow-none rounded-none"
                >
                  <FileTextIcon className="h-4 w-4" />
                  Documents
                  {conversation.documents && conversation.documents.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {conversation.documents.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 bg-white dark:bg-gray-800 rounded-md">
                <TabsContent value="overview" className="space-y-4 mt-0">
                  {showResolutionActions && conversation.suggestedAction && (
                    <Card className="bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="font-medium">Suggested Action:</div>
                          <div className="text-sm">{conversation.suggestedAction}</div>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              onClick={handleAcceptSuggestedAction}
                              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              <ThumbsUpIcon className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRejectSuggestedAction}
                              className="flex items-center border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                            >
                              <ThumbsDownIcon className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4 max-h-[400px] overflow-y-auto p-1 pr-2">
                        {conversation.conversation?.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              msg.sender === "AI Assistant" ? "justify-start" : "justify-end"
                            }`}
                          >
                            <div
                              className={`flex max-w-[80%] ${
                                msg.sender === "AI Assistant" ? "flex-row" : "flex-row-reverse"
                              }`}
                            >
                              <Avatar
                                className={`h-8 w-8 ${
                                  msg.sender === "AI Assistant" ? "mr-2" : "ml-2"
                                }`}
                              >
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>
                                  {msg.sender === "AI Assistant" ? "AI" : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div
                                  className={`px-4 py-2 rounded-lg ${
                                    msg.sender === "AI Assistant"
                                      ? "bg-gray-100 dark:bg-gray-700"
                                      : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100"
                                  }`}
                                >
                                  <p className="text-sm">{msg.message}</p>
                                </div>
                                <div
                                  className={`text-xs text-gray-500 mt-1 ${
                                    msg.sender === "AI Assistant" ? "text-left" : "text-right"
                                  }`}
                                >
                                  {new Date(msg.timestamp).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "numeric",
                                      minute: "numeric",
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {conversation.isLive && (
                        <div className="flex mt-4 sticky bottom-0 bg-white dark:bg-gray-800 pt-2 pb-1 border-t border-gray-100 dark:border-gray-700">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 mr-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSendMessage();
                            }}
                          />
                          <Button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <SendIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Tasks</CardTitle>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              <PlusIcon className="h-4 w-4 mr-1" />
                              Add Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Task</DialogTitle>
                              <DialogDescription>
                                Add a new task related to this conversation.
                              </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="task-description">Description</Label>
                                <Textarea
                                  id="task-description"
                                  placeholder="Describe the task..."
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="task-assignee">Assign to</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select assignee" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="john">John Doe (Property Manager)</SelectItem>
                                    <SelectItem value="maintenance">Maintenance Team</SelectItem>
                                    <SelectItem value="plumbing">Plumbing Services Inc.</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="task-priority">Priority</Label>
                                <Select defaultValue="medium">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <DialogFooter>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Create Task</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      {conversation.tasks && conversation.tasks.length > 0 ? (
                        <div className="space-y-4">
                          {conversation.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-2">
                                  <div
                                    className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${
                                      task.status === "open" ? "bg-gray-100 dark:bg-gray-700" : "bg-indigo-100 dark:bg-indigo-900/30"
                                    }`}
                                  >
                                    {task.status === "open" ? (
                                      <CircleIcon className="h-3 w-3 text-gray-400" />
                                    ) : (
                                      <CheckIcon className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{task.description}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Created on {formatDate(task.created)} by {task.createdBy}
                                    </p>
                                    {task.notified.length > 0 && (
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Notified: {task.notified.join(", ")}
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
                              {task.status === "open" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-3 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                                  onClick={() => handleCloseTask(task.id)}
                                >
                                  <CheckIcon className="h-3 w-3 mr-2" />
                                  Mark as Complete
                                </Button>
                              )}
                              {task.photos && task.photos.length > 0 && (
                                <div className="mt-3 flex space-x-2">
                                  {task.photos.map((photo, index) => (
                                    <div key={index} className="relative h-16 w-16 rounded overflow-hidden">
                                      <img
                                        src={photo}
                                        alt={`Task photo ${index + 1}`}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = "https://via.placeholder.com/150?text=Photo+Unavailable";
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No tasks associated with this conversation.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-4 space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      {conversation.documents && conversation.documents.length > 0 ? (
                        <div className="space-y-2">
                          {conversation.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between border rounded-lg p-3 bg-white dark:bg-gray-800"
                            >
                              <div className="flex items-center">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mr-3">
                                  {doc.icon || <FileTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                                </div>
                                <div>
                                  <h4 className="font-medium">{doc.title}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {doc.type} • Added {formatDate(doc.uploadDate || new Date().toISOString())}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No documents associated with this conversation.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right column - Property and Contact info */}
          <div className="lg:col-span-1">
            {conversation.property && (
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <HomeIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <CardTitle className="text-base">Property</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="font-medium">{conversation.property.address}</div>
                    {conversation.property.unit && (
                      <div className="text-sm text-gray-500">Unit: {conversation.property.unit}</div>
                    )}
                    <div className="text-sm text-gray-500">
                      {conversation.property.city}, {conversation.property.state} {conversation.property.zip}
                    </div>
                    <div className="text-sm text-gray-500">Type: {conversation.property.type}</div>
                    {conversation.property.owner && (
                      <div className="text-sm text-gray-500">Owner: {conversation.property.owner}</div>
                    )}
                    {conversation.property.manager && (
                      <div className="text-sm text-gray-500">Manager: {conversation.property.manager}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {conversation.person && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <CardTitle className="text-base">Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={conversation.person.avatar} />
                      <AvatarFallback>
                        {conversation.person.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{conversation.person.name}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MailIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`mailto:${conversation.person.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {conversation.person.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`tel:${conversation.person.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {conversation.person.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex mt-4 space-x-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <MailIcon className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
