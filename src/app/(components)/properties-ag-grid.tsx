"use client"

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { 
  ColDef, 
  GridReadyEvent, 
  ICellRendererParams, 
  RowGroupingDisplayType,
  RowNode,
  GridApi,
  IFilterComp
} from "ag-grid-community";
import {
  Home as HomeIcon,
  Building as BuildingIcon,
  User as UserIcon,
  File as FileIcon,
  Shield as ShieldIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  Plus as PlusIcon,
  Search,
  X,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Eye as EyeIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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

interface Property {
  id: string;
  name: string;
  tag: string; // Renamed from 'group'
  address: string;
  type: string;
  tenants: string[];
  docs: string[];
  escalationPolicy: string;
  image?: string; // Added image property
}

interface PropertiesAgGridProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onAddDoc: (propertyId: string) => void;
  onAddEscalationPolicy: (propertyId: string) => void;
}

// Tag cell renderer with chip styling
const TagCellRenderer = (props: ICellRendererParams) => {
  const { value } = props;
  
  if (!value) return null;
  
  // Get color based on tag
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'residential':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'commercial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'vacation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'office':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <Badge className={getTagColor(value)}>
      {value}
    </Badge>
  );
};

// Property type badge renderer
const PropertyTypeBadgeRenderer = (props: ICellRendererParams) => {
  const value = props.value;
  
  if (!value) return null;
  
  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "apartment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "single-family":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "multi-family":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "commercial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const displayValue = value.replace("-", " ");
  
  return (
    <Badge className={getBadgeColor(value)}>
      {displayValue.charAt(0).toUpperCase() + displayValue.slice(1)}
    </Badge>
  );
};

// Type cell renderer
const TypeCellRenderer = (props: ICellRendererParams) => {
  const { value } = props;
  
  if (!value) return null;
  
  // Get color based on type
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'single family':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'multi family':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'condo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'commercial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <Badge className={getTypeColor(value)}>
      {value}
    </Badge>
  );
};

// Tenants cell renderer
const TenantsCellRenderer = (props: ICellRendererParams) => {
  const tenants = props.value as string[];
  const { data, context } = props;
  
  return (
    <div className="flex w-full h-full">
      {/* Left column with centered plus button - fixed width */}
      <div className="w-10 flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            // Add tenant logic here
          }}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Right column with tenants list */}
      <div className="flex-1 flex flex-col justify-center">
        {tenants && tenants.length > 0 ? (
          tenants.map((tenant, index) => (
            <div key={index} className="flex items-center mb-0.5 last:mb-0">
              <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{tenant}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-sm">No tenants</span>
        )}
      </div>
    </div>
  );
};

// Docs cell renderer
const DocsCellRenderer = (props: ICellRendererParams) => {
  const docs = props.value as string[];
  const { data, context } = props;
  
  return (
    <div className="flex w-full h-full">
      {/* Left column with centered plus button - fixed width */}
      <div className="w-10 flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            if (context?.onAddDoc) {
              context.onAddDoc(data.id);
            }
          }}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Right column with docs list */}
      <div className="flex-1 flex flex-col justify-center">
        {docs && docs.length > 0 ? (
          docs.map((doc, index) => (
            <div key={index} className="flex items-center mb-0.5 last:mb-0">
              <FileIcon className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{doc}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-sm">No documents</span>
        )}
      </div>
    </div>
  );
};

// Address cell renderer
const AddressCellRenderer = (props: ICellRendererParams) => {
  const { value, data, context } = props;
  
  if (!data || !context) return null;
  
  return (
    <div 
      className="flex items-center cursor-pointer"
      onClick={() => context.onPropertyClick(data)}
    >
      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
        {data.image ? (
          <img 
            src={data.image} 
            alt={value} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/40x40?text=P";
            }}
          />
        ) : (
          <HomeIcon className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
};

// Actions cell renderer
const ActionsCellRenderer = (props: ICellRendererParams) => {
  const { data, context } = props;
  
  if (!data || !context) return null;
  
  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={(e) => {
          e.stopPropagation();
          context.onPropertyClick(data);
        }}
      >
        <EyeIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// No rows overlay component
const NoRowsOverlayComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] p-4">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
        <HomeIcon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No properties found</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        Try adjusting your search or filter to find what you're looking for, or add a new property.
      </p>
    </div>
  );
};

// Loading overlay component
const LoadingOverlayComponent = () => {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
    </div>
  );
};

// Group cell renderer for the group row
const GroupCellRenderer = (props: ICellRendererParams) => {
  const { node, value } = props;
  
  if (!node.group) return null;
  
  return (
    <div className="flex items-center">
      <span className="font-medium">{value || 'Untagged'}</span>
      <span className="ml-2 text-gray-500">({node.allChildrenCount} properties)</span>
    </div>
  );
};

export default function PropertiesAgGrid({
  properties,
  onPropertyClick,
  onAddDoc,
  onAddEscalationPolicy,
}: PropertiesAgGridProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<any>(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [activeGroupColumn, setActiveGroupColumn] = useState<string | null>("tag");
  
  // Filter out the group rows from the data
  useEffect(() => {
    // Filter out rows that are just group headers (those with id starting with "group-")
    const filtered = properties.filter(property => !property.id.startsWith('group-'));
    setFilteredProperties(filtered);
  }, [properties]);
  
  // Filter properties based on search text
  useEffect(() => {
    if (!quickFilterText.trim()) {
      setFilteredProperties(properties.filter(property => !property.id.startsWith('group-')));
      return;
    }
    
    const searchTerm = quickFilterText.toLowerCase().trim();
    const filtered = properties.filter(property => {
      // Search in address
      if (property.address.toLowerCase().includes(searchTerm)) return true;
      
      // Search in name
      if (property.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search in tag
      if (property.tag.toLowerCase().includes(searchTerm)) return true;
      
      // Search in type
      if (property.type.toLowerCase().includes(searchTerm)) return true;
      
      // Search in tenants
      if (property.tenants.some(tenant => 
        tenant.toLowerCase().includes(searchTerm)
      )) return true;
      
      // Search in docs
      if (property.docs.some(doc => 
        doc.toLowerCase().includes(searchTerm)
      )) return true;
      
      // Search in escalation policy
      if (property.escalationPolicy.toLowerCase().includes(searchTerm)) return true;
      
      return false;
    }).filter(property => !property.id.startsWith('group-'));
    
    setFilteredProperties(filtered);
  }, [properties, quickFilterText]);
  
  // Handle grouping by column
  const handleGroupByColumn = (columnField: string) => {
    if (!columnApi) return;
    
    // If this column is already the active group column, remove grouping
    if (activeGroupColumn === columnField) {
      columnApi.removeRowGroupColumn(columnField);
      setActiveGroupColumn(null);
    } else {
      // Remove any existing row group columns
      if (activeGroupColumn) {
        columnApi.removeRowGroupColumn(activeGroupColumn);
      }
      
      // Add the new row group column
      columnApi.addRowGroupColumn(columnField);
      setActiveGroupColumn(columnField);
    }
  };
  
  // Grid ready event handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    // Use type assertion for columnApi
    setColumnApi((params as any).columnApi);
    
    // Auto-size columns to fit the available width
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 0);
    
    // Expand all groups by default
    params.api.expandAll();
  }, []);
  
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
  
  // Column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: "Address",
      field: "address",
      cellRenderer: AddressCellRenderer,
      flex: 2,
      minWidth: 200,
      sortable: true,
      filter: true,
      resizable: true,
      headerCheckboxSelection: false,
      headerClass: 'custom-header-cell',
    },
    {
      headerName: "Tag",
      field: "tag",
      cellRenderer: TagCellRenderer,
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: true,
      resizable: true,
      headerClass: 'custom-header-cell',
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: TypeCellRenderer,
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: true,
      resizable: true,
      headerClass: 'custom-header-cell',
    },
    {
      headerName: "Tenants",
      field: "tenants",
      cellRenderer: TenantsCellRenderer,
      flex: 1.5,
      minWidth: 180,
      sortable: false,
      filter: false,
      resizable: true,
      headerClass: 'custom-header-cell',
      wrapText: true,
      autoHeight: false,
    },
    {
      headerName: "Docs",
      field: "docs",
      cellRenderer: DocsCellRenderer,
      flex: 1.5,
      minWidth: 180,
      sortable: false,
      filter: false,
      resizable: true,
      headerClass: 'custom-header-cell',
      wrapText: true,
      autoHeight: false,
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      flex: 0.5,
      minWidth: 70,
      sortable: false,
      filter: false,
      resizable: false,
      headerClass: 'custom-header-cell',
    },
  ], []);
  
  // Default column definitions
  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressMovable: false,
    sortable: true,
    filter: true,
    enableRowGroup: false, // Don't enable row grouping for all columns by default
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    }
  }), []);
  
  // Auto group column definition
  const autoGroupColumnDef = useMemo<ColDef>(() => ({
    headerName: "Group",
    minWidth: 250,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: false,
      checkbox: false,
      innerRenderer: (params: any) => {
        return params.value;
      }
    }
  }), []);
  
  // Context for cell renderers
  const context = useMemo(() => ({
    onPropertyClick,
    onAddDoc,
    onAddEscalationPolicy,
  }), [onPropertyClick, onAddDoc, onAddEscalationPolicy]);

  return (
    <div className="ag-theme-custom w-full rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 border-0">
      <div className="p-4 border-b-0 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={quickFilterText}
            onChange={onFilterTextChange}
            className="pl-10"
          />
          {quickFilterText && (
            <button
              onClick={() => setQuickFilterText("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="h-[600px]">
        <style jsx global>{`
          .ag-theme-custom {
            --ag-font-size: 14px;
            --ag-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            
            --ag-header-height: 56px;
            --ag-header-foreground-color: #374151;
            --ag-header-background-color: #ffffff;
            --ag-header-cell-hover-background-color: #f9fafb;
            --ag-header-cell-moving-background-color: #f3f4f6;
            
            --ag-background-color: #ffffff;
            --ag-foreground-color: #374151;
            
            --ag-border-color: #f3f4f6;
            --ag-row-border-color: #f3f4f6;
            
            --ag-row-hover-color: #f9fafb;
            --ag-selected-row-background-color: #f9fafb;
            
            --ag-odd-row-background-color: #ffffff;
            --ag-control-panel-background-color: #ffffff;
            
            --ag-invalid-color: #ef4444;
            --ag-range-selection-border-color: #3b82f6;
            --ag-range-selection-background-color: rgba(59, 130, 246, 0.1);
            
            --ag-cell-horizontal-padding: 16px;
            --ag-cell-vertical-padding: 8px;
            --ag-row-height: 70px;
            --ag-borders: none;
            --ag-borders-side-panel: none;
            --ag-borders-cell: none;
            --ag-borders-critical: none;
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
            
            --ag-border-color: transparent;
            --ag-row-border-color: #374151;
            
            --ag-row-hover-color: #374151;
            --ag-selected-row-background-color: #374151;
            
            --ag-odd-row-background-color: #1f2937;
            --ag-control-panel-background-color: #1f2937;
          }
          
          .ag-theme-custom .ag-header {
            border-top: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .dark .ag-theme-custom .ag-header {
            border-top: 1px solid #374151;
            border-bottom: 1px solid #374151;
          }
          
          .ag-theme-custom .ag-header-cell {
            font-weight: 600;
          }
          
          .ag-theme-custom .ag-cell {
            display: flex;
            align-items: center;
          }
          
          .ag-theme-custom .ag-row {
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.2s ease;
          }
          
          .dark .ag-theme-custom .ag-row {
            border-bottom: 1px solid #374151;
          }
          
          .ag-theme-custom .ag-row-hover {
            background-color: #f9fafb;
          }
          
          .dark .ag-theme-custom .ag-row-hover {
            background-color: #374151;
          }
          
          /* Fix for sort icons */
          .ag-theme-custom .ag-header-cell-label {
            display: flex;
            align-items: center;
          }
          
          .ag-theme-custom .ag-header-cell-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .ag-theme-custom .custom-header-cell .ag-header-icon {
            display: none;
          }
          
          .ag-theme-custom .custom-header-cell.ag-header-cell-sorted-asc::after,
          .ag-theme-custom .custom-header-cell.ag-header-cell-sorted-desc::after {
            content: '';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }
          
          .ag-theme-custom .custom-header-cell.ag-header-cell-sorted-asc::after {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m18 15-6-6-6 6'/%3E%3C/svg%3E");
          }
          
          .ag-theme-custom .custom-header-cell.ag-header-cell-sorted-desc::after {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          }
          
          .dark .ag-theme-custom .custom-header-cell.ag-header-cell-sorted-asc::after {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e5e7eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m18 15-6-6-6 6'/%3E%3C/svg%3E");
          }
          
          .dark .ag-theme-custom .custom-header-cell.ag-header-cell-sorted-desc::after {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e5e7eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          }
          
          /* Pagination styling */
          .ag-theme-custom .ag-paging-panel {
            height: 50px;
            border-top: 1px solid #f3f4f6;
            color: #4b5563;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
          }
          
          .dark .ag-theme-custom .ag-paging-panel {
            border-top: 1px solid #374151;
            color: #e5e7eb;
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
          
          .ag-theme-custom .ag-paging-button.ag-disabled {
            opacity: 0.5;
            cursor: default;
          }
          
          .ag-theme-custom .ag-paging-description {
            font-size: 14px;
          }
        `}</style>
        <AgGridReact
          rowData={filteredProperties}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          context={context}
          suppressRowClickSelection={true}
          animateRows={true}
          noRowsOverlayComponent={NoRowsOverlayComponent}
          loadingOverlayComponent={LoadingOverlayComponent}
          rowHeight={70}
          groupDefaultExpanded={1}
          suppressCellFocus={true}
          enableCellTextSelection={true}
          pagination={true}
          paginationPageSize={10}
          suppressPaginationPanel={false}
          domLayout="normal"
          suppressMovableColumns={true}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={false}
          suppressHorizontalScroll={true}
        />
      </div>
    </div>
  );
}
