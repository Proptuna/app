import { useState, useEffect } from "react";
import { AIConversationDetail } from "./AIConversationDetail";
import { AIConversationsDataTable } from "./AIConversationsDataTable";
import { RefreshCw } from "lucide-react";
import { AIConversation } from "@/types/conversations";
import { PageLayout } from "@/components/layout/PageLayout";

// Mock data - Moved in from original implementation
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
    messages: [
      {
        role: "user",
        content: "Hello, I'm having a water leak in my bathroom ceiling.",
        timestamp: "2023-06-15T09:30:00Z"
      },
      {
        role: "assistant",
        content: "I'm sorry to hear that. Can you please provide more details about the leak?",
        timestamp: "2023-06-15T09:31:00Z"
      }
    ],
    tasks: [
      {
        id: "101",
        title: "Inspect water leak",
        description: "Inspect the bathroom ceiling for water leak source",
        status: "pending",
        assignee: "Maintenance Team",
        dueDate: "2023-06-16",
        created: "2023-06-15",
        createdBy: "System",
        notified: ["maintenance@example.com"],
        photos: []
      }
    ],
    documents: [],
  },
  {
    id: "2",
    state: "task created",
    overview: "Request for maintenance - broken dishwasher",
    date: "2023-06-11",
    property: {
      address: "789 Pine Street",
      unit: "3A",
      city: "San Francisco",
      state: "CA",
      zip: "94108",
      type: "Apartment",
      image: "https://images.unsplash.com/photo-1493809842364-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    person: {
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "(415) 555-5678",
    },
    messages: [
      {
        role: "user",
        content: "My dishwasher is not working. It's making a strange noise and not draining properly.",
        timestamp: "2023-06-11T14:20:00Z"
      },
      {
        role: "assistant",
        content: "I understand your dishwasher isn't working properly. I'll create a maintenance task for this issue.",
        timestamp: "2023-06-11T14:22:00Z"
      }
    ],
    tasks: [
      {
        id: "102",
        title: "Repair dishwasher",
        description: "Dishwasher is making noise and not draining properly",
        status: "scheduled",
        assignee: "Maintenance Team",
        dueDate: "2023-06-13",
        created: "2023-06-11",
        createdBy: "AI Assistant",
        notified: ["maintenance@example.com", "manager@example.com"],
        photos: []
      }
    ],
    documents: [],
  },
  {
    id: "3",
    state: "chat ended",
    overview: "Rent payment confirmation",
    date: "2023-06-09",
    property: {
      address: "456 Oak Avenue",
      unit: "12",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      type: "Condo",
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    person: {
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "(415) 555-9012",
    },
    messages: [
      {
        role: "user",
        content: "Can you confirm if my rent payment for this month has been received?",
        timestamp: "2023-06-09T10:15:00Z"
      },
      {
        role: "assistant",
        content: "Yes, I can confirm that your rent payment of $2,500 was received on June 5th. Thank you for your prompt payment.",
        timestamp: "2023-06-09T10:16:00Z"
      }
    ],
    tasks: [],
    documents: [
      {
        id: "201",
        title: "Rent Receipt - June 2023",
        type: "PDF",
        url: "/documents/rent-receipt-june-2023.pdf",
        size: "245 KB",
        createdAt: "2023-06-09"
      }
    ],
  },
  {
    id: "4",
    state: "Live chat",
    overview: "Question about parking space",
    date: "2023-06-08",
    property: {
      address: "123 Main St",
      unit: "2C",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      type: "Apartment",
      image: "https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    person: {
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "(415) 555-6789",
    },
    messages: [
      {
        role: "user",
        content: "Hi, I'm wondering if there are any available parking spaces for rent in the building?",
        timestamp: "2023-06-08T15:45:00Z"
      },
      {
        role: "assistant",
        content: "Hello David, let me check the availability of parking spaces for you. Currently, we have 2 spaces available for rent at $150 per month. Would you like me to reserve one for you?",
        timestamp: "2023-06-08T15:47:00Z"
      }
    ],
    tasks: [],
    documents: [],
  },
  {
    id: "5",
    state: "Attention needed!",
    overview: "Noise complaint from neighbor",
    date: "2023-06-07",
    property: {
      address: "456 Oak Avenue",
      unit: "7A",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      type: "Apartment",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    person: {
      name: "Emily Chen",
      email: "emily.chen@example.com",
      phone: "(415) 555-4321",
    },
    messages: [
      {
        role: "user",
        content: "The tenant above me is making excessive noise late at night.",
        timestamp: "2023-06-07T22:30:00Z"
      },
      {
        role: "assistant",
        content: "I'm sorry to hear about the noise disturbance. Could you provide more details about when the noise typically occurs and what kind of noise it is?",
        timestamp: "2023-06-07T22:32:00Z"
      }
    ],
    tasks: [
      {
        id: "103",
        title: "Investigate noise complaint",
        description: "Excessive noise reported from unit 8B above Emily Chen's apartment",
        status: "pending",
        assignee: "Property Manager",
        dueDate: "2023-06-08",
        created: "2023-06-07",
        createdBy: "System",
        notified: ["manager@example.com"],
        photos: []
      }
    ],
    documents: [],
  },
];

export function AIConversationsPage() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<AIConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNeedsAttention, setShowNeedsAttention] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterToggle = () => {
    setShowNeedsAttention(!showNeedsAttention);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refreshing data
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);
  };

  // Filter conversations based on search query and filter
  const filteredConversations = conversations
    .filter((conversation) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          conversation.overview.toLowerCase().includes(query) ||
          conversation.state.toLowerCase().includes(query) ||
          conversation.property?.address.toLowerCase().includes(query) ||
          conversation.person?.name.toLowerCase().includes(query) ||
          conversation.property?.city.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((conversation) => {
      // Apply needs attention filter
      if (showNeedsAttention) {
        return conversation.state.includes("Attention");
      }
      return true;
    });

  return (
    <PageLayout
      title="AI Conversations"
      subtitle="View and manage all AI-assisted conversations with tenants and owners"
      actions={
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      }
    >
      <div className="h-full flex flex-col">
        {selectedConversation ? (
          <AIConversationDetail
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
          />
        ) : (
          <AIConversationsDataTable
            conversations={filteredConversations}
            onConversationClick={(conversation) => setSelectedConversation(conversation)}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onFilterToggle={handleFilterToggle}
            showNeedsAttention={showNeedsAttention}
            isLoading={loading}
          />
        )}
      </div>
    </PageLayout>
  );
}
