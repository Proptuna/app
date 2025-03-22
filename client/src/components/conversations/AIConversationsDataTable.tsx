"use client"

import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AIConversation } from "@/types/conversations";
import { 
  MessageSquareIcon, 
  EyeIcon, 
  AlertCircle, 
  CheckCircle, 
  ClockIcon, 
  BellIcon, 
  AlertTriangleIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AIConversationsDataTableProps {
  conversations: AIConversation[];
  onConversationClick: (conversation: AIConversation) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onFilterToggle: () => void;
  showNeedsAttention: boolean;
  isLoading: boolean;
}

export function AIConversationsDataTable({
  conversations,
  onConversationClick,
  onSearch,
  searchQuery,
  onFilterToggle,
  showNeedsAttention,
  isLoading
}: AIConversationsDataTableProps) {
  
  // Status cell renderer
  const statusCellRenderer = (params: ICellRendererParams) => {
    const status = params.value as string;
    
    let icon;
    let color;
    
    if (status.toLowerCase().includes("attention")) {
      icon = <AlertCircle className="h-4 w-4 mr-1" />;
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    } else if (status.toLowerCase().includes("live")) {
      icon = <ClockIcon className="h-4 w-4 mr-1" />;
      color = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    } else if (status.toLowerCase().includes("task")) {
      icon = <CheckCircle className="h-4 w-4 mr-1" />;
      color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (status.toLowerCase().includes("ended")) {
      icon = <MessageSquareIcon className="h-4 w-4 mr-1" />;
      color = "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    } else {
      icon = <BellIcon className="h-4 w-4 mr-1" />;
      color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
    
    return (
      <Badge variant="outline" className={`flex items-center ${color} border-0 font-medium px-2 py-1`}>
        {icon}
        {status}
      </Badge>
    );
  };
  
  // Property cell renderer
  const propertyCellRenderer = (params: ICellRendererParams) => {
    const property = params.data.property;
    if (!property) return null;
    
    return (
      <div className="flex items-center">
        {property.image ? (
          <img 
            src={property.image} 
            alt={property.address}
            className="w-10 h-10 rounded-md object-cover mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
            <AlertTriangleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{property.address}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {property.unit ? `Unit ${property.unit}, ` : ''}{property.city}, {property.state}
          </div>
        </div>
      </div>
    );
  };
  
  // Person cell renderer
  const personCellRenderer = (params: ICellRendererParams) => {
    const person = params.data.person;
    if (!person) return null;
    
    return (
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            {person.name.split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{person.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{person.email}</div>
        </div>
      </div>
    );
  };
  
  // Actions cell renderer
  const actionsCellRenderer = (params: ICellRendererParams) => {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onConversationClick(params.data)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <EyeIcon className="h-5 w-5" />
      </Button>
    );
  };
  
  // Column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: "Status",
      field: "state",
      cellRenderer: statusCellRenderer,
      width: 160,
      filter: true,
    },
    {
      headerName: "Overview",
      field: "overview",
      flex: 1,
      minWidth: 200,
      filter: true,
    },
    {
      headerName: "Date",
      field: "date",
      width: 120,
      filter: true,
      sort: 'desc',
    },
    {
      headerName: "Property",
      field: "property",
      cellRenderer: propertyCellRenderer,
      width: 250,
      filter: true,
    },
    {
      headerName: "Person",
      field: "person",
      cellRenderer: personCellRenderer,
      width: 250,
      filter: true,
    },
    {
      headerName: "Actions",
      field: "id",
      cellRenderer: actionsCellRenderer,
      width: 100,
      filter: false,
      sortable: false,
    },
  ], [onConversationClick]);
  
  // Filter toggle button
  const headerContent = (
    <Button
      variant={showNeedsAttention ? "default" : "outline"}
      size="sm"
      onClick={onFilterToggle}
      className="flex items-center gap-1"
    >
      <AlertCircle className="h-4 w-4" />
      <span>Needs Attention</span>
    </Button>
  );
  
  return (
    <DataTable
      data={conversations}
      columnDefs={columnDefs}
      onSearch={onSearch}
      searchPlaceholder="Search conversations..."
      searchQuery={searchQuery}
      isLoading={isLoading}
      headerContent={headerContent}
      rowHeight={70}
      headerHeight={56}
      className="h-full w-full"
    />
  );
}
