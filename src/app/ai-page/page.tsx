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
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Info as InfoIcon,
  Send as SendIcon,
  Mic as MicIcon,
  MessageSquare as MessageSquareIcon,
  Volume as VolumeIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Plus as PlusIcon,
  FileText as FileTextIcon,
  Wrench as WrenchIcon,
  Search as SearchIcon,
  Link as LinkIcon,
  ArrowRight as ArrowRightIcon,
  Sliders as SlidersIcon,
  Phone as PhoneIcon,
  History as HistoryIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendMessageToAI } from "@/lib/llm-client";
import { 
  Message, 
  ToolUse, 
  DocumentReference, 
  ChatOptions, 
  MaintenanceTask,
  FollowUpRequest
} from "@/types/llm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm the Proptuna AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedPerson, setSelectedPerson] = useState("all");
  const [chatMode, setChatMode] = useState<"chat" | "voice">("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const properties = [
    { id: "1", name: "Vista Ridge - Unit 1", address: "123 Main St" },
    { id: "2", name: "Vista Ridge - Unit 2", address: "456 Elm St" },
    { id: "3", name: "935 Woodmoor", address: "789 Oak St" },
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
          property: selectedProperty === 'all' ? undefined : selectedProperty,
          person: selectedPerson === 'all' ? undefined : selectedPerson,
          createTask,
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

  // Improved tool use indicator with better formatting
  const renderToolUseIndicator = (toolUse: ToolUse) => {
    if (!toolUse.name) return null;
    
    // For maintenance tasks, show a more user-friendly display
    if (toolUse.name === "createMaintenanceTask") {
      const task = toolUse.args as MaintenanceTask;
      
      const getPriorityColor = (priority: string) => {
        switch(priority) {
          case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
          case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
          case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
      };
      
      // Get estimated response time based on priority
      const getEstimatedResponse = (priority: string) => {
        switch(priority) {
          case 'emergency': return 'ASAP / Within 1 hour';
          case 'high': return 'Within 4 hours';
          case 'medium': return '1-2 business days';
          case 'low': return '3-5 business days';
          default: return 'Based on priority';
        }
      };
      
      return (
        <div className="mt-2 mb-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Maintenance task created successfully</span>
            <Badge variant="outline" className={`ml-auto ${getPriorityColor(task.priority)}`}>
              {task.priority || 'normal'} priority
            </Badge>
          </div>
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <HomeIcon className="h-4 w-4" />
              <span className="font-medium">Property:</span>
              <span>{task.property || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <UserIcon className="h-4 w-4" />
              <span className="font-medium">Contact:</span>
              <span>{task.contact || 'Not specified'}</span>
            </div>
            
            <div className="col-span-1 md:col-span-2 flex items-start gap-2 text-gray-600 dark:text-gray-400 mt-1">
              <AlertCircleIcon className="h-4 w-4 mt-0.5" />
              <div>
                <span className="font-medium">Issue:</span>
                <p className="mt-1">{task.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ClockIcon className="h-4 w-4" />
              <span className="font-medium">Expected response:</span>
              <span>{getEstimatedResponse(task.priority)}</span>
            </div>
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-500">
            <CalendarIcon className="h-3 w-3" />
            <span>Created: {new Date().toLocaleString()}</span>
          </div>
          
          <div className="mt-1 text-xs text-gray-500">
            Property management has been notified. See guidance below.
          </div>
        </div>
      );
    }
    
    // For follow-up requests, show a friendly display
    if (toolUse.name === "createFollowUp") {
      const followUp = toolUse.args as FollowUpRequest;
      
      return (
        <div className="mt-2 mb-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm font-medium">
            <InfoIcon className="h-4 w-4" />
            <span>Follow-up request created</span>
            <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              pending
            </Badge>
          </div>
          
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <SearchIcon className="h-4 w-4 mt-0.5" />
              <div>
                <span className="font-medium">Question:</span>
                <p className="mt-1">{followUp.question}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <ArrowRightIcon className="h-4 w-4 mt-0.5" />
              <div>
                <span className="font-medium">Reason:</span>
                <p className="mt-1">{followUp.reason}</p>
              </div>
            </div>
            
            {followUp.contactInfo && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <PhoneIcon className="h-4 w-4" />
                <span className="font-medium">Contact:</span>
                <span>{followUp.contactInfo}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-500">
            <CalendarIcon className="h-3 w-3" />
            <span>Created: {new Date().toLocaleString()}</span>
          </div>
        </div>
      );
    }
    
    // For other tools, show the standard display
    return (
      <div className="mt-2 mb-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          <WrenchIcon className="h-4 w-4" />
          <span>Using Tool: {toolUse.name}</span>
        </div>
        {toolUse.args && (
          <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2 overflow-x-auto">
            <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {JSON.stringify(toolUse.args, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  // Render document reference
  const renderDocumentReference = (docRef: DocumentReference) => {
    if (!docRef) return null;
    
    return (
      <div 
        className="mt-2 mb-2 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-md border border-indigo-200 dark:border-indigo-800 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        onClick={() => router.push(docRef.url || `/documents-page?docId=${docRef.id}`)}
      >
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-sm font-medium">
          <FileTextIcon className="h-4 w-4" />
          <span>{docRef.title}</span>
          <Badge variant="outline" className="ml-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            {docRef.id.startsWith('doc-') ? docRef.id : `doc-${docRef.id}`}
          </Badge>
          {docRef.relevance && (
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
          )}
        </div>
        <div className="mt-1 text-xs text-indigo-500 dark:text-indigo-400 flex items-center">
          <span>View document</span>
          <ArrowRightIcon className="h-3 w-3 ml-1" />
        </div>
      </div>
    );
  };

  // Format the chat message content, handling document references and links
  const formatMessageContent = (content: string) => {
    if (!content) return "";
    
    // Replace document ID references with styled spans
    let formattedContent = content.replace(/<(doc-[^>]+)>/g, (match, docId) => {
      return `<span class="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-1 rounded-sm font-mono text-xs">${docId}</span>`;
    });
    
    // Replace markdown document links with Next.js Links
    // [Document Title](/documents-page?docId=123) format
    formattedContent = formattedContent.replace(/\[([^\]]+)\]\(\/documents-page\?docId=([^)]+)\)/g, (match, title, docId) => {
      return `<a href="/documents-page?docId=${docId}" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline">${title}</a>`;
    });
    
    // Handle markdown bold formatting (**text**)
    formattedContent = formattedContent.replace(/\*\*([^*]+)\*\*/g, (match, text) => {
      return `<strong>${text}</strong>`;
    });
    
    // Handle markdown headers (## Heading)
    formattedContent = formattedContent.replace(/^##\s+(.+)$/gm, (match, text) => {
      return `<h2 class="text-lg font-bold mt-3 mb-2">${text}</h2>`;
    });
    
    // Handle markdown lists (- item)
    formattedContent = formattedContent.replace(/^-\s+(.+)$/gm, (match, text) => {
      return `<li class="ml-4">• ${text}</li>`;
    });
    
    // Wrap lists in ul tags
    formattedContent = formattedContent.replace(/<li class="ml-4">(.+)<\/li>\n<li class="ml-4">(.+)<\/li>/g, (match) => {
      return `<ul class="my-2">${match}</ul>`;
    });
    
    return formattedContent;
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
                        {/* Show tool use indicator before content for maintenance tasks */}
                        {message.toolUse && 
                         message.role === "assistant" && 
                         message.toolUse.name === "createMaintenanceTask" && 
                         renderToolUseIndicator(message.toolUse)}
                        
                        {/* Message content with Markdown support */}
                        {message.content && (
                          <div 
                            className={`rounded-lg px-4 py-3 ${
                              message.role === "user"
                                ? "bg-indigo-600 text-white prose-invert"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <div 
                              className="prose dark:prose-invert max-w-none" 
                              dangerouslySetInnerHTML={{ 
                                __html: formatMessageContent(message.content) 
                              }} 
                            />
                          </div>
                        )}
                        
                        {/* Show tool use indicator after content for non-maintenance tasks */}
                        {message.toolUse && 
                         message.role === "assistant" && 
                         message.toolUse.name !== "createMaintenanceTask" && 
                         renderToolUseIndicator(message.toolUse)}
                        
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
            <div className="p-4 border-t relative">
              {/* Options drawer - integrated with the input area */}
              <div className={`transition-all duration-300 ease-in-out ${drawerOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 mb-2">
                  <div className="flex flex-wrap gap-4">
                    <div className="w-full mb-2">
                      <h3 className="text-sm font-medium mb-1">Chat Mode</h3>
                      <Tabs
                        value={chatMode}
                        onValueChange={(value) => setChatMode(value as "chat" | "voice")}
                        className="w-full"
                      >
                        <TabsList className="w-full">
                          <TabsTrigger value="chat" className="flex-1">
                            <MessageSquareIcon className="h-4 w-4 mr-2" />
                            Text Chat
                          </TabsTrigger>
                          <TabsTrigger value="voice" className="flex-1">
                            <VolumeIcon className="h-4 w-4 mr-2" />
                            Voice Chat
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="text-sm font-medium mb-1">Property Filter</h3>
                      <Select 
                        value={selectedProperty} 
                        onValueChange={setSelectedProperty}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any property</SelectItem>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="text-sm font-medium mb-1">Person Filter</h3>
                      <Select 
                        value={selectedPerson} 
                        onValueChange={setSelectedPerson}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select person" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any person</SelectItem>
                          {people.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Task Creation</h3>
                          <p className="text-xs text-muted-foreground">Allow AI to create maintenance tasks</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="create-task"
                            checked={createTask}
                            onCheckedChange={setCreateTask}
                          />
                          <label
                            htmlFor="create-task"
                            className="text-sm font-medium cursor-pointer select-none"
                          >
                            {createTask ? 'Enabled' : 'Disabled'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                {/* Chat input with integrated options button */}
                <div className="flex w-full items-center gap-2">
                  {chatMode === "chat" ? (
                    <>
                      <div className="flex-grow relative rounded-md shadow-sm">
                        <Input
                          placeholder="Type your message..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDrawerOpen(!drawerOpen)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          type="button"
                        >
                          <SlidersIcon className={`h-4 w-4 transition-transform ${drawerOpen ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 h-10 w-10 flex-shrink-0"
                        disabled={isLoading || !inputMessage.trim()}
                        type="submit"
                      >
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    </>
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
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
