"use client"

import React, { useState, useEffect } from "react";
import { AIConversationDetail } from "(components)/ai-conversation-detail";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import AIConversationsAgGrid from "(components)/ai-conversations-ag-grid";

// Define interfaces for the data model
// These interfaces represent the structure of the data used throughout the application
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

interface Conversation {
  sender: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

interface Task {
  id: string;
  description: string;
  status: string;
  created: string;
  createdBy: string;
  notified: string[];
  photos?: string[];
}

interface Document {
  title: string;
  type: string;
  icon?: React.ReactNode;
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

export default function AIConversationsPage() {
  const [conversationsData, setConversationsData] = useState<AIConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<AIConversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showNeedsAttention, setShowNeedsAttention] = useState<boolean>(false);

  useEffect(() => {
    // Simulating API call to fetch AI conversations
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setConversationsData(mockConversations);
      } catch (error) {
        console.error("Error fetching AI conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (conversation: AIConversation) => {
    console.log('handleConversationClick called with:', conversation);
    setSelectedConversation(conversation);
    console.log('selectedConversation set to:', conversation);
  };

  const handleCloseDetail = () => {
    console.log('handleCloseDetail called');
    setSelectedConversation(null);
    console.log('selectedConversation set to null');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterToggle = () => {
    setShowNeedsAttention(!showNeedsAttention);
  };

  const filteredConversations = showNeedsAttention
    ? conversationsData.filter((conversation) => conversation.state === "Attention needed!")
    : conversationsData;

  const searchedConversations = searchQuery
    ? filteredConversations.filter(
        (conversation) =>
          conversation.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conversation.property?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conversation.person?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredConversations;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Conversations Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all AI conversations with tenants and property managers
          </p>
        </div>
        {/* Removed "New Conversation" button as these are AI-generated */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCwIcon className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <div className={`transition-all duration-300 ${selectedConversation ? 'translate-x-[-100%]' : 'translate-x-0'}`}>
              <AIConversationsAgGrid
                conversations={searchedConversations}
                onConversationClick={handleConversationClick}
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onFilterToggle={handleFilterToggle}
                showNeedsAttention={showNeedsAttention}
                isLoading={loading}
              />
            </div>
            
            <div className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${selectedConversation ? 'translate-x-0' : 'translate-x-[100%]'}`}>
              {selectedConversation && (
                <AIConversationDetail
                  conversation={selectedConversation}
                  onClose={handleCloseDetail}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mock data
const mockConversations: AIConversation[] = [
  {
    id: "1",
    state: "Attention needed!",
    overview: "Water leak in bathroom ceiling",
    date: "2023-06-15",
    property: {
      address: "123 Main St",
      unit: "4B",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      type: "Apartment",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    person: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(415) 555-1234",
    },
    conversation: [
      {
        sender: "Jane Smith",
        message: "Hi, I have a water leak in my bathroom ceiling. It's getting worse and there's a large wet spot forming.",
        timestamp: "June 15, 2023 10:23 AM",
      },
      {
        sender: "AI Assistant",
        message: "I'm sorry to hear about the leak. Can you provide more details about where exactly it's located and how long it's been happening?",
        timestamp: "June 15, 2023 10:24 AM",
      },
      {
        sender: "Jane Smith",
        message: "It's right above the shower. I first noticed it yesterday but it's gotten bigger overnight.",
        timestamp: "June 15, 2023 10:26 AM",
      },
      {
        sender: "AI Assistant",
        message: "Thank you for that information. This sounds like it needs immediate attention. I'll create a maintenance request right away. Can you send a photo of the leak?",
        timestamp: "June 15, 2023 10:27 AM",
      },
      {
        sender: "Jane Smith",
        message: "Here's a photo of the ceiling.",
        timestamp: "June 15, 2023 10:30 AM",
      },
      {
        sender: "AI Assistant",
        message: "I've created an urgent maintenance request. A plumber will contact you today to schedule a visit. Is there a good time for them to come?",
        timestamp: "June 15, 2023 10:32 AM",
      },
      {
        sender: "Jane Smith",
        message: "I'll be home after 3pm today.",
        timestamp: "June 15, 2023 10:33 AM",
      },
      {
        sender: "AI Assistant",
        message: "Perfect. I've noted that you're available after 3pm. The property manager has been notified as well. Is there anything else you need help with?",
        timestamp: "June 15, 2023 10:34 AM",
      },
    ],
    tasks: [
      {
        id: "task1",
        description: "Fix water leak in bathroom ceiling of unit 4B",
        status: "open",
        created: "June 15, 2023",
        createdBy: "AI Assistant",
        notified: ["John Doe (Property Manager)", "Plumbing Services Inc."],
        photos: [
          "https://images.unsplash.com/photo-1562886877-3a85b2c8d3c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2F0ZXIlMjBkYW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        ],
      },
    ],
    documents: [
      {
        title: "Maintenance Request #1234",
        type: "PDF Document",
      },
      {
        title: "Apartment 4B Lease Agreement",
        type: "Legal Document",
      },
    ],
    needsAttention: true,
    suggestedAction: "Schedule emergency plumbing inspection for unit 4B",
  },
  {
    id: "2",
    state: "chat ended",
    overview: "Rent payment confirmation",
    date: "2023-06-10",
    property: {
      address: "456 Oak Avenue",
      unit: "12",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      type: "Apartment",
    },
    person: {
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "(415) 555-5678",
    },
    conversation: [
      {
        sender: "Michael Johnson",
        message: "Hi, I just wanted to confirm that my rent payment for this month went through.",
        timestamp: "June 10, 2023 9:15 AM",
      },
      {
        sender: "AI Assistant",
        message: "Good morning Michael! Let me check that for you right away.",
        timestamp: "June 10, 2023 9:16 AM",
      },
      {
        sender: "AI Assistant",
        message: "I can confirm that your payment of $2,450 was received on June 5th. It has been processed successfully and your account is current. Would you like a receipt sent to your email?",
        timestamp: "June 10, 2023 9:17 AM",
      },
      {
        sender: "Michael Johnson",
        message: "Yes, please send me the receipt. Thank you!",
        timestamp: "June 10, 2023 9:19 AM",
      },
      {
        sender: "AI Assistant",
        message: "I've sent the receipt to michael.johnson@example.com. Is there anything else you need help with today?",
        timestamp: "June 10, 2023 9:20 AM",
      },
      {
        sender: "Michael Johnson",
        message: "That's all, thanks for your help!",
        timestamp: "June 10, 2023 9:21 AM",
      },
      {
        sender: "AI Assistant",
        message: "You're welcome! Feel free to reach out if you need anything else. Have a great day!",
        timestamp: "June 10, 2023 9:22 AM",
      },
    ],
    documents: [
      {
        title: "June 2023 Rent Receipt",
        type: "PDF Document",
      },
    ],
  },
  {
    id: "3",
    state: "task created",
    overview: "Request for maintenance - broken dishwasher",
    date: "2023-06-12",
    property: {
      address: "789 Pine Street",
      unit: "3A",
      city: "San Francisco",
      state: "CA",
      zip: "94108",
      type: "Apartment",
    },
    person: {
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "(415) 555-9012",
    },
    conversation: [
      {
        sender: "Sarah Williams",
        message: "Hello, my dishwasher isn't working properly. It's not draining water after the cycle completes.",
        timestamp: "June 12, 2023 2:45 PM",
      },
      {
        sender: "AI Assistant",
        message: "I'm sorry to hear about your dishwasher issue. Can you tell me when you first noticed the problem?",
        timestamp: "June 12, 2023 2:46 PM",
      },
      {
        sender: "Sarah Williams",
        message: "I first noticed it yesterday. I ran it last night and this morning there was still standing water inside.",
        timestamp: "June 12, 2023 2:48 PM",
      },
      {
        sender: "AI Assistant",
        message: "Thank you for that information. Have you tried anything to fix it yourself, like checking if there's any visible blockage?",
        timestamp: "June 12, 2023 2:49 PM",
      },
      {
        sender: "Sarah Williams",
        message: "I checked the filter at the bottom and cleaned it out, but it didn't help.",
        timestamp: "June 12, 2023 2:51 PM",
      },
      {
        sender: "AI Assistant",
        message: "I appreciate you trying that troubleshooting step. I'll create a maintenance request to have someone come take a look at your dishwasher. What are some good times for a maintenance visit in the next few days?",
        timestamp: "June 12, 2023 2:53 PM",
      },
      {
        sender: "Sarah Williams",
        message: "I work from home, so any weekday between 9am and 5pm works for me.",
        timestamp: "June 12, 2023 2:55 PM",
      },
      {
        sender: "AI Assistant",
        message: "Perfect! I've created a maintenance request for your dishwasher repair. The maintenance team will contact you to confirm a specific time, but I've noted your availability as weekdays 9am-5pm. The request number is #5678 for your reference.",
        timestamp: "June 12, 2023 2:57 PM",
      },
    ],
    tasks: [
      {
        id: "task2",
        description: "Repair dishwasher in unit 3A - not draining properly",
        status: "open",
        created: "June 12, 2023",
        createdBy: "AI Assistant",
        notified: ["John Doe (Property Manager)", "Appliance Repair Team"],
      },
    ],
  },
];
