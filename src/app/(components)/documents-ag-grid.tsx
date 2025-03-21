"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import {
  AlertCircle,
  AlertTriangle,
  BuildingIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileIcon,
  FileTextIcon,
  FileX,
  HomeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Search,
  ShieldIcon,
  TrashIcon,
  UserIcon,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/lib/documents-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export interface Document {
  id: string;
  title: string;
  type: string;
  data: string;
  visibility: "internal" | "external" | "confidential";
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  version: number;
  associations?: {
    properties: Array<{ id: string; address: string }>;
    people: Array<{ id: string; name: string; type: string }>;
    groups: Array<{ id: string; name: string }>;
    tags: Array<{ id: string; name: string }>;
  };
}

interface DocumentsAgGridProps {
  documents: Document[];
  onDocumentDeleted: (id: string) => void;
  onDocumentView: (document: Document) => void;
  isLoading?: boolean;
}

// Document type icon component
const DocumentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "markdown":
      return <FileTextIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case "file":
      return <FileIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
    case "escalation-policy":
      return <ShieldIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    default:
      return <FileTextIcon className="h-4 w-4" />;
  }
};

// Title Cell Renderer
function TitleRenderer(params: ICellRendererParams) {
  const document = params.data;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center justify-center">
        <FileTextIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {document.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {new Date(document.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// Type Badge Cell Renderer
function TypeBadgeRenderer(params: ICellRendererParams) {
  const type = params.value;
  
  let badgeClass = "bg-gray-100 text-gray-800";
  let icon = <FileIcon className="h-3.5 w-3.5" />;
  
  if (type === "markdown") {
    badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    icon = <FileTextIcon className="h-3.5 w-3.5" />;
  } else if (type === "pdf") {
    badgeClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    icon = <FileIcon className="h-3.5 w-3.5" />;
  } else if (type === "escalation-policy") {
    badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    icon = <ShieldIcon className="h-3.5 w-3.5" />;
  } else if (type === "image") {
    badgeClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    icon = <FileIcon className="h-3.5 w-3.5" />;
  }
  
  return (
    <div className="flex items-center">
      <Badge variant="outline" className={`flex items-center gap-1.5 ${badgeClass} border-0 font-medium`}>
        {icon}
        <span>{type}</span>
      </Badge>
    </div>
  );
}

// Associations Cell Renderer
function AssociationsRenderer(params: ICellRendererParams) {
  const associations = params.value;
  
  if (!associations) {
    return <div className="text-gray-400 text-sm">No associations</div>;
  }
  
  const properties = associations.properties || [];
  const people = associations.people || [];
  const tags = associations.tags || [];
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {properties.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <HomeIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {properties.length === 1 
              ? properties[0].address || properties[0].id 
              : `${properties.length} properties`}
          </span>
        </div>
      )}
      
      {people.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <UserIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {people.length === 1 
              ? people[0].name || people[0].id 
              : `${people.length} people`}
          </span>
        </div>
      )}
      
      {tags.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
            <FileIcon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {tags.length === 1 
              ? tags[0].name || tags[0].id 
              : `${tags.length} tags`}
          </span>
        </div>
      )}
      
      {properties.length === 0 && people.length === 0 && tags.length === 0 && (
        <div className="text-gray-400 text-sm">No associations</div>
      )}
    </div>
  );
}

// Visibility Cell Renderer
function VisibilityRenderer(params: ICellRendererParams) {
  const visibility = params.value;
  
  let badgeClass = "";
  let icon = null;
  
  switch (visibility) {
    case "internal":
      badgeClass = "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
      icon = <EyeIcon className="h-3.5 w-3.5" />;
      break;
    case "external":
      badgeClass = "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      icon = <EyeIcon className="h-3.5 w-3.5" />;
      break;
    case "confidential":
      badgeClass = "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
      icon = <EyeOffIcon className="h-3.5 w-3.5" />;
      break;
    default:
      badgeClass = "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      icon = <EyeIcon className="h-3.5 w-3.5" />;
  }
  
  return (
    <div className="flex items-center">
      <Badge variant="outline" className={`flex items-center gap-1.5 ${badgeClass} border-0 font-medium`}>
        {icon}
        <span className="capitalize">{visibility}</span>
      </Badge>
    </div>
  );
}

// Date Formatter
function formatDate(params: ICellRendererParams) {
  if (!params.value) return <span className="text-gray-400">-</span>;
  
  const date = new Date(params.value);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let formattedDate;
  
  if (diffDays <= 1) {
    // Today or yesterday - show time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    formattedDate = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    if (date.getDate() !== now.getDate() || 
        date.getMonth() !== now.getMonth() || 
        date.getFullYear() !== now.getFullYear()) {
      formattedDate = `Yesterday, ${formattedDate}`;
    } else {
      formattedDate = `Today, ${formattedDate}`;
    }
  } else if (diffDays <= 7) {
    // Within the last week - show day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    formattedDate = days[date.getDay()];
  } else {
    // More than a week ago - show date
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    };
    formattedDate = date.toLocaleDateString(undefined, options);
  }
  
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-700 dark:text-gray-300">{formattedDate}</span>
    </div>
  );
}

// Actions Cell Renderer
function ActionsRenderer(params: ICellRendererParams) {
  const { onDocumentDeleted, onDocumentView } = params.context;
  const document = params.data;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!document || !document.id) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const result = await deleteDocument(document.id);
      
      if (result.success) {
        // Call the onDelete callback if provided
        if (onDocumentDeleted) {
          onDocumentDeleted(document.id);
        }
        setIsDeleteDialogOpen(false);
      }
    } catch (error: any) {
      console.error("Error deleting document:", error);
      setDeleteError(error.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <button
        onClick={() => onDocumentView(document)}
        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
        title="View document"
      >
        <EyeIcon className="h-5 w-5" />
      </button>
      
      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{document?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
            {deleteError && (
              <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-md border border-red-200 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>{deleteError}</div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function DocumentsAgGrid({ 
  documents, 
  onDocumentDeleted,
  onDocumentView,
  isLoading = false
}: DocumentsAgGridProps) {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  
  useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  // Filter documents based on search text
  useEffect(() => {
    if (!quickFilterText.trim()) {
      setFilteredDocuments(documents);
      return;
    }
    
    const searchTerm = quickFilterText.toLowerCase().trim();
    const filtered = documents.filter(doc => {
      // Search in title
      if (doc.title.toLowerCase().includes(searchTerm)) return true;
      
      // Search in type
      if (doc.type.toLowerCase().includes(searchTerm)) return true;
      
      // Search in visibility
      if (doc.visibility.toLowerCase().includes(searchTerm)) return true;
      
      // Search in document content
      if (doc.data && doc.data.toLowerCase().includes(searchTerm)) return true;
      
      // Search in associations
      if (doc.associations) {
        // Search in properties
        if (doc.associations.properties?.some(p => 
          p.address.toLowerCase().includes(searchTerm)
        )) return true;
        
        // Search in people
        if (doc.associations.people?.some(p => 
          p.name.toLowerCase().includes(searchTerm)
        )) return true;
        
        // Search in groups
        if (doc.associations.groups?.some(g => 
          g.name.toLowerCase().includes(searchTerm)
        )) return true;
        
        // Search in tags
        if (doc.associations.tags?.some(t => 
          t.name.toLowerCase().includes(searchTerm)
        )) return true;
      }
      
      return false;
    });
    
    setFilteredDocuments(filtered);
  }, [documents, quickFilterText]);
  
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    // In newer versions of AG Grid, columnApi is accessed as a property of the api
    setGridColumnApi((params as any).columnApi);
    
    // Auto-size columns to fit the available width
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 0);

    // Set default sorting by updated_at (newest first)
    const columnApi = (params as any).columnApi;
    if (columnApi) {
      columnApi.applyColumnState({
        state: [
          {
            colId: 'updated_at',
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
      } else if (filteredDocuments.length === 0 && quickFilterText) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, isLoading, filteredDocuments.length, quickFilterText]);

  // Handle quick filter text change
  const onFilterTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuickFilterText(value);
  }, []);

  // Handle window resize
  useEffect(() => {
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
      headerName: "Document",
      field: "title",
      cellRenderer: TitleRenderer,
      sortable: true,
      filter: true,
      flex: 2,
      minWidth: 200,
      filterParams: {
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains'
      }
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: TypeBadgeRenderer,
      sortable: true,
      filter: true,
      width: 130,
      filterParams: {
        filterOptions: ['equals'],
        defaultOption: 'equals'
      }
    },
    {
      headerName: "Associations",
      field: "associations",
      cellRenderer: AssociationsRenderer,
      sortable: false,
      filter: false,
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: "Visibility",
      field: "visibility",
      cellRenderer: VisibilityRenderer,
      sortable: true,
      filter: true,
      width: 120,
      filterParams: {
        filterOptions: ['equals'],
        defaultOption: 'equals'
      }
    },
    {
      headerName: "Last Updated",
      field: "updated_at",
      cellRenderer: formatDate,
      sortable: true,
      filter: true,
      width: 150,
      sort: 'desc',
      filterParams: {
        filterOptions: ['equals', 'greaterThan', 'lessThan'],
        defaultOption: 'greaterThan'
      }
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      width: 70,
      pinned: "right",
      cellClass: "flex justify-center"
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
    },
    getQuickFilterText: (params: any) => {
      // For title field, include the title
      if (params.colDef.field === 'title') {
        return params.value;
      }
      
      // For type field, include the type
      if (params.colDef.field === 'type') {
        return params.value;
      }
      
      // For visibility field, include the visibility
      if (params.colDef.field === 'visibility') {
        return params.value;
      }
      
      // For associations, include property addresses, people names, and group names
      if (params.colDef.field === 'associations' && params.value) {
        const associations = params.value;
        const propertyAddresses = associations.properties?.map((p: any) => p.address).join(' ') || '';
        const peopleNames = associations.people?.map((p: any) => p.name).join(' ') || '';
        const groupNames = associations.groups?.map((g: any) => g.name).join(' ') || '';
        const tagNames = associations.tags?.map((t: any) => t.name).join(' ') || '';
        return `${propertyAddresses} ${peopleNames} ${groupNames} ${tagNames}`;
      }
      
      // For data field, include the document content
      if (params.data && params.data.data) {
        return params.data.data;
      }
      
      return '';
    }
  }), []);

  // Custom No Rows Overlay Component
  function NoRowsOverlay() {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <FileX className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No Documents Found</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  // Custom Loading Overlay Component
  function LoadingOverlay() {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="h-8 w-8 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Loading Documents</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Please wait while we fetch your documents
        </p>
      </div>
    );
  }

  const noRowsOverlayComponent = useMemo(() => NoRowsOverlay, []);
  const loadingOverlayComponent = useMemo(() => LoadingOverlay, []);

  // Context for the grid
  const context = useMemo(() => ({
    onDocumentDeleted,
    onDocumentView
  }), [onDocumentDeleted, onDocumentView]);

  return (
    <div className="ag-theme-custom w-full rounded-md overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={quickFilterText}
            onChange={onFilterTextChange}
            className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
          {quickFilterText && (
            <button
              onClick={() => {
                setQuickFilterText("");
                if (gridApi) {
                  gridApi.setQuickFilter("");
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="h-[550px]">
        <style jsx global>{`
          .ag-theme-custom {
            --ag-header-height: 50px;
            --ag-header-foreground-color: #374151;
            --ag-header-background-color: #ffffff;
            --ag-header-cell-hover-background-color: #f9fafb;
            --ag-header-cell-moving-background-color: #f3f4f6;
            --ag-background-color: #ffffff;
            --ag-row-hover-color: #f9fafb;
            --ag-selected-row-background-color: rgba(79, 70, 229, 0.1);
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
            --ag-range-selection-border-color: rgba(79, 70, 229, 0.5);
            --ag-range-selection-background-color: rgba(79, 70, 229, 0.1);
            --ag-icon-color: #6b7280;
            --ag-icon-size: 16px;
            --ag-icon-font-family: agGridAlpine;
          }
          
          .dark .ag-theme-custom {
            --ag-header-foreground-color: #e5e7eb;
            --ag-header-background-color: #1f2937;
            --ag-header-cell-hover-background-color: #374151;
            --ag-header-cell-moving-background-color: #374151;
            --ag-background-color: #1f2937;
            --ag-foreground-color: #e5e7eb;
            --ag-row-hover-color: #111827;
            --ag-selected-row-background-color: rgba(79, 70, 229, 0.2);
            --ag-border-color: transparent;
            --ag-secondary-border-color: #374151;
            --ag-row-border-color: #374151;
            --ag-icon-color: #9ca3af;
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
          
          .ag-theme-custom .ag-paging-panel {
            color: var(--ag-foreground-color);
            height: 48px;
            padding: 0 16px;
            border-top: 1px solid var(--ag-secondary-border-color);
          }
          
          .ag-theme-custom .ag-paging-button {
            cursor: pointer;
            padding: 6px;
            margin: 0 2px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }
          
          .ag-theme-custom .ag-paging-button:hover:not(.ag-disabled) {
            background-color: #f3f4f6;
          }
          
          .dark .ag-theme-custom .ag-paging-button:hover:not(.ag-disabled) {
            background-color: #374151;
          }
        `}</style>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredDocuments}
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
          rowHeight={60}
          suppressCellFocus={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
        />
      </div>
    </div>
  );
}
