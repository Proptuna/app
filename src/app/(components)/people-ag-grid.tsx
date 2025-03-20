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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(data.id)}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
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
  );
};

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

  // Update row data when people prop changes
  useEffect(() => {
    setRowData(people);
  }, [people]);

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
      },
      {
        headerName: "Contact",
        field: "contact",
        cellRenderer: ContactCellRenderer,
        flex: 1,
        minWidth: 180,
        valueGetter: (params) => params.data,
      },
      {
        headerName: "Type",
        field: "type",
        cellRenderer: BadgeCellRenderer,
        sortable: true,
        filter: true,
        width: 120,
      },
      {
        headerName: "Role",
        field: "role",
        cellRenderer: BadgeCellRenderer,
        sortable: true,
        filter: true,
        width: 140,
      },
      {
        headerName: "Associations",
        field: "associations",
        cellRenderer: AssociationsCellRenderer,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: ActionsCellRenderer,
        width: 100,
        sortable: false,
        filter: false,
        cellRendererParams: {
          clicked: function (id: string) {
            console.log(id);
          },
        },
      },
    ],
    []
  );

  // Default column definitions
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
    }),
    []
  );

  // Grid ready event handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Handle filter changes
  const onFilterTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
      
      if (gridApi) {
        gridApi.setGridOption('quickFilterText', value);
      }
    },
    [gridApi]
  );

  // Clear filter
  const clearFilter = useCallback(() => {
    setFilterText("");
    if (gridApi) {
      gridApi.setGridOption('quickFilterText', '');
    }
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Filter people..."
            value={filterText}
            onChange={onFilterTextChange}
            className="pl-8"
          />
          {filterText && (
            <button
              onClick={clearFilter}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="ag-theme-alpine h-[600px] w-full">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowSelection="multiple"
          context={context}
          pagination={true}
          paginationPageSize={10}
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
