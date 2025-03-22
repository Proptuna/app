"use client"

import { useMemo } from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  BuildingIcon, 
  DownloadIcon, 
  EyeIcon, 
  FileIcon, 
  FileTextIcon, 
  HomeIcon, 
  ShieldIcon, 
  UserIcon 
} from "lucide-react";

export interface Document {
  id: string;
  title: string;
  type: string;
  visibility: "internal" | "external" | "confidential";
  created_at: string;
  updated_at: string;
  data: string;
  version: number;
  metadata: Record<string, any>;
}

export interface DocumentsDataTableProps {
  documents: Document[];
  onDocumentView: (document: Document) => void;
  isLoading?: boolean;
}

// Document type icon component
const DocumentTypeIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case "markdown":
      return <FileTextIcon className="h-5 w-5 text-blue-500" />;
    case "pdf":
      return <FileIcon className="h-5 w-5 text-red-500" />;
    case "escalation_policy":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    default:
      return <FileIcon className="h-5 w-5 text-gray-500" />;
  }
};

// Title Cell Renderer
const TitleRenderer = (params: ICellRendererParams) => {
  const document = params.data as Document;
  return (
    <div className="flex items-center gap-3">
      <DocumentTypeIcon type={document.type} />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{document.title}</div>
        <div className="text-xs text-gray-500">ID: {document.id}</div>
      </div>
    </div>
  );
};

// Type Badge Cell Renderer
const TypeBadgeRenderer = (params: ICellRendererParams) => {
  const document = params.data as Document;
  const type = document.type?.toLowerCase() || "unknown";
  
  let badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  let label = type.charAt(0).toUpperCase() + type.slice(1);
  
  switch (type) {
    case "markdown":
      badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      label = "Markdown";
      break;
    case "pdf":
      badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      label = "PDF";
      break;
    case "escalation_policy":
      badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      label = "Escalation Policy";
      break;
  }
  
  return (
    <Badge className={`${badgeClass} font-medium`}>
      {label}
    </Badge>
  );
};

// Associations Cell Renderer
const AssociationsRenderer = (params: ICellRendererParams) => {
  const document = params.data as Document;
  const metadata = document.metadata || {};
  
  const associations = {
    properties: metadata.properties || [],
    people: metadata.people || [],
  };
  
  return (
    <div className="flex flex-col gap-1">
      {associations.properties.length > 0 && (
        <div className="flex items-center gap-1">
          <HomeIcon className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {associations.properties.length} {associations.properties.length === 1 ? "property" : "properties"}
          </span>
        </div>
      )}
      
      {associations.people.length > 0 && (
        <div className="flex items-center gap-1">
          <UserIcon className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {associations.people.length} {associations.people.length === 1 ? "person" : "people"}
          </span>
        </div>
      )}
      
      {(!associations.properties.length && !associations.people.length) && (
        <span className="text-xs text-gray-500">No associations</span>
      )}
    </div>
  );
};

// Visibility Cell Renderer
const VisibilityRenderer = (params: ICellRendererParams) => {
  const document = params.data as Document;
  const visibility = document.visibility || "internal";
  
  let icon = <BuildingIcon className="h-4 w-4 text-gray-500" />;
  let label = "Internal";
  let badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  
  switch (visibility) {
    case "external":
      icon = <UserIcon className="h-4 w-4 text-green-500" />;
      label = "External";
      badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      break;
    case "confidential":
      icon = <ShieldIcon className="h-4 w-4 text-red-500" />;
      label = "Confidential";
      badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      break;
  }
  
  return (
    <Badge className={`${badgeClass} font-medium flex items-center gap-1`}>
      {icon}
      <span>{label}</span>
    </Badge>
  );
};

// Date Formatter
const formatDate = (params: ICellRendererParams) => {
  const document = params.data as Document;
  const date = params.colDef?.field === 'created_at' 
    ? document.created_at 
    : document.updated_at;
  
  if (!date) return "N/A";
  
  try {
    const dateObj = new Date(date);
    
    // Format date: "Mar 21, 2025"
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Format time: "3:45 PM"
    const formattedTime = dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formattedDate}</span>
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </div>
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Actions Cell Renderer
const ActionsRenderer = (params: ICellRendererParams) => {
  const document = params.data as Document;
  const { onDocumentView } = params.context;
  
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onDocumentView(document)}
        title="View document"
      >
        <EyeIcon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => window.open(`/api/v1/documents/${document.id}/download`, '_blank')}
        title="Download document"
      >
        <DownloadIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function DocumentsDataTable({
  documents,
  onDocumentView,
  isLoading = false
}: DocumentsDataTableProps) {
  // Define column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: "Document",
      field: "title",
      flex: 3,
      minWidth: 250,
      cellRenderer: TitleRenderer,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Type",
      field: "type",
      flex: 1,
      minWidth: 150,
      cellRenderer: TypeBadgeRenderer,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Associations",
      field: "metadata",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: AssociationsRenderer,
      sortable: false,
      filter: false,
    },
    {
      headerName: "Visibility",
      field: "visibility",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: VisibilityRenderer,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created",
      field: "created_at",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: formatDate,
      sortable: true,
      sort: 'desc',
      filter: true,
    },
    {
      headerName: "Updated",
      field: "updated_at",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: formatDate,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
      minWidth: 100,
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      cellClass: "ag-cell-actions",
    },
  ], []);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }), []);

  return (
    <DataTable
      data={documents}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      isLoading={isLoading}
      noRowsMessage="No documents found"
      loadingMessage="Loading documents..."
      searchPlaceholder="Search documents..."
      context={{ onDocumentView }}
      height="calc(100vh - 250px)"
    />
  );
}

export default DocumentsDataTable;
