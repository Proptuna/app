"use client"

import { useMemo } from "react";
import { 
  ColDef, 
  ICellRendererParams
} from "ag-grid-community";
import { Person } from "@/lib/people-client";
import { 
  UserIcon, 
  PhoneIcon, 
  BuildingIcon, 
  EyeIcon
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

// Type cell renderer
const TypeCellRenderer = (props: ICellRendererParams) => {
  const value = props.value as string;
  
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "tenant":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium";
      case "owner":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium";
      case "property manager":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium";
    }
  };
  
  return (
    <div className={getTypeColor(value)}>
      {value || "Unknown"}
    </div>
  );
};

// Role cell renderer
const RoleCellRenderer = (props: ICellRendererParams) => {
  const value = props.value as string;
  
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "primary":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium";
      case "secondary":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium";
      case "guarantor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium";
    }
  };
  
  return (
    <div className={getRoleColor(value)}>
      {value || "Unknown"}
    </div>
  );
};

// Properties cell renderer
const PropertiesCellRenderer = (props: ICellRendererParams) => {
  const properties = props.value as string[];
  
  if (!properties || properties.length === 0) {
    return <span className="text-gray-400">-</span>;
  }
  
  return (
    <div className="flex items-center py-1.5">
      <BuildingIcon className="h-4 w-4 text-gray-500 mr-2.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{properties[0]}</div>
        {properties.length > 1 && (
          <div className="text-xs text-gray-500 mt-0.5">
            +{properties.length - 1} more
          </div>
        )}
      </div>
    </div>
  );
};

// Name cell renderer
const NameCellRenderer = (props: ICellRendererParams) => {
  const person = props.data as Person;
  
  return (
    <div className="flex items-center py-1.5">
      <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{person.name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{person.email}</div>
      </div>
    </div>
  );
};

// Phone cell renderer
const PhoneCellRenderer = (props: ICellRendererParams) => {
  const value = props.value as string;
  
  if (!value) {
    return <span className="text-gray-400">-</span>;
  }
  
  return (
    <div className="flex items-center py-1.5">
      <PhoneIcon className="h-4 w-4 text-gray-500 mr-2.5 flex-shrink-0" />
      <span className="text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
};

// View action cell renderer
const ViewActionRenderer = (props: ICellRendererParams) => {
  const { onPersonView } = props.context || {};
  const person = props.data as Person;
  
  return (
    <div className="flex justify-center items-center w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          if (onPersonView && person) {
            onPersonView(person.id);
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

// Component implementation
export default function PeopleAgGrid({
  people,
  onPersonView,
  loading = false,
  searchQuery = "",
  onSearch,
}: {
  people: Person[];
  onPersonView: (id: string) => void;
  loading?: boolean;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}) {
  // Column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: "Name",
      field: "name",
      cellRenderer: NameCellRenderer,
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
      headerName: "Phone",
      field: "phone",
      cellRenderer: PhoneCellRenderer,
      sortable: true,
      filter: true,
      width: 150,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: TypeCellRenderer,
      sortable: true,
      filter: true,
      width: 130,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Role",
      field: "role",
      cellRenderer: RoleCellRenderer,
      sortable: true,
      filter: true,
      width: 130,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Properties",
      field: "properties",
      cellRenderer: PropertiesCellRenderer,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 180,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: ViewActionRenderer,
      sortable: false,
      filter: false,
      width: 80,
      cellClass: 'ag-cell-padded',
    },
  ], []);

  // Context for the grid
  const context = useMemo(() => {
    return {
      onPersonView
    };
  }, [onPersonView]);

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

  return (
    <DataTable
      data={people}
      columnDefs={columnDefs}
      onSearch={onSearch}
      searchQuery={searchQuery}
      searchPlaceholder="Search people..."
      isLoading={loading}
      noRowsMessage="No people found"
      loadingMessage="Loading people..."
      height={600}
      rowHeight={70}
      headerHeight={56}
      pagination={true}
      paginationPageSize={10}
      context={context}
      defaultColDef={defaultColDef}
    />
  );
}
