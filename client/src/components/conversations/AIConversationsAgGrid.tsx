"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import {
  MessageSquareIcon,
  EyeIcon,
  BuildingIcon,
  UserIcon,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  ClockIcon,
  BellIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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

interface AIConversation {
  id: string;
  state: string;
  overview: string;
  date: string;
  property?: Property;
  person?: Contact;
  conversation?: any[];
  tasks?: any[];
  documents?: any[];
  isLive?: boolean;
  needsAttention?: boolean;
  suggestedAction?: string;
}

interface AIConversationsAgGridProps {
  conversations: AIConversation[];
  onConversationClick: (conversation: AIConversation) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onFilterToggle: () => void;
  showNeedsAttention: boolean;
  isLoading?: boolean;
}

// State Badge Cell Renderer
const StateBadgeRenderer = (params: ICellRendererParams) => {
  const state = params.value;
  
  switch (state) {
    case "Attention needed!":
      return (
        <Badge variant="outline" className="flex items-center px-3 py-1 text-xs font-medium text-red-500 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertTriangleIcon className="h-3 w-3 mr-1.5 text-red-500" />
          <span>Attention needed!</span>
        </Badge>
      );
    case "in progress":
      return (
        <Badge variant="secondary" className="flex items-center px-3 py-1 text-xs font-medium">
          <ClockIcon className="h-3 w-3 mr-1.5" />
          <span>In progress</span>
        </Badge>
      );
    case "task created":
      return (
        <Badge variant="outline" className="flex items-center px-3 py-1 text-xs font-medium border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          <CheckCircle className="h-3 w-3 mr-1.5 text-green-500" />
          <span>Task created</span>
        </Badge>
      );
    case "chat ended":
      return (
        <Badge variant="outline" className="flex items-center px-3 py-1 text-xs font-medium border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
          <MessageSquareIcon className="h-3 w-3 mr-1.5" />
          <span>Chat ended</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
          {state}
        </Badge>
      );
  }
};

// Overview Cell Renderer
const OverviewRenderer = (params: ICellRendererParams) => {
  return (
    <div className="flex items-center py-1.5">
      <MessageSquareIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2.5 flex-shrink-0" />
      <span className="font-medium text-gray-900 dark:text-gray-100">{params.value}</span>
    </div>
  );
};

// Property Cell Renderer
const PropertyRenderer = (params: ICellRendererParams) => {
  const property = params.value;
  if (!property) return <span className="text-gray-400">-</span>;
  
  return (
    <div className="flex items-center py-1.5">
      <BuildingIcon className="h-4 w-4 text-gray-500 mr-2.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{property.address}{property.unit ? `, Unit ${property.unit}` : ''}</div>
        <div className="text-xs text-gray-500 mt-0.5">{property.city}, {property.state} {property.zip}</div>
      </div>
    </div>
  );
};

// Person Cell Renderer
const PersonRenderer = (params: ICellRendererParams) => {
  const person = params.value;
  if (!person) return <span className="text-gray-400">-</span>;
  
  return (
    <div className="flex items-center py-1.5">
      <UserIcon className="h-4 w-4 text-gray-500 mr-2.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{person.name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{person.email}</div>
      </div>
    </div>
  );
};

// Date Formatter
const formatDate = (params: ICellRendererParams) => {
  const date = params.value;
  if (!date) return "";
  
  // Format date to a more readable format
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return <span className="text-gray-700 dark:text-gray-300">{formattedDate}</span>;
};

// View Action Cell Renderer
const ViewActionRenderer = (params: ICellRendererParams) => {
  const { onConversationClick } = params.context || {};
  
  return (
    <div className="flex justify-center items-center w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          
          if (onConversationClick && params.data) {
            onConversationClick(params.data);
          }
        }}
        className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        title="View details"
      >
        <EyeIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </Button>
    </div>
  );
};

export default function AIConversationsAgGrid({ 
  conversations, 
  onConversationClick,
  onSearch,
  searchQuery,
  onFilterToggle,
  showNeedsAttention,
  isLoading = false
}: AIConversationsAgGridProps) {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);
  const [quickFilterText, setQuickFilterText] = useState(searchQuery);
  const [filteredConversations, setFilteredConversations] = useState<AIConversation[]>(conversations);
  
  useEffect(() => {
    setFilteredConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    setQuickFilterText(searchQuery);
  }, [searchQuery]);

  // Filter conversations based on search text
  useEffect(() => {
    if (!quickFilterText.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    
    const searchTerm = quickFilterText.toLowerCase().trim();
    const filtered = conversations.filter(conversation => {
      // Search in overview
      if (conversation.overview.toLowerCase().includes(searchTerm)) return true;
      
      // Search in state
      if (conversation.state.toLowerCase().includes(searchTerm)) return true;
      
      // Search in property address
      if (conversation.property?.address.toLowerCase().includes(searchTerm)) return true;
      
      // Search in person name
      if (conversation.person?.name.toLowerCase().includes(searchTerm)) return true;
      
      return false;
    });
    
    setFilteredConversations(filtered);
  }, [conversations, quickFilterText]);
  
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    // In newer versions of AG Grid, columnApi is accessed as a property of the api
    setGridColumnApi((params as any).columnApi);
    
    // Auto-size columns to fit the available width
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 0);

    // Set default sorting by date (newest first)
    const columnApi = (params as any).columnApi;
    if (columnApi) {
      columnApi.applyColumnState({
        state: [
          {
            colId: 'date',
            sort: 'desc'
          }
        ]
      });
    }
  }, []);

  // Show loading overlay when loading
  useEffect(() => {
    if (gridApi) {
      if (isLoading) {
        gridApi.showLoadingOverlay();
      } else if (filteredConversations.length === 0 && quickFilterText) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, isLoading, filteredConversations.length, quickFilterText]);

  // Handle quick filter text change
  const onFilterTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuickFilterText(value);
    onSearch(value);
  }, [onSearch]);

  // Handle window resize to adjust grid size
  useEffect(() => {
    if (!gridApi) return;
    
    const handleResize = () => {
      if (gridApi) {
        setTimeout(() => {
          gridApi.sizeColumnsToFit();
        }, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gridApi]);

  const columnDefs: ColDef[] = [
    {
      headerName: "Overview",
      field: "overview",
      cellRenderer: OverviewRenderer,
      sortable: true,
      filter: true,
      flex: 2,
      minWidth: 200,
      filterParams: {
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains'
      },
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Status",
      field: "state",
      cellRenderer: StateBadgeRenderer,
      sortable: true,
      filter: true,
      width: 150,
      filterParams: {
        filterOptions: ['equals'],
        defaultOption: 'equals'
      },
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Property",
      field: "property",
      cellRenderer: PropertyRenderer,
      sortable: false,
      filter: false,
      flex: 1.5,
      minWidth: 180,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Person",
      field: "person",
      cellRenderer: PersonRenderer,
      sortable: false,
      filter: false,
      flex: 1.5,
      minWidth: 180,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Date",
      field: "date",
      cellRenderer: formatDate,
      sortable: true,
      filter: true,
      width: 120,
      sort: 'desc',
      filterParams: {
        filterOptions: ['equals', 'greaterThan', 'lessThan'],
        defaultOption: 'greaterThan'
      },
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: ViewActionRenderer,
      sortable: false,
      filter: false,
      width: 70,
      pinned: "right",
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
  ];
  
  // Default column definitions
  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressMovable: false,
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    }
  }), []);
  
  // No rows overlay component
  const noRowsOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No conversations found</div>
        <div className="text-gray-500 text-center">
          {quickFilterText ? 
            "Try adjusting your search query" : 
            "No AI conversations are available at this time"}
        </div>
      </div>
    );
  }, [quickFilterText]);
  
  // Loading overlay component
  const loadingOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <div className="text-gray-500 mt-4">Loading conversations...</div>
      </div>
    );
  }, []);
  
  // Context for the grid
  const context = useMemo(() => {
    return {
      onConversationClick
    };
  }, [onConversationClick]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search AI conversations..."
            value={quickFilterText}
            onChange={onFilterTextChange}
            className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
          {quickFilterText && (
            <button
              onClick={() => {
                setQuickFilterText("");
                onSearch("");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={showNeedsAttention ? "default" : "outline"}
          onClick={onFilterToggle}
          className="ml-3 whitespace-nowrap"
          size="sm"
        >
          <BellIcon className="h-4 w-4 mr-2" />
          {showNeedsAttention ? "All Conversations" : "Needs Attention"}
        </Button>
      </div>
      <div className="h-[600px] ag-theme-custom"
        style={{
          height: '600px',
          width: '100%'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .ag-theme-custom {
            --ag-header-height: 50px;
            --ag-header-foreground-color: #374151;
            --ag-header-background-color: #ffffff;
            --ag-header-cell-hover-background-color: #f9fafb;
            --ag-header-cell-moving-background-color: #f3f4f6;
            --ag-background-color: #ffffff;
            --ag-row-hover-color: #f9fafb;
            --ag-selected-row-background-color: rgba(59, 130, 246, 0.1);
            --ag-font-size: 14px;
            --ag-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            --ag-grid-size: 6px;
            --ag-list-item-height: 30px;
            --ag-cell-horizontal-padding: 12px;
            --ag-borders: none;
            --ag-border-color: transparent;
            --ag-secondary-border-color: #e5e7eb;
            --ag-row-border-color: #f3f4f6;
            --ag-cell-horizontal-border: none;
            --ag-range-selection-border-color: rgba(59, 130, 246, 0.5);
            --ag-range-selection-background-color: rgba(59, 130, 246, 0.1);
            
            /* Icon colors */
            --ag-icon-color: #6b7280;
            --ag-icon-size: 16px;
            --ag-icon-font-family: agGridAlpine;
            
            /* Menu styles */
            --ag-popup-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            --ag-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            --ag-card-radius: 6px;
            --ag-menu-min-width: 200px;
            --ag-menu-background-color: #ffffff;
          }
          
          .ag-theme-custom.dark {
            --ag-header-foreground-color: #e5e7eb;
            --ag-header-background-color: #1f2937;
            --ag-header-cell-hover-background-color: #374151;
            --ag-header-cell-moving-background-color: #374151;
            --ag-background-color: #1f2937;
            --ag-foreground-color: #e5e7eb;
            --ag-row-hover-color: #111827;
            --ag-selected-row-background-color: rgba(59, 130, 246, 0.2);
            --ag-border-color: transparent;
            --ag-secondary-border-color: #374151;
            --ag-row-border-color: #374151;
            
            /* Dark mode icon colors */
            --ag-icon-color: #9ca3af;
            
            /* Dark mode menu styles */
            --ag-menu-background-color: #1f2937;
          }
          
          .ag-theme-custom .ag-header {
            font-weight: 600;
            border-bottom: 1px solid var(--ag-secondary-border-color);
          }
          
          .ag-theme-custom .ag-row {
            border-bottom-style: solid;
            border-bottom-width: 1px;
            border-bottom-color: var(--ag-row-border-color);
          }
          
          .ag-theme-custom .ag-row-hover {
            background-color: var(--ag-row-hover-color);
          }
          
          .ag-theme-custom .ag-header-cell-padded,
          .ag-theme-custom .ag-cell-padded {
            padding-left: 16px;
            padding-right: 16px;
          }
          
          .ag-theme-custom .ag-cell {
            display: flex;
            align-items: center;
          }
          
          /* Fix for header icons */
          .ag-theme-custom .ag-header-cell-menu-button {
            opacity: 0.5;
          }
          
          .ag-theme-custom .ag-header-cell-menu-button:hover {
            opacity: 1;
          }
          
          .ag-theme-custom .ag-header-cell-menu-button .ag-icon {
            color: var(--ag-icon-color);
          }
          
          /* Fix for sort icons */
          .ag-theme-custom .ag-header-icon {
            color: var(--ag-icon-color);
          }
          
          .ag-theme-custom .ag-sort-ascending-icon,
          .ag-theme-custom .ag-sort-descending-icon {
            color: var(--ag-icon-color);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Fix for filter icons */
          .ag-theme-custom .ag-header-cell-label {
            display: flex;
            align-items: center;
          }
          
          .ag-theme-custom .ag-header-cell-label .ag-header-cell-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          /* Fix for pagination controls */
          .ag-theme-custom .ag-paging-panel {
            color: var(--ag-foreground-color);
            height: 48px;
            padding: 0 16px;
            border-top: 1px solid var(--ag-secondary-border-color);
          }
          
          .ag-theme-custom .ag-paging-button {
            cursor: pointer;
            opacity: 0.7;
          }
          
          .ag-theme-custom .ag-paging-button:hover {
            opacity: 1;
          }
          
          .ag-theme-custom .ag-paging-button-wrapper.ag-disabled {
            opacity: 0.3;
            pointer-events: none;
          }
          
          /* Fix for menu items */
          .ag-theme-custom .ag-menu {
            background-color: var(--ag-menu-background-color);
            border-radius: var(--ag-card-radius);
            box-shadow: var(--ag-popup-shadow);
          }
          
          .ag-theme-custom .ag-menu-option {
            height: 40px;
            padding: 0 16px;
          }
          
          .ag-theme-custom .ag-menu-option-active {
            background-color: rgba(59, 130, 246, 0.1);
          }
          
          .ag-theme-custom.dark .ag-menu-option-active {
            background-color: rgba(59, 130, 246, 0.2);
          }
          
          .ag-theme-custom .ag-menu-option-text {
            font-size: 14px;
          }
          
          /* Fix for filter popup */
          .ag-theme-custom .ag-filter-toolpanel-header,
          .ag-theme-custom .ag-filter-toolpanel-search,
          .ag-theme-custom .ag-status-bar,
          .ag-theme-custom .ag-filter-condition,
          .ag-theme-custom .ag-filter-filter {
            font-size: 14px;
            color: var(--ag-foreground-color);
          }
          
          .ag-theme-custom .ag-filter-apply-panel {
            display: flex;
            justify-content: flex-end;
            padding: 8px 16px;
            border-top: 1px solid var(--ag-secondary-border-color);
          }
        `}} />
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredConversations}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={false}
          domLayout="normal"
          noRowsOverlayComponent={noRowsOverlayComponent}
          loadingOverlayComponent={loadingOverlayComponent}
          context={context}
          rowSelection="single"
          rowHeight={70}
          headerHeight={56}
          suppressCellFocus={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          suppressMenuHide={false}
          className={`${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : ''}`}
        />
      </div>
    </div>
  );
}
