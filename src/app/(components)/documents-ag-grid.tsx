"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import {
  FileTextIcon,
  FileIcon,
  ShieldIcon,
  EyeIcon,
  EyeOffIcon,
  BuildingIcon,
  UserIcon,
  HomeIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  PencilIcon,
  TrashIcon,
  Search,
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
import { AlertCircle } from "lucide-react";
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
const TitleRenderer = (params: ICellRendererParams) => {
  return (
    <div className="flex items-center">
      <DocumentTypeIcon type={params.data.type} />
      <span className="ml-2">{params.value}</span>
    </div>
  );
};

// Type Badge Cell Renderer
const TypeBadgeRenderer = (params: ICellRendererParams) => {
  const type = params.value;
  
  switch (type) {
    case "markdown":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          Markdown
        </Badge>
      );
    case "file":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          File
        </Badge>
      );
    case "escalation-policy":
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
          Escalation Policy
        </Badge>
      );
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

// Associations Cell Renderer
const AssociationsRenderer = (params: ICellRendererParams) => {
  const associations = params.value;
  const allAssociations: Array<{type: string; id: string; name: string}> = [];
  
  if (associations?.properties) {
    associations.properties.forEach((prop: {id: string; address: string}) => {
      allAssociations.push({
        type: "property",
        id: prop.id,
        name: prop.address,
      });
    });
  }
  
  if (associations?.people) {
    associations.people.forEach((person: {id: string; name: string; type: string}) => {
      allAssociations.push({
        type: "person",
        id: person.id,
        name: person.name,
      });
    });
  }
  
  if (associations?.groups) {
    associations.groups.forEach((group: {id: string; name: string}) => {
      allAssociations.push({
        type: "group",
        id: group.id,
        name: group.name,
      });
    });
  }
  
  const getAssociationIcon = (type: string) => {
    switch (type) {
      case "group":
        return <BuildingIcon className="h-3 w-3 mr-1" />;
      case "property":
        return <HomeIcon className="h-3 w-3 mr-1" />;
      case "person":
        return <UserIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-wrap gap-1">
      {allAssociations.map((assoc, index) => (
        <Badge
          key={index}
          variant="outline"
          className="flex items-center text-xs bg-gray-100 dark:bg-gray-700"
        >
          {getAssociationIcon(assoc.type)}
          {assoc.name}
        </Badge>
      ))}
    </div>
  );
};

// Visibility Cell Renderer
const VisibilityRenderer = (params: ICellRendererParams) => {
  const visibility = params.value;
  
  switch (visibility) {
    case "external":
      return (
        <div className="flex items-center text-green-600 dark:text-green-400">
          <EyeIcon className="h-4 w-4 mr-1" />
          <span>Public</span>
        </div>
      );
    case "confidential":
      return (
        <div className="flex items-center text-red-600 dark:text-red-400">
          <EyeOffIcon className="h-4 w-4 mr-1" />
          <span>Confidential</span>
        </div>
      );
    case "internal":
    default:
      return (
        <div className="flex items-center text-amber-600 dark:text-amber-400">
          <EyeOffIcon className="h-4 w-4 mr-1" />
          <span>Internal</span>
        </div>
      );
  }
};

// Date Formatter
const formatDate = (params: ICellRendererParams) => {
  if (!params.value) return "";
  const date = new Date(params.value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Actions Cell Renderer
const ActionsRenderer = (params: ICellRendererParams) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleView = () => {
    console.log("Viewing document with ID:", params.data.id);
    if (params.context.onDocumentView) {
      params.context.onDocumentView(params.data);
    } else {
      // Fallback to direct navigation if no callback provided
      window.location.href = `/documents/${params.data.id}`;
    }
  };
  
  const handleDownload = () => {
    // For markdown documents, we can create a blob and download it
    if (params.data.type === "markdown") {
      const blob = new Blob([params.data.data], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${params.data.title}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      // For other document types, this would depend on implementation
      console.log("Download document:", params.data.id);
    }
  };
  
  const handleEdit = () => {
    window.location.href = `/documents/${params.data.id}/edit`;
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteDocument(params.data.id);
      // Refresh the grid or notify parent component about the deletion
      if (params.context.onDocumentDeleted) {
        params.context.onDocumentDeleted(params.data.id);
      }
    } catch (error: any) {
      console.error("Error deleting document:", error);
      setDeleteError(error.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <EyeIcon className="mr-2 h-4 w-4" />
            <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600 dark:text-red-400" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Document Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              <p className="mb-2">
                Are you sure you want to delete the document <span className="font-semibold">"{params.data.title}"</span>?
              </p>
              <p className="text-gray-500">
                This action cannot be undone and will permanently remove this document and all its associations.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
              <p className="font-medium">Error</p>
              <p>{deleteError}</p>
            </div>
          )}
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <TrashIcon className="h-4 w-4" />
                  Delete Document
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

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
      width: 150,
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
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      width: 100,
      pinned: "right",
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
        return `${propertyAddresses} ${peopleNames} ${groupNames}`;
      }
      
      // For data field, include the document content
      if (params.data && params.data.data) {
        return params.data.data;
      }
      
      return '';
    }
  }), []);

  const noRowsOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <FileIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-500">No documents found</h3>
        <p className="text-gray-400 text-center mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }, []);
  
  const loadingOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="text-gray-500 mt-4">Loading documents...</p>
      </div>
    );
  }, []);
  
  // Context for the grid
  const context = useMemo(() => ({
    onDocumentDeleted,
    onDocumentView
  }), [onDocumentDeleted, onDocumentView]);

  return (
    <div className="ag-theme-alpine dark:ag-theme-alpine-dark w-full rounded-md overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={quickFilterText}
            onChange={onFilterTextChange}
            className="pl-10"
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
          .ag-theme-alpine {
            --ag-header-height: 50px;
            --ag-header-foreground-color: #374151;
            --ag-header-background-color: #f9fafb;
            --ag-header-cell-hover-background-color: #f3f4f6;
            --ag-header-cell-moving-background-color: #f3f4f6;
            --ag-row-hover-color: #f9fafb;
            --ag-selected-row-background-color: rgba(59, 130, 246, 0.1);
            --ag-font-size: 14px;
            --ag-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            --ag-grid-size: 6px;
            --ag-list-item-height: 30px;
            --ag-cell-horizontal-padding: 12px;
            --ag-borders: solid 1px;
            --ag-border-color: #e5e7eb;
            --ag-secondary-border-color: #e5e7eb;
            --ag-row-border-color: #f3f4f6;
            --ag-cell-horizontal-border: solid 1px var(--ag-border-color);
            --ag-range-selection-border-color: rgba(59, 130, 246, 0.5);
            --ag-range-selection-background-color: rgba(59, 130, 246, 0.1);
          }
          
          .ag-theme-alpine-dark {
            --ag-header-foreground-color: #e5e7eb;
            --ag-header-background-color: #1f2937;
            --ag-header-cell-hover-background-color: #374151;
            --ag-header-cell-moving-background-color: #374151;
            --ag-background-color: #111827;
            --ag-foreground-color: #e5e7eb;
            --ag-row-hover-color: #1f2937;
            --ag-selected-row-background-color: rgba(59, 130, 246, 0.2);
            --ag-border-color: #374151;
            --ag-secondary-border-color: #374151;
            --ag-row-border-color: #1f2937;
          }
          
          .ag-theme-alpine .ag-header,
          .ag-theme-alpine-dark .ag-header {
            font-weight: 600;
          }
          
          .ag-theme-alpine .ag-row,
          .ag-theme-alpine-dark .ag-row {
            border-bottom-style: solid;
            border-bottom-width: 1px;
            border-bottom-color: var(--ag-row-border-color);
          }
          
          .ag-theme-alpine .ag-row-hover,
          .ag-theme-alpine-dark .ag-row-hover {
            background-color: var(--ag-row-hover-color);
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
