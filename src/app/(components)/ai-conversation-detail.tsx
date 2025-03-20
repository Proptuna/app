"use client"

import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  FileTextIcon,
  ClipboardListIcon,
  BuildingIcon,
  UserIcon,
  SendIcon,
  PlusIcon,
  CheckIcon,
  MailIcon,
  PhoneIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyInfo } from "(components)/property-info";

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
          <h2 className="text-xl font-semibold truncate max-w-[500px]">{conversation.overview}</h2>
          {conversation.needsAttention && (
            <Badge variant="outline" className="ml-2 text-red-500 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              Needs Attention
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 overflow-y-auto flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Conversation details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 w-full justify-start border-b rounded-none p-0 h-auto">
                <TabsTrigger value="overview" className="flex items-center rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 px-4">
                  <MessageSquareIcon className="h-4 w-4 mr-2" />
                  Conversation
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 px-4">
                  <ClipboardListIcon className="h-4 w-4 mr-2" />
                  Tasks
                  {conversation.tasks && conversation.tasks.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {conversation.tasks.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 px-4">
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Documents
                  {conversation.documents && conversation.documents.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {conversation.documents.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {showResolutionActions && conversation.suggestedAction && (
                  <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-3">
                        <div className="font-medium">Suggested Action:</div>
                        <div className="text-sm">{conversation.suggestedAction}</div>
                        <div className="flex space-x-2 mt-2">
                          <Button
                            size="sm"
                            onClick={handleAcceptSuggestedAction}
                            className="flex items-center"
                          >
                            <ThumbsUpIcon className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRejectSuggestedAction}
                            className="flex items-center"
                          >
                            <ThumbsDownIcon className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4 max-h-[400px] overflow-y-auto p-1 pr-2">
                  {conversation.conversation?.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "AI" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          msg.sender === "AI" ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <Avatar
                          className={`h-8 w-8 ${
                            msg.sender === "AI" ? "mr-2" : "ml-2"
                          }`}
                        >
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>
                            {msg.sender === "AI" ? "AI" : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              msg.sender === "AI"
                                ? "bg-gray-100 dark:bg-gray-700"
                                : "bg-blue-100 dark:bg-blue-900"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <div
                            className={`text-xs text-gray-500 mt-1 ${
                              msg.sender === "AI" ? "text-left" : "text-right"
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
                    <Button onClick={handleSendMessage}>
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                {conversation.tasks && conversation.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {conversation.tasks.map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{task.description}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                Created on {formatDate(task.created)} by{" "}
                                {task.createdBy}
                              </div>
                              {task.notified.length > 0 && (
                                <div className="text-sm text-gray-500 mt-1">
                                  Notified: {task.notified.join(", ")}
                                </div>
                              )}
                            </div>
                            <Badge
                              variant={
                                task.status === "open" ? "secondary" : "outline"
                              }
                              className="ml-2"
                            >
                              {task.status}
                            </Badge>
                          </div>
                          {task.status === "open" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => handleCloseTask(task.id)}
                            >
                              <CheckIcon className="h-3 w-3 mr-2" />
                              Mark as Complete
                            </Button>
                          )}
                          {task.photos && task.photos.length > 0 && (
                            <div className="mt-3 flex space-x-2">
                              {task.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo}
                                  alt={`Task photo ${index + 1}`}
                                  className="h-16 w-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardListIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No tasks have been created for this conversation.</p>
                    <Button className="mt-4">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {conversation.documents && conversation.documents.length > 0 ? (
                  <div className="space-y-2">
                    {conversation.documents.map((doc, index) => (
                      <Card key={index}>
                        <CardContent className="p-3 flex items-center">
                          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center mr-3">
                            {doc.icon || <FileTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-xs text-gray-500">{doc.type}</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No documents attached to this conversation.</p>
                    <Button className="mt-4">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Attach Document
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Property and person info */}
          <div className="space-y-4">
            {conversation.property && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    Property
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">
                      {conversation.property.address}
                      {conversation.property.unit && `, Unit ${conversation.property.unit}`}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {conversation.property.city}, {conversation.property.state}{" "}
                      {conversation.property.zip}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Type: {conversation.property.type}
                    </div>
                    {conversation.property.owner && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Owner: {conversation.property.owner}
                      </div>
                    )}
                    {conversation.property.manager && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Manager: {conversation.property.manager}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {conversation.person && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={conversation.person.avatar} />
                      <AvatarFallback>
                        {getInitials(conversation.person.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{conversation.person.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {conversation.person.email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <PhoneIcon
                        className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2"
                      />
                      <span>{conversation.person.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <MailIcon className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" className="flex-1">
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
