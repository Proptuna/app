import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sendMessageToAI } from "@/lib/llm-client";
import { Message, ToolUse, DocumentReference } from "@/types/llm";
import { marked } from "marked";
import { 
  SendIcon, 
  SlidersIcon, 
  MessageSquareIcon, 
  VolumeIcon, 
  MicIcon, 
  AlertCircleIcon,
  History as HistoryIcon
} from "lucide-react";
import { PageLayout } from "@/components/layout";

// Mock data for the demo
const properties = [
  { id: "prop1", address: "123 Main St, Apt 4B" },
  { id: "prop2", address: "456 Oak Ave, Suite 7" },
  { id: "prop3", address: "789 Pine Ln, Unit 12" }
];

const people = [
  { id: "person1", name: "John Doe" },
  { id: "person2", name: "Jane Smith" },
  { id: "person3", name: "Bob Johnson" }
];

// Format message content with markdown
const formatMessageContent = (content: string): string => {
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return content;
  }
};

// Format timestamp to a more readable format
const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return "";
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return "";
  }
};

export function AIPage() {
  // State for messages
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm the Proptuna AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  
  // State for user input
  const [inputMessage, setInputMessage] = useState("");
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // State for error message
  const [error, setError] = useState<string | null>(null);
  
  // Options drawer state
  const [showHistory, setShowHistory] = useState(false);
  
  // Chat mode state
  const [chatMode, setChatMode] = useState<"chat" | "voice">("chat");
  
  // Recording state for voice mode
  const [isRecording, setIsRecording] = useState(false);
  
  // Filter states
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedPerson, setSelectedPerson] = useState("all");
  const [createTask, setCreateTask] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    // Update messages state
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input field
    setInputMessage("");
    
    // Set loading state
    setIsLoading(true);
    setError(null);
    
    try {
      // Send message to AI
      const response = await sendMessageToAI([...messages, userMessage], {
        property: selectedProperty !== "all" ? selectedProperty : undefined,
        person: selectedPerson !== "all" ? selectedPerson : undefined,
        createTask,
      });
      
      // Add AI response to messages
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Toggle voice recording (mock implementation)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // If turning on recording, simulate voice detection after a few seconds
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("This is a simulated voice message");
      }, 3000);
    }
  };
  
  // Render tool use indicator (for completed tasks)
  const renderToolUseIndicator = (toolUse: ToolUse) => {
    if (!toolUse || toolUse.status !== "completed") return null;
    
    let toolContent;
    let badgeColor = "default";
    
    switch (toolUse.name) {
      case "createMaintenanceTask":
        toolContent = "Maintenance task created";
        badgeColor = "secondary";
        break;
      case "createFollowUp":
        toolContent = "Follow-up request created";
        badgeColor = "default";
        break;
      case "searchDocuments":
        toolContent = "Documents searched";
        badgeColor = "default";
        break;
      default:
        toolContent = `${toolUse.name} completed`;
    }
    
    return (
      <div className="mt-1">
        <Badge variant={badgeColor as any} className="text-xs">
          {toolContent}
        </Badge>
      </div>
    );
  };
  
  // Render document reference (for documents mentioned by AI)
  const renderDocumentReference = (doc: DocumentReference) => {
    if (!doc) return null;
    
    return (
      <div className="mt-2 p-2 border rounded bg-gray-50 dark:bg-gray-800/50 text-sm">
        <div className="font-medium">{doc.title}</div>
        <div className="text-xs text-gray-500">Document: {doc.type}</div>
        {doc.url && (
          <a 
            href={doc.url} 
            className="text-xs text-blue-500 hover:underline mt-1 block"
            target="_blank" 
            rel="noopener noreferrer"
          >
            View document
          </a>
        )}
      </div>
    );
  };

  return (
    <PageLayout
      title="AI Assistant"
      subtitle="Ask questions about your properties, tenants, and more"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1"
          >
            <HistoryIcon className="h-4 w-4" />
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>
      }
      contentClassName="flex flex-col flex-1"
    >
      {/* Chat History */}
      {showHistory && (
        <div className="mb-4 border rounded-lg p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Chat History</h2>
          <div className="space-y-2">
            {/* Mock chat history items */}
            {[
              { id: 1, title: "Heating system troubleshooting", date: "Today, 2:30 PM" },
              { id: 2, title: "Rental application process", date: "Yesterday, 10:15 AM" },
              { id: 3, title: "Maintenance request follow-up", date: "Mar 19, 4:45 PM" }
            ].map((chat) => (
              <div 
                key={chat.id} 
                className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                onClick={() => {
                  // In a real implementation, this would load the selected chat
                  console.log(`Loading chat ${chat.id}`);
                }}
              >
                <div className="flex items-center">
                  <MessageSquareIcon className="h-4 w-4 mr-2 text-indigo-600" />
                  <span>{chat.title}</span>
                </div>
                <span className="text-xs text-gray-500">{chat.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Card className="flex-1 flex flex-col overflow-hidden border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm rounded-lg">
        <CardContent className="flex-1 overflow-y-auto p-0 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-9 w-9 bg-amber-100">
                      <AvatarFallback className="text-amber-600">AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col">
                    <div>
                      {(message.content && (
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
                      ))}
                      
                      {/* Show tool use indicator after content */}
                      {(message.toolUse && message.role === "assistant") && renderToolUseIndicator(message.toolUse)}
                      
                      {/* Show document reference if present */}
                      {(message.documentReference && message.role === "assistant") && renderDocumentReference(message.documentReference)}
                      
                      <div className={`text-xs mt-1 text-gray-500 ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
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
          {/* Options drawer */}
          <div className={`transition-all duration-300 ease-in-out ${showHistory ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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
                      onClick={() => setShowHistory(!showHistory)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      type="button"
                    >
                      <SlidersIcon className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
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
                <div className="flex justify-center w-full">
                  <Button
                    onClick={toggleRecording}
                    className={`rounded-full w-12 h-12 flex items-center justify-center ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                    disabled={isLoading}
                  >
                    <MicIcon className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}
