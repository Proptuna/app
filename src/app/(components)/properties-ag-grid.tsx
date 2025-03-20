"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
  HomeIcon,
  BuildingIcon,
  UserIcon,
  FileTextIcon,
  ShieldIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  Search,
  X,
  ChevronDownIcon,
  ChevronRightIcon,
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
}

interface PropertiesAgGridProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onAddDoc: (propertyId: string) => void;
  onAddEscalationPolicy: (propertyId: string) => void;
}

// Tag cell renderer with chip styling
const TagCellRenderer = (props: ICellRendererParams) => {
  const value = props.value;
  
  if (!value || value === "—") return null;
  
  return (
    <Badge 
      className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 cursor-pointer"
      onClick={() => {
        // If we have access to the grid API, we can filter by this tag
        if (props.api) {
          const filterInstance = props.api.getFilterInstance('tag');
          if (filterInstance) {
            // Type assertion after null check
            (filterInstance as any).setModel({
              type: 'equals',
              filter: value
            });
            props.api.onFilterChanged();
          }
        }
      }}
    >
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

// Tenants cell renderer
const TenantsCellRenderer = (props: ICellRendererParams) => {
  const tenants = props.value;
  
  if (!tenants || tenants.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1">
      {tenants.map((tenant: string, index: number) => (
        <Badge
          key={index}
          variant="outline"
          className="flex items-center text-xs bg-gray-100 dark:bg-gray-700"
        >
          <UserIcon className="h-3 w-3 mr-1" />
          {tenant}
        </Badge>
      ))}
    </div>
  );
};

// Docs cell renderer
const DocsCellRenderer = (props: ICellRendererParams) => {
  const { value, data, context } = props;
  
  if (!value || !Array.isArray(value) || value.length === 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded-full"
        onClick={() => context?.onAddDoc(data.id)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {value.map((doc: string, index: number) => (
        <Badge
          key={index}
          variant="outline"
          className="bg-gray-100 dark:bg-gray-700"
        >
          <FileTextIcon className="h-3 w-3 mr-1" />
          {doc}
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded-full"
        onClick={() => context?.onAddDoc(data.id)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Escalation policy cell renderer
const EscalationPolicyCellRenderer = (props: ICellRendererParams) => {
  const { value, data, context } = props;
  
  if (!value) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded-full"
        onClick={() => context?.onAddEscalationPolicy(data.id)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    );
  }
  
  return (
    <div className="flex items-center">
      <Badge
        className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2"
      >
        <ShieldIcon className="h-3 w-3 mr-1" />
        {value}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded-full"
        onClick={() => context?.onAddEscalationPolicy(data.id)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Address cell renderer with icon
const AddressCellRenderer = (props: ICellRendererParams) => {
  const { value, data } = props;
  
  // Use different icon based on property type
  const getIcon = () => {
    if (data.type === "multi-family") {
      return <BuildingIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2" />;
    }
    return <HomeIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2" />;
  };
  
  return (
    <div className="flex items-center">
      {getIcon()}
      <span>{value}</span>
    </div>
  );
};

// Actions cell renderer
const ActionsCellRenderer = (props: ICellRendererParams) => {
  const { data, context } = props;
  
  if (!data || !context) return null;
  
  const { onPropertyClick, onAddDoc, onAddEscalationPolicy } = context;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onPropertyClick(data)}>
          <HomeIcon className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddDoc(data.id)}>
          <FileTextIcon className="mr-2 h-4 w-4" />
          <span>Add Document</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddEscalationPolicy(data.id)}>
          <ShieldIcon className="mr-2 h-4 w-4" />
          <span>Set Escalation Policy</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// No rows overlay component
const NoRowsOverlayComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-4">
      <div className="text-gray-400 mb-2">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <path d="M13 2v7h7"></path>
        </svg>
      </div>
      <p className="text-gray-500 text-center">No properties found</p>
      <p className="text-gray-400 text-sm text-center mt-1">Add a new property to get started</p>
    </div>
  );
};

// Loading overlay component
const LoadingOverlayComponent = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="ml-4 text-gray-600 dark:text-gray-400">Loading properties...</p>
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
      headerName: "Tag",
      field: "tag",
      cellRenderer: TagCellRenderer,
      rowGroup: false, // Don't group by default, let user choose
      hide: false, // Make sure column is visible
      sortable: true,
      filter: true,
      enableRowGroup: true, // Enable row grouping for this column
      width: 150,
      filterParams: {
        filterOptions: ['equals'],
        defaultOption: 'equals'
      }
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: PropertyTypeBadgeRenderer,
      sortable: true,
      filter: true,
      enableRowGroup: true, // Enable row grouping for this column
      width: 150,
      filterParams: {
        filterOptions: ['equals'],
        defaultOption: 'equals'
      }
    },
    {
      headerName: "Tenants",
      field: "tenants",
      cellRenderer: TenantsCellRenderer,
      sortable: false,
      filter: false,
      flex: 1.5,
      minWidth: 180,
    },
    {
      headerName: "Docs",
      field: "docs",
      cellRenderer: DocsCellRenderer,
      sortable: false,
      filter: false,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Escalation Policy",
      field: "escalationPolicy",
      cellRenderer: EscalationPolicyCellRenderer,
      sortable: true,
      filter: true,
      width: 180,
      filterParams: {
        filterOptions: ['equals'],
        defaultOption: 'equals'
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      width: 100,
      pinned: "right",
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
    <div className="ag-theme-alpine dark:ag-theme-alpine-dark w-full rounded-md overflow-hidden shadow-sm">
      <div className="p-4 border-b flex items-center">
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
      
      <div className="h-[550px]">
        <style jsx global>{`
          .ag-theme-alpine {
            --ag-header-height: 50px;
            --ag-header-foreground-color: #374151;
            --ag-header-background-color: #f9fafb;
            --ag-header-cell-hover-background-color: #f3f4f6;
            --ag-header-cell-moving-background-color: #f3f4f6;
            --ag-row-hover-color: #f9fafb;
            --ag-selected-row-background-color: rgba(79, 70, 229, 0.1);
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
            --ag-range-selection-border-color: rgba(79, 70, 229, 0.5);
            --ag-range-selection-background-color: rgba(79, 70, 229, 0.1);
            border-radius: 0.5rem;
          }
          
          .ag-theme-alpine-dark {
            --ag-header-foreground-color: #e5e7eb;
            --ag-header-background-color: #1f2937;
            --ag-header-cell-hover-background-color: #374151;
            --ag-header-cell-moving-background-color: #374151;
            --ag-background-color: #111827;
            --ag-foreground-color: #e5e7eb;
            --ag-row-hover-color: #1f2937;
            --ag-selected-row-background-color: rgba(79, 70, 229, 0.2);
            --ag-border-color: #374151;
            --ag-secondary-border-color: #374151;
            --ag-row-border-color: #1f2937;
            border-radius: 0.5rem;
          }
          
          .ag-theme-alpine .ag-header,
          .ag-theme-alpine-dark .ag-header {
            font-weight: 600;
            border-bottom: 1px solid var(--ag-border-color);
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
          
          .ag-theme-alpine .ag-row-group,
          .ag-theme-alpine-dark .ag-row-group {
            background-color: var(--ag-header-background-color);
            font-weight: 600;
          }
        `}</style>
        <AgGridReact
          rowData={filteredProperties}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          onGridReady={onGridReady}
          rowSelection="single"
          context={context}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={false}
          domLayout="normal"
          animateRows={true}
          noRowsOverlayComponent={NoRowsOverlayComponent}
          loadingOverlayComponent={LoadingOverlayComponent}
          rowHeight={60}
          groupDefaultExpanded={1}
          suppressCellFocus={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          groupDisplayType="groupRows"
          groupRemoveSingleChildren={false}
          groupRemoveLowestSingleChildren={false}
          groupMaintainOrder={true}
          groupIncludeFooter={false}
          rowGroupPanelShow="always"
          suppressDragLeaveHidesColumns={true}
        />
      </div>
    </div>
  );
}
