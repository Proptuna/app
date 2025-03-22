"use client"

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  FileTextIcon,
  ClipboardListIcon,
  UserIcon,
  SendIcon,
  CheckIcon,
  AlertTriangleIcon,
  PlusIcon,
  XIcon,
  CheckSquareIcon,
  CircleIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  HomeIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { AIConversation, Message } from "@/types/conversations";

interface AIConversationDetailProps {
  conversation: AIConversation;
  onClose: () => void;
}

export function AIConversationDetail({ conversation, onClose }: AIConversationDetailProps) {
  const [activeTab, setActiveTab] = useState("conversation");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if conversation data is valid
  if (!conversation || !conversation.id) {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 items-center justify-center p-8">
        <AlertTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold dark:text-white mb-2">Error Loading Conversation</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
          The conversation data is invalid or missing.
        </p>
        <Button onClick={onClose}>Go Back</Button>
      </div>
    );
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to an API
      console.log("Sending message:", newMessage);
      // Clear the input
      setNewMessage("");
    }
  };

  const handleAcceptSuggestedAction = () => {
    // In a real app, this would implement the suggested action
    console.log("Accepted suggested action");
  };

  const handleRejectSuggestedAction = () => {
    // In a real app, this would dismiss the suggestion
    console.log("Rejected suggested action");
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString; // Return the original string if there's an error
    }
  };

  // Get a color for a status badge
  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    
    switch (status.toLowerCase()) {
      case "completed":
      case "done":
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in progress":
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "open":
      case "new":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "pending":
      case "waiting":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "cancelled":
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold dark:text-white">{conversation.overview}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {conversation.needsAttention && (
            <Badge variant="destructive" className="mr-2">Needs Attention</Badge>
          )}
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Conversation details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="conversation" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger 
                  value="conversation" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-400 data-[state=active]:shadow-none rounded-none"
                >
                  <MessageSquareIcon className="h-4 w-4" />
                  <span>Messages</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="tasks" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-400 data-[state=active]:shadow-none rounded-none"
                >
                  <ClipboardListIcon className="h-4 w-4" />
                  <span>
                    Tasks
                    {conversation.tasks && conversation.tasks.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1 py-0">
                        {conversation.tasks.length}
                      </Badge>
                    )}
                  </span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="documents" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-400 data-[state=active]:shadow-none rounded-none"
                >
                  <FileTextIcon className="h-4 w-4" />
                  <span>
                    Documents
                    {conversation.documents && conversation.documents.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1 py-0">
                        {conversation.documents.length}
                      </Badge>
                    )}
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 bg-white dark:bg-gray-800 rounded-md">
                <TabsContent value="conversation" className="space-y-4 mt-0">
                  {conversation.needsAttention && conversation.suggestedAction && (
                    <Card className="bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-start">
                            <AlertTriangleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-indigo-900 dark:text-indigo-300">
                                Suggested Action
                              </h3>
                              <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                                {conversation.suggestedAction}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              onClick={handleAcceptSuggestedAction}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              <CheckIcon className="h-4 w-4 mr-1" />
                              Accept Suggestion
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleRejectSuggestedAction}
                              className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                            >
                              <XIcon className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {/* Messages */}
                    <div className="space-y-4">
                      {conversation.messages && conversation.messages.map((msg: Message, index: number) => (
                        <div 
                          key={index} 
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className={`flex ${
                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                          } items-start gap-2 max-w-[75%]`}>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.role === "user" ? conversation.person?.avatar : undefined} alt={msg.role} />
                              <AvatarFallback>
                                {msg.role === "user" 
                                  ? (conversation.person?.name?.charAt(0) || "U")
                                  : "AI"
                                }
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className={`rounded-lg p-3 ${
                              msg.role === "user" 
                                ? "bg-indigo-600 text-white" 
                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            }`}>
                              <p>{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message input */}
                    {conversation.isLive && (
                      <div className="flex items-center space-x-2 mt-4">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <SendIcon className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="p-0 mt-0">
                  <div className="p-4 space-y-4">
                    {conversation.tasks && conversation.tasks.length > 0 ? (
                      conversation.tasks.map((task) => (
                        <Card key={task.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{task.title || task.description}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {task.description}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(task.status || "")}>
                                  {task.status || "No Status"}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                  <UserIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>{task.assignee || task.createdBy}</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckSquareIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>Created: {formatDate(task.created)}</span>
                                </div>
                                {task.dueDate && (
                                  <div className="flex items-center">
                                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                    <span>Due: {formatDate(task.dueDate)}</span>
                                  </div>
                                )}
                              </div>
                              
                              {task.photos && task.photos.length > 0 && (
                                <div className="flex mt-3 space-x-2 overflow-x-auto py-1">
                                  {task.photos.map((photo, idx) => (
                                    <div key={idx} className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                                      <img 
                                        src={photo} 
                                        alt={`Task photo ${idx + 1}`} 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                              <div className="flex items-center space-x-1">
                                {task.notified && task.notified.length > 0 && (
                                  <div className="flex -space-x-1">
                                    {task.notified.slice(0, 3).map((person, idx) => (
                                      <Avatar key={idx} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                        <AvatarFallback className="text-xs">
                                          {person.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {task.notified.length > 3 && (
                                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                                        +{task.notified.length - 3}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
                                <MoreHorizontalIcon className="h-4 w-4 mr-1" />
                                <span>Update</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                          <ClipboardListIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks yet</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          There are no tasks associated with this conversation.
                        </p>
                        <Button className="mt-4">
                          <PlusIcon className="h-4 w-4 mr-1" />
                          <span>Create Task</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="p-0 mt-0">
                  <div className="p-4 space-y-4">
                    {conversation.documents && conversation.documents.length > 0 ? (
                      conversation.documents.map((doc) => (
                        <Card key={doc.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4 flex items-start space-x-3">
                              <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                <FileTextIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {doc.title}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-3">
                                  <span>{doc.type}</span>
                                  <span>{doc.size}</span>
                                  <span>{formatDate(doc.createdAt)}</span>
                                </div>
                              </div>
                              
                              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <DownloadIcon className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                          <FileTextIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No documents</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          There are no documents attached to this conversation.
                        </p>
                        <Button className="mt-4">
                          <PlusIcon className="h-4 w-4 mr-1" />
                          <span>Upload Document</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right column - Property and Contact details */}
          <div className="space-y-6">
            {/* Property details card */}
            {conversation.property && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <HomeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{conversation.property.address}</p>
                      {conversation.property.unit && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Unit {conversation.property.unit}</p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {conversation.property.city}, {conversation.property.state} {conversation.property.zip}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <BuildingIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{conversation.property.type}</p>
                      {conversation.property.manager && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Manager: {conversation.property.manager}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Contact details card */}
            {conversation.person && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.person.avatar} alt={conversation.person.name} />
                      <AvatarFallback>
                        {conversation.person.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium">{conversation.person.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <MailIcon className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{conversation.person.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{conversation.person.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Status and Date Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Conversation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <Badge className={getStatusColor(conversation.state || "")}>
                    {conversation.state || ""}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
                  <span className="text-sm">{formatDate(conversation.date)}</span>
                </div>
                
                {conversation.isLive && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <Badge variant="outline" className="border-green-500 text-green-600 dark:border-green-500 dark:text-green-500 flex items-center gap-1">
                      <CircleIcon className="h-2 w-2 fill-green-500" />
                      <span>Live</span>
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
