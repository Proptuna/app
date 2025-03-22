"use client"

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Property, Tenant, Document } from "@/types/property";
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  UserIcon, 
  FileIcon, 
  PlusIcon, 
  EyeIcon,
} from "lucide-react";

// Tag cell renderer with chip styling
const TagCellRenderer = (props: any) => {
  const { value } = props;
  
  if (!value) return <span className="text-gray-400">-</span>;
  
  // Get color based on tag
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'residential':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium';
      case 'commercial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium';
      case 'vacation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium';
      case 'office':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium';
    }
  };
  
  return (
    <div className={getTagColor(value)}>
      {value}
    </div>
  );
};

// Type cell renderer
const TypeCellRenderer = (props: any) => {
  const { value } = props;
  
  if (!value) return <span className="text-gray-400">-</span>;
  
  // Get color based on type
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'single family':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium';
      case 'multi family':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium';
      case 'condo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium';
      case 'commercial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium';
    }
  };
  
  return (
    <div className={getTypeColor(value)}>
      {value}
    </div>
  );
};

// Tenants cell renderer
const TenantsCellRenderer = (props: any) => {
  const tenants = props.value as Tenant[];
  
  return (
    <div className="flex items-center py-1.5">
      <UserIcon className="h-4 w-4 text-gray-500 mr-2.5 flex-shrink-0" />
      <div>
        {tenants && tenants.length > 0 ? (
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{tenants[0].name}</div>
            {tenants.length > 1 && (
              <div className="text-xs text-gray-500 mt-0.5">
                +{tenants.length - 1} more
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            // Add tenant logic here
          }}
        >
          <PlusIcon className="h-3 w-3 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
};

// Docs cell renderer
const DocsCellRenderer = (props: any) => {
  const documents = props.value as Document[];
  const { data } = props;
  
  return (
    <div className="flex items-center py-1.5">
      <FileIcon className="h-4 w-4 text-gray-500 mr-2.5 flex-shrink-0" />
      <div>
        {documents && documents.length > 0 ? (
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{documents[0].name}</div>
            {documents.length > 1 && (
              <div className="text-xs text-gray-500 mt-0.5">
                +{documents.length - 1} more
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            if (data && data.id) {
              props.context.onAddDoc(data.id);
            }
          }}
        >
          <PlusIcon className="h-3 w-3 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
};

// Address cell renderer
const AddressCellRenderer = (props: any) => {
  const { data } = props;
  
  if (!data) return <span className="text-gray-400">-</span>;
  
  const property = data as Property;
  
  return (
    <div className="flex items-center py-1.5">
      <HomeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{property.address}</div>
        <div className="text-xs text-gray-500 mt-0.5">{property.city}, {property.state}</div>
      </div>
    </div>
  );
};

// Actions cell renderer
const ActionsCellRenderer = (props: any) => {
  const { data, context } = props;
  
  return (
    <div className="flex justify-center items-center w-full">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={(e) => {
          e.stopPropagation();
          if (data) {
            context.onPropertyClick(data);
          }
        }}
      >
        <EyeIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </Button>
    </div>
  );
};

export default function PropertiesAgGrid({
  properties,
  onPropertyClick,
  onAddDoc,
  onAddEscalationPolicy,
}: {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onAddDoc: (propertyId: string) => void;
  onAddEscalationPolicy: (propertyId: string) => void;
}) {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const isLoading = false;

  // Update filtered properties when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProperties(properties);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = properties.filter(property => 
      property.address.toLowerCase().includes(query) ||
      property.city.toLowerCase().includes(query) ||
      property.state.toLowerCase().includes(query) ||
      property.type?.toLowerCase().includes(query) ||
      property.tag?.toLowerCase().includes(query)
    );
    
    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

  // Column definitions
  const columnDefs = useMemo<any[]>(() => [
    {
      headerName: "Address",
      field: "address",
      cellRenderer: AddressCellRenderer,
      sortable: true,
      filter: true,
      flex: 2,
      minWidth: 200,
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
      headerName: "Tag",
      field: "tag",
      cellRenderer: TagCellRenderer,
      sortable: true,
      filter: true,
      width: 130,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Tenants",
      field: "tenants",
      cellRenderer: TenantsCellRenderer,
      sortable: false,
      filter: false,
      flex: 1,
      minWidth: 180,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "Documents",
      field: "documents",
      cellRenderer: DocsCellRenderer,
      sortable: false,
      filter: false,
      flex: 1,
      minWidth: 180,
      headerClass: 'ag-header-cell-padded',
      cellClass: 'ag-cell-padded',
    },
    {
      headerName: "",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      width: 80,
      cellClass: 'ag-cell-padded',
    },
  ], []);

  // Context for the grid
  const context = useMemo(() => {
    return {
      onPropertyClick,
      onAddDoc,
      onAddEscalationPolicy,
    };
  }, [onPropertyClick, onAddDoc, onAddEscalationPolicy]);

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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="w-full h-full">
      <DataTable
        data={filteredProperties}
        columnDefs={columnDefs}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        searchPlaceholder="Search properties..."
        isLoading={isLoading}
        noRowsMessage="No properties found"
        loadingMessage="Loading properties..."
        height={600}
        rowHeight={70}
        headerHeight={56}
        pagination={true}
        paginationPageSize={10}
        context={context}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}
