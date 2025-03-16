"use client"

import React, { useState } from "react";
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

interface Job {
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

interface JobDetailProps {
  job: Job;
  onClose: () => void;
}

export function JobDetail({ job, onClose }: JobDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");
  const [showResolutionActions, setShowResolutionActions] = useState(
    job.needsAttention || false,
  );

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
    // In a real app, this would reject the suggested action
    console.log("Rejected suggested action");
    setShowResolutionActions(false);
  };

  return (
    <div
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-right"
    >
      <header
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </Button>
        {job.state && (
          <Badge
            className={`${
              job.state === "task created"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                : job.state === "chat ended"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {job.state}
          </Badge>
        )}
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Job overview and property info */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle
                  className="flex justify-between items-center"
                >
                  <span>Job Overview</span>
                  {job.state && (
                    <Badge
                      className={`${
                        job.state === "task created"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : job.state === "chat ended"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {job.state}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3
                    className="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Description
                  </h3>
                  <p className="text-xl font-semibold mt-1">
                    {job.overview}
                  </p>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <h3
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Property
                    </h3>
                    <p className="text-base font-medium mt-1">
                      {job.property?.address}
                      {job.property?.unit && `, Apt ${job.property.unit}`}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Reported by
                    </h3>
                    <p className="text-base font-medium mt-1">
                      {job.person?.name}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Date
                    </h3>
                    <p className="text-base font-medium mt-1">
                      {job.date}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Contact
                    </h3>
                    <p className="text-base font-medium mt-1">
                      {job.person?.email}
                    </p>
                  </div>
                </div>

                {job.property && (
                  <PropertyInfo property={job.property} />
                )}

                {showResolutionActions && job.suggestedAction && (
                  <div
                    className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4"
                  >
                    <h3
                      className="font-medium text-amber-800 dark:text-amber-400 mb-2"
                    >
                      Suggested Action
                    </h3>
                    <p
                      className="text-amber-700 dark:text-amber-300 mb-4"
                    >
                      {job.suggestedAction}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAcceptSuggestedAction}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <ThumbsUpIcon className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={handleRejectSuggestedAction}
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                      >
                        <ThumbsDownIcon className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs
              defaultValue="conversations"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="conversations"
                  className="flex items-center gap-2"
                >
                  <MessageSquareIcon className="h-4 w-4" />
                  Conversations
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="flex items-center gap-2"
                >
                  <ClipboardListIcon className="h-4 w-4" />
                  Tasks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="conversations" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {job.conversation && job.conversation.length > 0 ? (
                      <div
                        className="space-y-4 max-h-[400px] overflow-y-auto p-2"
                      >
                        {job.conversation.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              msg.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                            id={`5ysmj4_${index}`}
                          >
                            {msg.sender !== "user" && (
                              <Avatar
                                className="h-8 w-8 mr-2"
                                id={`kwx549_${index}`}
                              >
                                <AvatarImage
                                  src={
                                    msg.avatar ||
                                    "https://github.com/polymet-ai.png"
                                  }
                                  id={`wp8gny_${index}`}
                                />

                                <AvatarFallback id={`z9hy61_${index}`}>
                                  {msg.sender.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                msg.sender === "user"
                                  ? "bg-indigo-600 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              }`}
                              id={`rjb7la_${index}`}
                            >
                              <div className="text-sm" id={`u3cz5w_${index}`}>
                                {msg.message}
                              </div>
                              <div
                                className="text-xs mt-1 opacity-70"
                                id={`vs8iyc_${index}`}
                              >
                                {msg.timestamp}
                              </div>
                            </div>

                            {msg.sender === "user" && (
                              <Avatar
                                className="h-8 w-8 ml-2"
                                id={`ib4dsr_${index}`}
                              >
                                <AvatarImage
                                  src="https://github.com/yusufhilmi.png"
                                  id={`ak09i1_${index}`}
                                />
                                <AvatarFallback id={`5ymep3_${index}`}>
                                  U
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-center text-gray-500 dark:text-gray-400 py-8"
                      >
                        No conversation history available.
                      </div>
                    )}

                    {job.isLive && (
                      <div
                        className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex"
                      >
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 mr-2"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                        />

                        <Button onClick={handleSendMessage}>
                          <SendIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {job.tasks && job.tasks.length > 0 ? (
                      <div className="space-y-4">
                        {job.tasks.map((task, index) => (
                          <Card
                            key={task.id}
                            className="overflow-hidden border border-gray-200 dark:border-gray-700"
                            id={`pgo022_${index}`}
                          >
                            <CardHeader
                              className="p-4 pb-2 flex flex-row items-start justify-between"
                              id={`6e3izr_${index}`}
                            >
                              <div id={`k2ehrv_${index}`}>
                                <CardTitle
                                  className="text-lg"
                                  id={`uxxnyx_${index}`}
                                >
                                  {task.description}
                                </CardTitle>
                                <div
                                  className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                                  id={`elqxjj_${index}`}
                                >
                                  Created on {task.created} by {task.createdBy}
                                </div>
                              </div>
                              <Badge
                                className={
                                  task.status === "open"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                }
                                id={`348bsc_${index}`}
                              >
                                {task.status}
                              </Badge>
                            </CardHeader>
                            <CardContent
                              className="p-4 pt-2"
                              id={`1oab7u_${index}`}
                            >
                              <div className="mb-4" id={`aqpzqv_${index}`}>
                                <h4
                                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                  id={`creg55_${index}`}
                                >
                                  Notified:
                                </h4>
                                <div
                                  className="flex flex-wrap gap-2"
                                  id={`jklguo_${index}`}
                                >
                                  {task.notified.map((person, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      id={`lkxhpu_${idx}`}
                                    >
                                      {person}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {task.photos && task.photos.length > 0 && (
                                <div className="mb-4" id={`fzudsz_${index}`}>
                                  <h4
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    id={`8zzyrl_${index}`}
                                  >
                                    Photos:
                                  </h4>
                                  <div
                                    className="flex gap-2 overflow-x-auto pb-2"
                                    id={`dp3qf5_${index}`}
                                  >
                                    {task.photos.map((photo, idx) => (
                                      <img
                                        key={idx}
                                        src={photo}
                                        alt={`Task photo ${idx + 1}`}
                                        className="h-20 w-20 object-cover rounded-md"
                                        id={`rl9nlx_${idx}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {task.status === "open" && (
                                <Button
                                  onClick={() => handleCloseTask(task.id)}
                                  className="mt-2"
                                  variant="outline"
                                  id={`ablfct_${index}`}
                                >
                                  <CheckIcon
                                    className="h-4 w-4 mr-2"
                                    id={`bxa7nz_${index}`}
                                  />
                                  Mark as Closed
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-center text-gray-500 dark:text-gray-400 py-8"
                      >
                        No tasks available for this job.
                      </div>
                    )}

                    <Button className="mt-4" variant="outline">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create New Task
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Documents and contact info */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {job.documents && job.documents.length > 0 ? (
                  <div className="space-y-4">
                    {job.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        id={`by69a9_${index}`}
                      >
                        <FileTextIcon
                          className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3"
                          id={`d9jr9x_${index}`}
                        />
                        <div id={`t7znof_${index}`}>
                          <div className="font-medium" id={`btcrb1_${index}`}>
                            {doc.title}
                          </div>
                          <div
                            className="text-sm text-gray-500 dark:text-gray-400"
                            id={`fwq6cs_${index}`}
                          >
                            {doc.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center text-gray-500 dark:text-gray-400 py-4"
                  >
                    No documents available.
                  </div>
                )}
              </CardContent>
            </Card>

            {job.person && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          job.person.avatar ||
                          "https://github.com/yusufhilmi.png"
                        }
                        alt={job.person.name}
                      />

                      <AvatarFallback>
                        {job.person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {job.person.name}
                      </h3>
                      <p
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        Tenant
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MailIcon
                        className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2"
                      />
                      <span>{job.person.email}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon
                        className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2"
                      />
                      <span>{job.person.phone}</span>
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
