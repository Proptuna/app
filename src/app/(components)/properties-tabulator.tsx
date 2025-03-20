"use client"

import { useEffect, useState, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import type { RowComponent, CellComponent } from 'tabulator-tables';
import { Tag, Users, FileText, MoreHorizontal, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Property } from '@/types/property';

// Do not import Tabulator CSS here - we'll use our custom styling only
// import 'tabulator-tables/dist/css/tabulator.min.css';

interface PropertiesTabulatorProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onAddDoc: (property: Property) => void;
  onAddEscalationPolicy: (property: Property) => void;
  isLoading?: boolean;
}

export default function PropertiesTabulator({
  properties,
  onPropertyClick,
  onAddDoc,
  onAddEscalationPolicy,
  isLoading = false,
}: PropertiesTabulatorProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [isGrouped, setIsGrouped] = useState(false);
  const tabulatorInitialized = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle grouping by tag
  const toggleGrouping = () => {
    if (!tabulator) return;
    
    if (isGrouped) {
      tabulator.setGroupBy(""); // Use empty string instead of false
    } else {
      tabulator.setGroupBy("tag");
      tabulator.setGroupHeader((value: any, count: number) => {
        return `<div class="flex items-center p-2">
          <span class="text-indigo-600 dark:text-indigo-400 font-medium">${value || 'No Tag'}</span>
          <span class="ml-2 text-gray-500 dark:text-gray-400">(${count} properties)</span>
        </div>`;
      });
    }
    
    setIsGrouped(!isGrouped);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (tabulator) {
      if (value) {
        // Use setFilter method with type assertion
        (tabulator as any).setFilter([
          { field: "address", type: "like", value: value },
          { field: "city", type: "like", value: value },
          { field: "state", type: "like", value: value },
          { field: "zip", type: "like", value: value },
          { field: "type", type: "like", value: value },
          { field: "tag", type: "like", value: value },
        ], "or");
      } else {
        // Use clearFilter method with type assertion
        (tabulator as any).clearFilter();
      }
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    if (tabulator) {
      // Use clearFilter method with type assertion
      (tabulator as any).clearFilter();
    }
  };

  // Clean up Tabulator instance when component unmounts
  useEffect(() => {
    return () => {
      if (tabulator) {
        tabulator.destroy();
      }
    };
  }, [tabulator]);

  // Initialize Tabulator
  useEffect(() => {
    // Only initialize once and when not loading
    if (tableRef.current && !tabulatorInitialized.current && !isLoading) {
      console.log("Initializing Tabulator with properties:", properties);
      
      // Format address with unit if available
      const formatAddress = (cell: CellComponent) => {
        const property = cell.getData() as Property;
        let address = property.address || '';
        if (property.unit) {
          address += `, Unit ${property.unit}`;
        }
        if (property.city && property.state) {
          address += `<br/>${property.city}, ${property.state} ${property.zip || ''}`;
        }
        return `<div class="flex flex-col">
          <span class="font-medium">${address}</span>
        </div>`;
      };

      // Format type
      const formatType = (cell: CellComponent) => {
        const value = cell.getValue() as string;
        return `<div class="flex items-center">
          <span class="font-medium">${value || 'Unknown'}</span>
        </div>`;
      };

      // Format tenants as chips
      const formatTenants = (cell: CellComponent) => {
        const property = cell.getData() as Property;
        const tenants = property.tenants || [];
        
        if (tenants.length === 0) {
          return `<div class="tenant-chips flex flex-wrap gap-1">
            <span class="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">+ Add tenant</span>
          </div>`;
        }
        
        let html = '<div class="tenant-chips flex flex-wrap gap-1">';
        
        tenants.forEach((tenant, index) => {
          html += `<div class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <span class="tenant-name">${tenant.name || 'Unnamed'}</span>
            <button class="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 delete-tenant" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>`;
        });
        
        html += `<span class="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 add-tenant">+ Add</span>`;
        html += '</div>';
        
        return html;
      };

      // Format documents as chips
      const formatDocuments = (cell: CellComponent) => {
        const property = cell.getData() as Property;
        const documents = property.documents || [];
        
        if (documents.length === 0) {
          return `<div class="document-chips flex flex-wrap gap-1">
            <span class="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 add-doc-btn">+ Add document</span>
          </div>`;
        }
        
        let html = '<div class="document-chips flex flex-wrap gap-1">';
        
        documents.forEach((doc, index) => {
          html += `<div class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <span class="document-name">${doc.name || 'Unnamed'}</span>
            <button class="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 delete-document" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>`;
        });
        
        html += `<span class="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 add-doc-btn">+ Add</span>`;
        html += '</div>';
        
        return html;
      };

      // Format tag
      const formatTag = (cell: CellComponent) => {
        const value = cell.getValue() as string;
        if (!value) {
          return '<span class="text-gray-400">No tag</span>';
        }
        
        return `<div class="flex items-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            ${value}
          </span>
        </div>`;
      };

      // Format actions
      const formatActions = (cell: CellComponent) => {
        return `<div class="flex items-center space-x-2">
          <button class="add-escalation-btn p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Add Escalation Policy">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
          <div class="more-btn relative">
            <button class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="More Actions">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </button>
          </div>
        </div>`;
      };

      // Empty placeholder
      const emptyPlaceholder = () => {
        return `<div class="flex flex-col items-center justify-center p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-gray-300 mb-4"><path d="M21 9V6a2 2 0 0 0-2-2H9l-3-3H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-3"></path><path d="M21 16H8a2 2 0 0 1-2-2V4"></path></svg>
          <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">No properties found</p>
          <p class="text-gray-400 dark:text-gray-500 mt-1">Add a property to get started</p>
        </div>`;
      };

      // Loading placeholder
      const loadingPlaceholder = () => {
        return `<div class="flex flex-col items-center justify-center p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">Loading properties...</p>
        </div>`;
      };

      try {
        // Define column configuration
        const columns = [
          { 
            title: "Address", 
            field: "address", 
            formatter: formatAddress, 
            headerFilter: false,
            widthGrow: 2,
            minWidth: 200,
          },
          { 
            title: "Tag", 
            field: "tag", 
            formatter: formatTag, 
            headerFilter: false,
            widthGrow: 1,
            minWidth: 120
          },
          { 
            title: "Type", 
            field: "type", 
            formatter: formatType, 
            headerFilter: false,
            widthGrow: 1,
            minWidth: 120
          },
          { 
            title: "Tenants", 
            field: "tenants", 
            formatter: formatTenants, 
            headerFilter: false,
            widthGrow: 1.5,
            minWidth: 150,
            editor: false, // We'll handle editing manually
          },
          { 
            title: "Documents", 
            field: "documents", 
            formatter: formatDocuments, 
            headerFilter: false,
            widthGrow: 1.5,
            minWidth: 150,
            editor: false, // We'll handle editing manually
          },
          { 
            title: "Actions", 
            formatter: formatActions, 
            headerFilter: false,
            hozAlign: "center",
            widthGrow: 1,
            minWidth: 100,
            headerSort: false
          },
        ];

        // Create Tabulator instance
        const table = new Tabulator(tableRef.current, {
          data: properties,
          layout: "fitColumns",
          responsiveLayout: "collapse",
          height: "550px",
          pagination: true,
          paginationSize: 10,
          movableColumns: true,
          placeholder: properties.length === 0 ? emptyPlaceholder() : "",
          columns: columns,
          rowClick: function(e: UIEvent, row: RowComponent) {
            const property = row.getData() as Property;
            onPropertyClick(property);
          },
          cellClick: function(e: UIEvent, cell: CellComponent) {
            // Handle action buttons
            const element = e.target as HTMLElement;
            const property = cell.getRow().getData() as Property;
            
            if (element.closest('.add-doc-btn')) {
              e.stopPropagation();
              onAddDoc(property);
            } else if (element.closest('.add-escalation-btn')) {
              e.stopPropagation();
              onAddEscalationPolicy(property);
            } else if (element.closest('.more-btn')) {
              e.stopPropagation();
              // Show dropdown menu
              // This is handled by the dropdown in the UI
            } else if (element.closest('.delete-tenant')) {
              e.stopPropagation();
              const index = parseInt(element.closest('.delete-tenant')?.getAttribute('data-index') || "0");
              const tenants = [...(property.tenants || [])];
              tenants.splice(index, 1);
              
              // Update the property data
              const updatedProperty = { ...property, tenants };
              // Use update method with type assertion
              (cell.getRow() as any).update(updatedProperty);
              
              // TODO: Save changes to backend
              console.log("Tenant deleted:", index, updatedProperty);
            } else if (element.closest('.delete-document')) {
              e.stopPropagation();
              const index = parseInt(element.closest('.delete-document')?.getAttribute('data-index') || "0");
              const documents = [...(property.documents || [])];
              documents.splice(index, 1);
              
              // Update the property data
              const updatedProperty = { ...property, documents };
              // Use update method with type assertion
              (cell.getRow() as any).update(updatedProperty);
              
              // TODO: Save changes to backend
              console.log("Document deleted:", index, updatedProperty);
            } else if (element.closest('.add-tenant')) {
              e.stopPropagation();
              // TODO: Show tenant autocomplete
              const tenants = [...(property.tenants || [])];
              // Add a new tenant with required properties from Tenant interface
              tenants.push({ 
                name: "New Tenant", 
                id: Date.now().toString(),
                email: "",
                phone: ""
              });
              
              // Update the property data
              const updatedProperty = { ...property, tenants };
              // Use update method with type assertion
              (cell.getRow() as any).update(updatedProperty);
              
              // TODO: Save changes to backend
              console.log("Tenant added:", updatedProperty);
            }
          },
          initialSort: [
            { column: "address", dir: "asc" }
          ],
        });

        // Save the Tabulator instance
        setTabulator(table);
        tabulatorInitialized.current = true;

        // Apply grouping if needed
        if (isGrouped) {
          table.setGroupBy("tag");
          table.setGroupHeader((value: any, count: number) => {
            return `<div class="flex items-center p-2">
              <span class="text-indigo-600 dark:text-indigo-400 font-medium">${value || 'No Tag'}</span>
              <span class="ml-2 text-gray-500 dark:text-gray-400">(${count} properties)</span>
            </div>`;
          });
        }
      } catch (error) {
        console.error("Error initializing Tabulator:", error);
      }
    }
  }, [properties, onPropertyClick, onAddDoc, onAddEscalationPolicy, isLoading, isGrouped]);

  // Update table data when properties change
  useEffect(() => {
    if (tabulator && tabulatorInitialized.current && !isLoading) {
      console.log("Updating table data with properties:", properties);
      tabulator.setData(properties);
    }
  }, [properties, tabulator, isLoading]);

  return (
    <div className="w-full rounded-md overflow-hidden shadow-sm bg-white dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading properties...</div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </div>
            )}
          </div>
          <Button
            variant={isGrouped ? "default" : "outline"}
            size="sm"
            onClick={toggleGrouping}
            className="flex items-center"
            disabled={isLoading || !tabulator}
          >
            <Tag className="h-4 w-4 mr-2" />
            {isGrouped ? "Ungroup" : "Group by Tag"}
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search properties by address, city, state, type, or tag..."
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button 
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <style jsx global>{`
          /* Base Tabulator Styles */
          .tabulator {
            position: relative;
            border: none;
            background-color: transparent;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            border-radius: 0.5rem;
            overflow: hidden;
            font-size: 14px;
          }
          
          .tabulator .tabulator-header {
            position: relative;
            box-sizing: border-box;
            width: 100%;
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 600;
            color: #374151;
            padding: 0.75rem 0;
            white-space: nowrap;
            overflow: visible;
            text-overflow: ellipsis;
          }
          
          .tabulator-dark .tabulator-header {
            background-color: #1f2937;
            border-bottom: 1px solid #374151;
            color: #e5e7eb;
          }
          
          .tabulator .tabulator-header .tabulator-col {
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            padding: 12px;
            border-right: none;
            background-color: transparent;
            text-align: left;
            vertical-align: bottom;
            overflow: hidden;
          }
          
          .tabulator .tabulator-header .tabulator-col-content {
            box-sizing: border-box;
            position: relative;
            padding: 8px 4px;
          }
          
          .tabulator .tabulator-header .tabulator-col .tabulator-col-title {
            box-sizing: border-box;
            width: 100%;
            font-weight: 600;
            color: #4b5563;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: bottom;
          }
          
          .tabulator-dark .tabulator-col-title {
            color: #d1d5db;
          }
          
          .tabulator .tabulator-tableHolder {
            position: relative;
            width: 100%;
            white-space: nowrap;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .tabulator .tabulator-tableHolder .tabulator-table {
            position: relative;
            display: inline-block;
            background-color: transparent;
            white-space: nowrap;
            overflow: visible;
            color: #374151;
          }
          
          .tabulator-dark .tabulator-tableHolder .tabulator-table {
            color: #e5e7eb;
          }
          
          .tabulator .tabulator-row {
            position: relative;
            box-sizing: border-box;
            min-height: 46px;
            border-bottom: 1px solid #f3f4f6;
            padding: 0;
            transition: background-color 0.2s ease;
          }
          
          .tabulator-dark .tabulator-row {
            border-bottom: 1px solid #1f2937;
            background-color: #111827;
            color: #e5e7eb;
          }
          
          .tabulator .tabulator-row.tabulator-row-even {
            background-color: #ffffff;
          }
          
          .tabulator-dark .tabulator-row.tabulator-row-even {
            background-color: #111827;
          }
          
          .tabulator .tabulator-row.tabulator-row-odd {
            background-color: #f9fafb;
          }
          
          .tabulator-dark .tabulator-row.tabulator-row-odd {
            background-color: #1a202c;
          }
          
          .tabulator .tabulator-row.tabulator-selected {
            background-color: rgba(79, 70, 229, 0.1) !important;
          }
          
          .tabulator-dark .tabulator-row.tabulator-selected {
            background-color: rgba(79, 70, 229, 0.2) !important;
          }
          
          .tabulator .tabulator-row:hover {
            background-color: #f3f4f6 !important;
            cursor: pointer;
          }
          
          .tabulator-dark .tabulator-row:hover {
            background-color: #1f2937 !important;
          }
          
          .tabulator .tabulator-row .tabulator-cell {
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            padding: 16px 12px;
            border-right: none;
            vertical-align: middle;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: background-color 0.2s ease;
          }
          
          /* Group styling */
          .tabulator .tabulator-row.tabulator-group {
            background-color: #f3f4f6;
            border-bottom: 1px solid #e5e7eb;
            padding: 10px 12px;
            font-weight: 600;
          }
          
          .tabulator-dark .tabulator-row.tabulator-group {
            background-color: #1f2937;
            border-bottom: 1px solid #374151;
          }
          
          .tabulator .tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow {
            color: #6366f1;
          }
          
          /* Pagination styling */
          .tabulator .tabulator-footer {
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 8px;
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
          
          .tabulator-dark .tabulator-footer {
            background-color: #1f2937;
            border-top: 1px solid #374151;
            color: #e5e7eb;
          }
          
          .tabulator .tabulator-footer .tabulator-paginator {
            font-size: 14px;
            text-align: center;
          }
          
          .tabulator .tabulator-footer .tabulator-page {
            display: inline-block;
            margin: 0 2px;
            padding: 4px 8px;
            border: 1px solid #e5e7eb;
            background-color: #ffffff;
            color: #374151;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
          
          .tabulator-dark .tabulator-footer .tabulator-page {
            border: 1px solid #374151;
            background-color: #1f2937;
            color: #e5e7eb;
          }
          
          .tabulator .tabulator-footer .tabulator-page.active {
            background-color: #6366f1;
            color: #ffffff;
            border-color: #6366f1;
          }
          
          .tabulator-dark .tabulator-footer .tabulator-page.active {
            background-color: #6366f1;
            color: #ffffff;
            border-color: #4f46e5;
          }
          
          .tabulator .tabulator-footer .tabulator-page:not(.disabled):hover {
            background-color: #f3f4f6;
            cursor: pointer;
          }
          
          .tabulator-dark .tabulator-footer .tabulator-page:not(.disabled):hover {
            background-color: #374151;
          }
          
          .tabulator .tabulator-footer .tabulator-page.active:hover {
            background-color: #4f46e5;
          }
          
          /* Chip styling */
          .tenant-chips, .document-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            align-items: center;
          }
          
          /* Loading animation */
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-[550px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Loading properties...</p>
          </div>
        ) : (
          <div ref={tableRef} className="tabulator-table"></div>
        )}
      </div>
    </div>
  );
}
