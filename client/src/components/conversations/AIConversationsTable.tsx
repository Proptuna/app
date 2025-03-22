import {
  MessageSquare,
  Search,
  AlertTriangle,
  Eye,
  X,
  Building,
  User,
  ChevronDown,
  Check,
  ArrowDownUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIConversation } from "@/types/conversations";

interface AIConversationsTableProps {
  conversations: AIConversation[];
  onConversationClick: (conversation: AIConversation) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onFilterToggle: () => void;
  showNeedsAttention: boolean;
  isLoading?: boolean;
}

export function AIConversationsTable({
  conversations,
  onConversationClick,
  onSearch,
  searchQuery,
  onFilterToggle,
  showNeedsAttention,
}: AIConversationsTableProps) {
  const getStatusBadge = (state: string) => {
    if (state.includes("Attention")) {
      return (
        <Badge className="bg-red-100 text-red-500 hover:bg-red-100 rounded-md px-2 py-1 text-xs font-medium flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Attention needed!
        </Badge>
      );
    } else if (state === "chat ended") {
      return (
        <Badge className="bg-green-100 text-green-600 hover:bg-green-100 rounded-md px-2 py-1 text-xs font-medium flex items-center gap-1">
          <Check className="h-3 w-3" /> Chat ended
        </Badge>
      );
    } else if (state === "Live chat") {
      return (
        <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-100 rounded-md px-2 py-1 text-xs font-medium flex items-center gap-1">
          <MessageSquare className="h-3 w-3" /> Live chat
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 rounded-md px-2 py-1 text-xs font-medium flex items-center gap-1">
          <Check className="h-3 w-3" /> {state}
        </Badge>
      );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Conversations</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search AI conversations..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 w-full sm:w-64 h-9 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                onClick={() => onSearch("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant={showNeedsAttention ? "default" : "outline"}
            onClick={onFilterToggle}
            className={`flex items-center gap-1.5 text-sm h-9 ${
              showNeedsAttention ? "bg-red-600 hover:bg-red-700 text-white" : ""
            }`}
            size="sm"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Needs Attention
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
              <th className="py-3 px-4 text-left font-medium flex items-center gap-2">
                Overview
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                  <ArrowDownUp className="h-3 w-3" />
                </Button>
              </th>
              <th className="py-3 px-4 text-left font-medium flex items-center gap-2">
                Status
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                  <ArrowDownUp className="h-3 w-3" />
                </Button>
              </th>
              <th className="py-3 px-4 text-left font-medium flex items-center gap-2">
                Property
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                  <ArrowDownUp className="h-3 w-3" />
                </Button>
              </th>
              <th className="py-3 px-4 text-left font-medium flex items-center gap-2">
                Person
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                  <ArrowDownUp className="h-3 w-3" />
                </Button>
              </th>
              <th className="py-3 px-4 text-left font-medium flex items-center gap-2">
                Date
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0 rotate-180">
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conversation) => (
              <tr
                key={conversation.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer"
                onClick={() => onConversationClick(conversation)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 pt-0.5">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <div className="font-medium">{conversation.overview}</div>
                  </div>
                </td>
                <td className="py-3 px-4">{getStatusBadge(conversation.state)}</td>
                <td className="py-3 px-4">
                  {conversation.property ? (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{conversation.property.address}{conversation.property.unit ? `, Unit ${conversation.property.unit}` : ''}</div>
                        <div className="text-xs text-gray-500">
                          {conversation.property.city}, {conversation.property.state} {conversation.property.zip}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {conversation.person ? (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{conversation.person.name}</div>
                        <div className="text-xs text-gray-500">{conversation.person.email}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </td>
                <td className="py-3 px-4">{formatDate(conversation.date)}</td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConversationClick(conversation);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="text-xs">View</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-1">No conversations found</h3>
            <p className="text-gray-500 max-w-md">
              {searchQuery
                ? "No conversations match your search criteria."
                : showNeedsAttention
                ? "There are no conversations that need attention right now."
                : "There are no AI conversations to display."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
