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
  const [agentMessages, setAgentMessages] = useState<
    Array<{ sender: "ai" | "user"; text: string; timestamp: string }>
  >([
    {
      sender: "ai",
      text: "Hello! I'm the Proptuna Agent. I can help you with system questions or perform common tasks. What would you like to know?",
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [agentInputMessage, setAgentInputMessage] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [createJob, setCreateJob] = useState(false);
  const [activeTab, setActiveTab] = useState("hotline");
  const [chatMode, setChatMode] = useState("chat");
  const [agentChatMode, setAgentChatMode] = useState("chat");
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isHotlineCollapsed, setIsHotlineCollapsed] = useState(false);
  const [isAgentCollapsed, setIsAgentCollapsed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agentMessagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const agentMessagesContainerRef = useRef<HTMLDivElement>(null);

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
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (agentMessagesEndRef.current && agentMessagesContainerRef.current) {
      const container = agentMessagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [agentMessages]);

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

  const handleSendAgentMessage = () => {
    if (agentInputMessage.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setAgentMessages([
        ...agentMessages,
        {
          sender: "user",
          text: agentInputMessage,
          timestamp: timeString,
        },
      ]);
      setAgentInputMessage("");

      // Simulate Agent response
      setTimeout(() => {
        setAgentMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "I can help you with that. To answer your question, you can find this information in the system settings. Would you like me to guide you through the process?",
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

        if (activeTab === "hotline") {
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
        } else {
          setAgentMessages([
            ...agentMessages,
            {
              sender: "user",
              text: "How do I submit a maintenance request?",
              timestamp: timeString,
            },
          ]);

          // Simulate Agent response
          setTimeout(() => {
            setAgentMessages((prev) => [
              ...prev,
              {
                sender: "ai",
                text: "To submit a maintenance request, you can go to the Properties section, select your property, and click on 'Create New Job' in the Quick Actions panel. You'll be able to provide details about the maintenance issue there.",
                timestamp: timeString,
              },
            ]);
          }, 1000);
        }
      }, 3000);
    }
  };

  const startNewConversation = (tab: string) => {
    if (tab === "hotline") {
      setIsHotlineCollapsed(false);
    } else {
      setIsAgentCollapsed(false);
    }
  };

  const renderChatInterface = (
    messages: Array<{ sender: "ai" | "user"; text: string; timestamp: string }>,
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    handleSend: () => void,
    mode: string,
    setMode: React.Dispatch<React.SetStateAction<string>>,
    isCollapsed: boolean,
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
    messagesEndRef: React.RefObject<HTMLDivElement>,
    messagesContainerRef: React.RefObject<HTMLDivElement>,
  ) => (
    <div className="flex-1 flex flex-col p-0 m-0">
      <div
        className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700"
      >
        <h3 className="font-medium">
          Conversation
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronUpIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div
            className="flex-1 p-6 overflow-y-auto"
            ref={messagesContainerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                id={`message-${index}`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8 mr-2" id={`g2otsd_${index}`}>
                    <AvatarImage
                      src="https://github.com/polymet-ai.png"
                      alt="AI"
                      id={`phhgdq_${index}`}
                    />

                    <AvatarFallback id={`82jwph_${index}`}>AI</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 ml-2" id={`0wbtqt_${index}`}>
                    <AvatarImage
                      src="https://github.com/yusufhilmi.png"
                      alt="User"
                      id={`kaw23p_${index}`}
                    />

                    <AvatarFallback id={`ezcbyw_${index}`}>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            className="border-t border-gray-200 dark:border-gray-700 p-4"
          >
            {activeTab === "hotline" && (
              <div className="flex gap-4 mb-4">
                <div className="w-full sm:w-48">
                  <Select
                    value={selectedProperty}
                    onValueChange={setSelectedProperty}
                  >
                    <SelectTrigger>
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

                <div className="w-full sm:w-48">
                  <Select
                    value={selectedPerson}
                    onValueChange={setSelectedPerson}
                  >
                    <SelectTrigger>
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

                <div className="flex items-center gap-2">
                  <span
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Create job
                  </span>
                  <Switch
                    checked={createJob}
                    onCheckedChange={setCreateJob}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <div className="mr-2">
                <div className="flex space-x-1 h-10">
                  <Button
                    variant={mode === "chat" ? "default" : "outline"}
                    onClick={() => setMode("chat")}
                    className="px-3"
                  >
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    variant={mode === "voice" ? "default" : "outline"}
                    onClick={() => setMode("voice")}
                    className="px-3"
                  >
                    <VolumeIcon className="h-4 w-4 mr-2" />
                    Voice
                  </Button>
                </div>
              </div>

              {mode === "chat" ? (
                <>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />

                  <Button onClick={handleSend}>
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={toggleRecording}
                  size="lg"
                  className={`flex-1 ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
                >
                  <MicIcon className="h-5 w-5 mr-2" />
                  {isRecording ? "Recording..." : "Start Recording"}
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="p-6 flex justify-center">
          <Button
            onClick={() => setIsCollapsed(false)}
            className="bg-indigo-600 hover:bg-indigo-700"
            size="lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Start New Conversation
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          AI Assistant
        </h1>
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2"
        >
          {showHistory ? (
            <MessageSquareIcon className="h-4 w-4" />
          ) : (
            <HistoryIcon className="h-4 w-4" />
          )}

          {showHistory ? "Back to Chat" : "View History"}
        </Button>
      </div>

      <div
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden"
      >
        {showHistory ? (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Chat History
            </h2>
            <div className="space-y-3">
              {chatHistory.map((chat, index) => (
                <Card
                  key={chat.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => {
                    setActiveTab(chat.type === "hotline" ? "hotline" : "agent");
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
                            id={`x39fy2_${index}`}
                          />

                          {chat.date}
                        </div>
                      </div>
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        id={`40j7jq_${index}`}
                      >
                        {chat.preview}
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-2 ${chat.type === "hotline" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}`}
                        id={`4pxfyg_${index}`}
                      >
                        {chat.type === "hotline" ? "Hotline" : "Agent"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Tabs
            defaultValue="hotline"
            className="flex-1 flex flex-col"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <TabsList className="bg-transparent p-0">
                <TabsTrigger
                  value="hotline"
                  className={`px-6 py-3 ${activeTab === "hotline" ? "border-b-2 border-indigo-600 dark:border-indigo-400" : ""}`}
                >
                  Hotline
                </TabsTrigger>
                <TabsTrigger
                  value="agent"
                  className={`px-6 py-3 ${activeTab === "agent" ? "border-b-2 border-indigo-600 dark:border-indigo-400" : ""}`}
                >
                  Proptuna Agent
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="hotline"
              className="flex-1 flex flex-col p-0 m-0 outline-none"
            >
              {renderChatInterface(
                messages,
                inputMessage,
                setInputMessage,
                handleSendMessage,
                chatMode,
                setChatMode,
                isHotlineCollapsed,
                setIsHotlineCollapsed,
                messagesEndRef,
                messagesContainerRef,
              )}
            </TabsContent>

            <TabsContent
              value="agent"
              className="flex-1 flex flex-col p-0 m-0 outline-none"
            >
              {renderChatInterface(
                agentMessages,
                agentInputMessage,
                setAgentInputMessage,
                handleSendAgentMessage,
                agentChatMode,
                setAgentChatMode,
                isAgentCollapsed,
                setIsAgentCollapsed,
                agentMessagesEndRef,
                agentMessagesContainerRef,
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
