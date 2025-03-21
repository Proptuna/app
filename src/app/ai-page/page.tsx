"use client"

import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  SendIcon,
  MicIcon,
  ClockIcon,
  HistoryIcon,
  MessageSquareIcon,
  VolumeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIPage() {
  const [messages, setMessages] = useState<
    Array<{ sender: "ai" | "user"; text: string; timestamp: string }>
  >([
    {
      sender: "ai",
      text: "Hello! I'm the Proptuna AI assistant. How can I help you today?",
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [createJob, setCreateJob] = useState(false);
  const [chatMode, setChatMode] = useState("chat");
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const properties = [
    { id: "1", name: "Vista Ridge - Unit 1" },
    { id: "2", name: "Vista Ridge - Unit 2" },
    { id: "3", name: "935 Woodmoor" },
  ];

  const people = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Robert Johnson" },
  ];

  // Chat history for both hotline and agent
  const chatHistory = [
    {
      id: "1",
      title: "Broken dishwasher inquiry",
      date: "June 15, 2023",
      preview: "My dishwasher isn't working properly...",
      type: "hotline",
    },
    {
      id: "2",
      title: "Rent payment question",
      date: "June 10, 2023",
      preview: "I wanted to confirm my rent payment...",
      type: "agent",
    },
    {
      id: "3",
      title: "Maintenance request",
      date: "June 5, 2023",
      preview: "The bathroom sink is leaking...",
      type: "hotline",
    },
    {
      id: "4",
      title: "System question",
      date: "May 28, 2023",
      preview: "How do I update my contact information?",
      type: "agent",
    },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Force scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages([
        ...messages,
        {
          sender: "user",
          text: inputMessage,
          timestamp: timeString,
        },
      ]);
      setInputMessage("");

      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "I understand your concern. Let me help you with that. Could you provide more details about the issue?",
            timestamp: timeString,
          },
        ]);
      }, 1000);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate starting recording
      setTimeout(() => {
        // Simulate ending recording and getting a response
        setIsRecording(false);
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setMessages([
          ...messages,
          {
            sender: "user",
            text: "I have a problem with my heating system.",
            timestamp: timeString,
          },
        ]);

        // Simulate AI response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: "I understand you're having an issue with your heating system. Can you tell me more about what's happening? Is it not turning on, or is it not heating properly?",
              timestamp: timeString,
            },
          ]);
        }, 1000);
      }, 3000);
    }
  };

  const startNewConversation = () => {
    setMessages([
      {
        sender: "ai",
        text: "Hello! I'm the Proptuna AI assistant. How can I help you today?",
        timestamp: "Just now",
      },
    ]);
    setInputMessage("");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">
            Chat with our AI assistant about your properties and tenants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            onClick={startNewConversation}
          >
            <PlusIcon className="h-4 w-4" />
            New Chat
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? (
              <MessageSquareIcon className="h-4 w-4" />
            ) : (
              <HistoryIcon className="h-4 w-4" />
            )}
            {showHistory ? "Back to Chat" : "View History"}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-[calc(100vh-180px)]">
        {showHistory ? (
          <div className="p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              Chat History
            </h2>
            <div className="space-y-3">
              {chatHistory.map((chat, index) => (
                <Card
                  key={chat.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => {
                    setShowHistory(false);
                  }}
                  id={`0243g1_${index}`}
                >
                  <CardContent
                    className="p-4 flex items-start"
                    id={`2g6psk_${index}`}
                  >
                    <div className="mr-4 mt-1" id={`e1czzn_${index}`}>
                      {chat.type === "hotline" ? (
                        <MessageSquareIcon
                          className="h-5 w-5 text-indigo-500"
                          id={`rjom3z_${index}`}
                        />
                      ) : (
                        <VolumeIcon
                          className="h-5 w-5 text-green-500"
                          id={`shcs9v_${index}`}
                        />
                      )}
                    </div>
                    <div className="flex-1" id={`x22c4m_${index}`}>
                      <div
                        className="flex justify-between items-start"
                        id={`p08q0t_${index}`}
                      >
                        <h3 className="font-medium" id={`95wa8o_${index}`}>
                          {chat.title}
                        </h3>
                        <div
                          className="flex items-center text-xs text-gray-500"
                          id={`kjgtks_${index}`}
                        >
                          <ClockIcon
                            className="h-3 w-3 mr-1"
                            id={`m3a9mq_${index}`}
                          />
                          {chat.date}
                        </div>
                      </div>
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        id={`9v0lk9_${index}`}
                      >
                        {chat.preview}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-0 flex-1 flex flex-col h-full relative overflow-hidden">
            <div
              className="absolute inset-0 pt-2 px-4 pb-[140px] overflow-y-auto"
              ref={messagesContainerRef}
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex flex-col min-h-full justify-end">
                {/* Message bubbles with improved grouping */}
                {messages.map((message, index) => {
                  // Check if this message is from the same sender as the previous
                  const isPreviousSameSender = index > 0 && messages[index - 1].sender === message.sender;
                  // Add smaller margin if from same sender for better grouping
                  const marginClass = isPreviousSameSender ? 'mb-1' : 'mb-4';
                  
                  return (
                    <div
                      key={index}
                      className={`flex ${marginClass} ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      id={`message-${index}`}
                    >
                      {/* Only show avatar for first message in a group */}
                      {message.sender === "ai" && !isPreviousSameSender && (
                        <Avatar className="h-8 w-8 mr-2 shrink-0" id={`g2otsd_${index}`}>
                          <AvatarImage
                            src="https://github.com/polymet-ai.png"
                            alt="AI"
                            id={`phhgdq_${index}`}
                          />
                          <AvatarFallback id={`82jwph_${index}`}>AI</AvatarFallback>
                        </Avatar>
                      )}
                      
                      {/* Spacer for message alignment when no avatar */}
                      {message.sender === "ai" && isPreviousSameSender && (
                        <div className="w-8 mr-2 shrink-0"></div>
                      )}

                      <div
                        className={`max-w-[70%] p-3 ${
                          message.sender === "user"
                            ? "bg-indigo-600 text-white rounded-t-lg rounded-bl-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-t-lg rounded-br-lg"
                        } ${
                          // Adjust rounding for message groups
                          isPreviousSameSender 
                            ? message.sender === "user" 
                              ? "rounded-r-lg" 
                              : "rounded-l-lg"
                            : ""
                        }`}
                        id={`7dzsr7_${index}`}
                      >
                        <div className="text-sm" id={`bcafvr_${index}`}>
                          {message.text}
                        </div>
                        <div
                          className="text-xs mt-1 opacity-70"
                          id={`54q6gy_${index}`}
                        >
                          {message.timestamp}
                        </div>
                      </div>

                      {/* Same for user avatar - only show for first message in group */}
                      {message.sender === "user" && !isPreviousSameSender && (
                        <Avatar className="h-8 w-8 ml-2 shrink-0" id={`0wbtqt_${index}`}>
                          <AvatarImage
                            src="https://github.com/yusufhilmi.png"
                            alt="User"
                            id={`kaw23p_${index}`}
                          />
                          <AvatarFallback id={`ezcbyw_${index}`}>U</AvatarFallback>
                        </Avatar>
                      )}
                      
                      {/* Spacer for message alignment when no avatar */}
                      {message.sender === "user" && isPreviousSameSender && (
                        <div className="w-8 ml-2 shrink-0"></div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area - fixed at the bottom with optimized height */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <Select
                    value={selectedProperty}
                    onValueChange={setSelectedProperty}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property, index) => (
                        <SelectItem
                          key={property.id}
                          value={property.id}
                          id={`jjx8yg_${index}`}
                        >
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={selectedPerson}
                    onValueChange={setSelectedPerson}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Person" />
                    </SelectTrigger>
                    <SelectContent>
                      {people.map((person, index) => (
                        <SelectItem
                          key={person.id}
                          value={person.id}
                          id={`ja2j23_${index}`}
                        >
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <span
                    className="text-sm text-gray-600 dark:text-gray-400 mr-2"
                  >
                    Create job
                  </span>
                  <Switch
                    checked={createJob}
                    onCheckedChange={setCreateJob}
                  />
                </div>
              </div>

              <div className="flex gap-2 items-center p-3">
                <div className="mr-2 hidden sm:block">
                  <div className="flex space-x-1 h-9">
                    <Button
                      variant={chatMode === "chat" ? "default" : "outline"}
                      onClick={() => setChatMode("chat")}
                      className={`px-3 h-9 ${chatMode === "chat" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"}`}
                      size="sm"
                    >
                      <MessageSquareIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Chat</span>
                    </Button>
                    <Button
                      variant={chatMode === "voice" ? "default" : "outline"}
                      onClick={() => setChatMode("voice")}
                      className={`px-3 h-9 ${chatMode === "voice" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"}`}
                      size="sm"
                    >
                      <VolumeIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Voice</span>
                    </Button>
                  </div>
                </div>

                {chatMode === "chat" ? (
                  <>
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 rounded-full border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 h-9"
                    />

                    <Button onClick={handleSendMessage} className="rounded-full p-2 aspect-square h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white" size="icon">
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={toggleRecording}
                    size="lg"
                    className={`flex-1 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
                  >
                    <MicIcon className="h-5 w-5 mr-2" />
                    {isRecording ? "Recording..." : "Start Recording"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
