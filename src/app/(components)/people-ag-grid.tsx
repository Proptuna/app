"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  UsersIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  Search,
  X,
  EyeIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deletePerson } from "@/lib/people-client";
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
import { Person } from "@/lib/people-client";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface PeopleAgGridProps {
  people: Person[];
  onPersonDeleted: (id: string) => void;
  onPersonEdit: (id: string) => void;
  onPersonView: (id: string) => void;
}

// Cell renderer for person type/role badges
const BadgeCellRenderer = (props: ICellRendererParams) => {
  const value = props.value;
  
  if (!value) return null;
  
  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "owner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "tenant":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pm":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "leasing_agent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const displayValue = value.replace("_", " ");
  
  return (
    <Badge className={getBadgeColor(value)}>
      {displayValue.charAt(0).toUpperCase() + displayValue.slice(1)}
    </Badge>
  );
};

// Cell renderer for associations
const AssociationsCellRenderer = (props: ICellRendererParams) => {
  const associations = props.value;
  
  if (!associations) return null;
  
  const properties = associations.properties || [];
  const groups = associations.groups || [];
  
  return (
    <div className="flex flex-col gap-1">
      {properties.length > 0 && (
        <div className="flex items-center gap-1">
          <BuildingIcon className="h-4 w-4 text-gray-500" />
          <span className="text-xs">{properties.length} properties</span>
        </div>
      )}
      {groups.length > 0 && (
        <div className="flex items-center gap-1">
          <UsersIcon className="h-4 w-4 text-gray-500" />
          <span className="text-xs">{groups.length} groups</span>
        </div>
      )}
    </div>
  );
};

// Cell renderer for contact info
const ContactCellRenderer = (props: ICellRendererParams) => {
  const { data } = props;
  
  if (!data) return null;
  
  return (
    <div className="flex flex-col gap-1">
      {data.email && (
        <div className="flex items-center gap-1">
          <MailIcon className="h-4 w-4 text-gray-500" />
          <span className="text-xs truncate max-w-[150px]">{data.email}</span>
        </div>
      )}
      {data.phone && (
        <div className="flex items-center gap-1">
          <PhoneIcon className="h-4 w-4 text-gray-500" />
          <span className="text-xs">{data.phone}</span>
        </div>
      )}
    </div>
  );
};

// Cell renderer for actions menu
const ActionsCellRenderer = (props: ICellRendererParams) => {
  const { data, context } = props;
  
  if (!data || !context) return null;
  
  const { onEdit, onDelete, onView } = context;
  
  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(data.id)}
        className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        title="View details"
      >
        <EyeIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(data.id)}>
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(data.id)}>
            <TrashIcon className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Name cell renderer with icon
const NameCellRenderer = (props: ICellRendererParams) => {
  return (
    <div className="flex items-center py-1.5">
      <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2.5 flex-shrink-0" />
      <span className="font-medium text-gray-900 dark:text-gray-100">{props.value}</span>
    </div>
  );
};

// No rows overlay component
const NoRowsOverlayComponent = () => (
  <div className="flex flex-col items-center justify-center h-full p-12">
    <UserIcon className="h-16 w-16 text-gray-300 mb-4" />
    <h3 className="text-xl font-medium text-gray-500">No people found</h3>
    <div className="text-gray-400 text-center mt-2">
      Try adjusting your search or filter criteria
    </div>
  </div>
);

// Loading overlay component
const LoadingOverlayComponent = () => (
  <div className="flex flex-col items-center justify-center h-full p-12">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
    <div className="text-gray-500 mt-4">Loading people...</div>
  </div>
);

export default function PeopleAgGrid({
  people,
  onPersonDeleted,
  onPersonEdit,
  onPersonView,
}: PeopleAgGridProps) {
  const [gridApi, setGridApi] = useState<any>(null);
  const [rowData, setRowData] = useState<Person[]>([]);
  const [filterText, setFilterText] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  // Update row data when people prop changes
  useEffect(() => {
    setRowData(people);
    setFilteredPeople(people);
  }, [people]);

  // Filter people based on quick filter text
  useEffect(() => {
    if (!filterText.trim()) {
      setFilteredPeople(rowData);
      return;
    }
    
    const searchTerm = filterText.toLowerCase();
    const filtered = rowData.filter(person => {
      // Search in name
      if (person.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search in email
      if (person.email?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in phone
      if (person.phone?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in type
      if (person.type?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in role
      if (person.role?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in associations
      if (person.associations) {
        // Search in properties
        if (person.associations.properties?.some(p => 
          p.address.toLowerCase().includes(searchTerm)
        )) return true;
        
        // Search in groups
        if (person.associations.groups?.some(g => 
          g.name.toLowerCase().includes(searchTerm)
        )) return true;
      }
      
      return false;
    });
    
    setFilteredPeople(filtered);
  }, [rowData, filterText]);

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Name",
        field: "name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
        cellRenderer: NameCellRenderer,
        headerClass: 'ag-header-cell-padded',
        cellClass: 'ag-cell-padded',
      },
      {
        headerName: "Contact",
        field: "contact",
        cellRenderer: ContactCellRenderer,
        flex: 1,
        minWidth: 180,
        valueGetter: (params) => params.data,
        headerClass: 'ag-header-cell-padded',
        cellClass: 'ag-cell-padded',
      },
      {
        headerName: "Type",
        field: "type",
        cellRenderer: BadgeCellRenderer,
        sortable: true,
        filter: true,
        width: 120,
        headerClass: 'ag-header-cell-padded',
        cellClass: 'ag-cell-padded',
      },
      {
        headerName: "Role",
        field: "role",
        cellRenderer: BadgeCellRenderer,
        sortable: true,
        filter: true,
        width: 140,
        headerClass: 'ag-header-cell-padded',
        cellClass: 'ag-cell-padded',
      },
      {
        headerName: "Associations",
        field: "associations",
        cellRenderer: AssociationsCellRenderer,
        flex: 1,
        minWidth: 150,
        headerClass: 'ag-header-cell-padded',
        cellClass: 'ag-cell-padded',
      },
      {
        headerName: "",
        field: "actions",
        cellRenderer: ActionsCellRenderer,
        width: 100,
        sortable: false,
        filter: false,
        pinned: "right",
        headerClass: 'ag-header-cell-padded',
        cellClass: 'ag-cell-padded',
      },
    ],
    []
  );

  // Default column definitions
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      suppressMovable: false,
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }),
    []
  );

  // Grid ready event handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    
    // Auto-size columns to fit the available width
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 0);

    // Set default sorting by name
    params.api.applyColumnState({
      state: [
        {
          colId: 'name',
          sort: 'asc'
        }
      ]
    });
  }, []);

  // Handle filter changes
  const onFilterTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
    },
    []
  );

  // Clear filter
  const clearFilter = useCallback(() => {
    setFilterText("");
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

  // Handle delete person
  const handleDeletePerson = useCallback(
    (id: string) => {
      setPersonToDelete(id);
      setShowDeleteDialog(true);
    },
    []
  );

  // Confirm delete person
  const confirmDeletePerson = useCallback(async () => {
    if (personToDelete) {
      try {
        await deletePerson(personToDelete);
        onPersonDeleted(personToDelete);
      } catch (error) {
        console.error("Failed to delete person:", error);
      }
      setShowDeleteDialog(false);
      setPersonToDelete(null);
    }
  }, [personToDelete, onPersonDeleted]);

  // Cancel delete person
  const cancelDeletePerson = useCallback(() => {
    setShowDeleteDialog(false);
    setPersonToDelete(null);
  }, []);

  // Context for cell renderers
  const context = useMemo(
    () => ({
      onEdit: onPersonEdit,
      onDelete: handleDeletePerson,
      onView: onPersonView,
    }),
    [onPersonEdit, handleDeletePerson, onPersonView]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search people..."
            value={filterText}
            onChange={onFilterTextChange}
            className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
          {filterText && (
            <button
              onClick={clearFilter}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="h-[550px] ag-theme-custom">
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
          
          .ag-theme-custom .ag-paging-button.ag-disabled {
            opacity: 0.5;
            cursor: default;
          }
          
          .ag-theme-custom .ag-paging-description {
            font-size: 14px;
          }
        `}</style>
        <AgGridReact
          rowData={filteredPeople}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          context={context}
          suppressRowClickSelection={true}
          animateRows={true}
          noRowsOverlayComponent={NoRowsOverlayComponent}
          loadingOverlayComponent={LoadingOverlayComponent}
          rowHeight={70}
          headerHeight={56}
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
          className={`${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : ''}`}
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              person and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeletePerson}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePerson}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
