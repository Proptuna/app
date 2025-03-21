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
  FileTextIcon,
  WrenchIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  SearchIcon,
  LinkIcon,
  ArrowRightIcon,
  HomeIcon,
  InfoIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendMessageToAI } from "@/lib/llm-client";
import { Message, ToolUse, DocumentReference, ChatOptions } from "@/types/llm";
import { useRouter } from "next/navigation";

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm the Proptuna AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [createJob, setCreateJob] = useState(true);
  const [chatMode, setChatMode] = useState("chat");
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
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

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setError(null);
      const now = new Date();
      const timestamp = now.toISOString();
      
      // Add user message to the chat
      const userMessage: Message = {
        role: "user",
        content: inputMessage,
        timestamp,
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        // Prepare chat options
        const options: ChatOptions = {
          property: selectedProperty || undefined,
          person: selectedPerson || undefined,
          createJob,
        };

        // Send message to AI and get response
        const response = await sendMessageToAI([...messages, userMessage], options);
        
        // Add AI response to the chat
        setMessages(prevMessages => [...prevMessages, response]);
      } catch (err: any) {
        console.error("Error sending message:", err);
        setError(err.message || "Failed to get a response. Please try again.");
      } finally {
        setIsLoading(false);
      }
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
        
        const userMessage: Message = {
          role: "user",
          content: "I have a problem with my heating system.",
          timestamp: now.toISOString(),
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);

        // Simulate AI response with a document reference
        setTimeout(() => {
          const aiResponse: Message = {
            role: "assistant",
            content: "I understand you're having an issue with your heating system. Can you tell me more about what's happening? Is it not turning on, or is it not heating properly?",
            timestamp: now.toISOString(),
            documentReference: {
              id: "doc-789",
              title: "Heating System Troubleshooting",
              type: "markdown",
              relevance: "medium"
            }
          };
          
          setMessages(prevMessages => [...prevMessages, aiResponse]);
        }, 1000);
      }, 3000);
    }
  };

  const startNewConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm the Proptuna AI assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setInputMessage("");
    setError(null);
  };

  const formatTimestamp = (timestamp: string | undefined): string => {
    if (!timestamp) return "Just now";
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render different types of visual indicators
  const renderToolUseIndicator = (toolUse: ToolUse) => {
    return (
      <div className="flex flex-col mt-2 mb-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm font-medium mb-1">
          <WrenchIcon className="h-4 w-4" />
          <span>Tool: {toolUse.toolName}</span>
        </div>
        <div className="text-xs text-amber-600 dark:text-amber-500 font-mono bg-amber-100 dark:bg-amber-900/30 p-2 rounded">
          {JSON.stringify(toolUse.toolInput, null, 2)}
        </div>
        {toolUse.toolOutput && (
          <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-mono bg-green-50 dark:bg-green-900/30 p-2 rounded">
            {JSON.stringify(toolUse.toolOutput, null, 2)}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <Badge 
            variant="outline" 
            className={`${
              toolUse.status === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : toolUse.status === 'failed'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            {toolUse.status === 'completed' ? (
              <CheckCircleIcon className="h-3 w-3 mr-1" />
            ) : toolUse.status === 'failed' ? (
              <AlertCircleIcon className="h-3 w-3 mr-1" />
            ) : (
              <ClockIcon className="h-3 w-3 mr-1" />
            )}
            {toolUse.status}
          </Badge>
        </div>
      </div>
    );
  };

  const renderDocumentReference = (docRef: DocumentReference) => {
    return (
      <div 
        className="flex flex-col mt-2 mb-2 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-md border border-indigo-200 dark:border-indigo-800 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        onClick={() => router.push(`/documents-page?document=${docRef.id}`)}
      >
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-sm font-medium">
          <FileTextIcon className="h-4 w-4" />
          <span>Referenced Document</span>
          <Badge 
            variant="outline" 
            className={`ml-auto ${
              docRef.relevance === 'high' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : docRef.relevance === 'medium'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            {docRef.relevance} relevance
          </Badge>
        </div>
        <div className="mt-1 text-sm text-indigo-600 dark:text-indigo-300 flex items-center">
          <span className="font-medium">{docRef.title}</span>
          <ArrowRightIcon className="h-3 w-3 mx-1" />
          <span className="text-xs text-indigo-500 dark:text-indigo-400">View document</span>
        </div>
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowHistory(!showHistory)}
          >
            <HistoryIcon className="h-4 w-4" />
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Chat history sidebar */}
        {showHistory && (
          <div className="md:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Chat History</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="hotline">
                  <TabsList className="w-full">
                    <TabsTrigger value="hotline" className="flex-1">
                      Hotline
                    </TabsTrigger>
                    <TabsTrigger value="agent" className="flex-1">
                      Agent
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="hotline" className="mt-4">
                    <div className="space-y-3">
                      {chatHistory
                        .filter((chat) => chat.type === "hotline")
                        .map((chat) => (
                          <div
                            key={chat.id}
                            className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          >
                            <div className="font-medium text-sm">{chat.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {chat.date}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              {chat.preview}
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="agent" className="mt-4">
                    <div className="space-y-3">
                      {chatHistory
                        .filter((chat) => chat.type === "agent")
                        .map((chat) => (
                          <div
                            key={chat.id}
                            className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          >
                            <div className="font-medium text-sm">{chat.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {chat.date}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              {chat.preview}
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main chat area */}
        <div className={`${showHistory ? "md:col-span-9" : "md:col-span-12"}`}>
          <Card className="h-[75vh] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tabs
                    value={chatMode}
                    onValueChange={setChatMode}
                    className="w-[200px]"
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="chat" className="flex-1">
                        <MessageSquareIcon className="h-4 w-4 mr-2" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="voice" className="flex-1">
                        <VolumeIcon className="h-4 w-4 mr-2" />
                        Voice
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedProperty}
                      onValueChange={setSelectedProperty}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedPerson}
                      onValueChange={setSelectedPerson}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="create-job"
                      checked={createJob}
                      onCheckedChange={setCreateJob}
                    />
                    <label
                      htmlFor="create-job"
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      Create Job
                    </label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0 relative">
              {/* Chat messages */}
              <div
                ref={messagesContainerRef}
                className="h-full overflow-y-auto p-6 space-y-6"
              >
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className={`h-9 w-9 ${message.role === "user" ? "bg-indigo-100" : "bg-amber-100"}`}>
                        <AvatarFallback className={message.role === "user" ? "text-indigo-600" : "text-amber-600"}>
                          {message.role === "user" ? "U" : "AI"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col ${
                          message.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-3 ${
                            message.role === "user"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        </div>
                        
                        {/* Show tool use indicator if present */}
                        {message.toolUse && message.role === "assistant" && renderToolUseIndicator(message.toolUse)}
                        
                        {/* Show document reference if present */}
                        {message.documentReference && message.role === "assistant" && renderDocumentReference(message.documentReference)}
                        
                        <div className={`text-xs mt-1 text-gray-500 ${
                          message.role === "user" ? "text-right" : "text-left"
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-9 w-9 bg-amber-100">
                        <AvatarFallback className="text-amber-600">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex justify-center">
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                      <AlertCircleIcon className="h-4 w-4" />
                      {error}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <div className="p-4 border-t">
              {chatMode === "chat" ? (
                <div className="flex items-start gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className={`${
                      !inputMessage.trim() ? "opacity-70" : ""
                    } bg-indigo-600 hover:bg-indigo-700 text-white`}
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    onClick={toggleRecording}
                    className={`rounded-full w-12 h-12 flex items-center justify-center ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                    disabled={isLoading}
                  >
                    <MicIcon className="h-5 w-5 text-white" />
                  </Button>
                  {isRecording && <span className="ml-3 text-sm">Listening...</span>}
                </div>
              )}
              <div className="text-xs text-center mt-2 text-gray-500">
                <InfoIcon className="inline h-3 w-3 mr-1" />
                Chat messages are used to improve the AI assistant.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
