"use client"

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { 
  ColDef, 
  GridReadyEvent, 
  GridApi
} from "ag-grid-community";
import { Search, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./data-table-styles.css"; // Import the custom styles

export interface DataTableProps<T> {
  data: T[];
  columnDefs: ColDef[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  isLoading?: boolean;
  noRowsMessage?: string;
  loadingMessage?: string;
  height?: string | number;
  rowHeight?: number;
  headerHeight?: number;
  pagination?: boolean;
  paginationPageSize?: number;
  paginationAutoPageSize?: boolean;
  context?: any;
  actionButtons?: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  hideSearch?: boolean;
  defaultColDef?: any;
}

export function DataTable<T>({
  data,
  columnDefs,
  onSearch,
  searchPlaceholder = "Search...",
  searchQuery = "",
  isLoading = false,
  noRowsMessage = "No data found",
  loadingMessage = "Loading data...",
  height = "600px",
  rowHeight = 70,
  headerHeight = 56,
  pagination = true,
  paginationPageSize = 10,
  paginationAutoPageSize = false,
  context = {},
  actionButtons,
  className = "",
  headerContent,
  hideSearch = false,
  defaultColDef: customDefaultColDef,
}: DataTableProps<T>) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const gridRef = useRef<AgGridReact>(null);
  const [quickFilterText, setQuickFilterText] = useState(searchQuery);

  useEffect(() => {
    setQuickFilterText(searchQuery);
  }, [searchQuery]);

  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    
    // Auto-size columns to fit the available width
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 0);
    
    // Set default sorting by date (newest first) if there's a date column
    const columnApi = (params as any).columnApi;
    if (columnApi) {
      const dateColumn = columnApi.getColumn('date');
      if (dateColumn) {
        columnApi.applyColumnState({
          state: [
            {
              colId: 'date',
              sort: 'desc'
            }
          ]
        });
      }
    }
  }, []);

  // Show loading overlay when loading
  useEffect(() => {
    if (gridApi) {
      if (isLoading) {
        gridApi.showLoadingOverlay();
      } else if (!data || data.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, isLoading, data]);

  // Handle quick filter text change
  const onFilterTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuickFilterText(value);
    if (onSearch) {
      onSearch(value);
    } else if (gridApi) {
      // Use the filterModel approach instead of setQuickFilter
      gridApi.setFilterModel({
        _quickFilter: { filter: value }
      });
    }
  }, [gridApi, onSearch]);

  // Clear search text
  const clearSearch = useCallback(() => {
    setQuickFilterText("");
    if (onSearch) {
      onSearch("");
    } else if (gridApi) {
      // Clear the filter model
      gridApi.setFilterModel(null);
    }
  }, [gridApi, onSearch]);

  // Handle window resize to adjust grid size
  useEffect(() => {
    if (!gridApi) return;
    
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

  // Default column definitions
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    },
    ...customDefaultColDef
  }), [customDefaultColDef]);

  // No rows overlay component
  const noRowsOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{noRowsMessage}</div>
        <div className="text-gray-500 text-center">
          {quickFilterText ? 
            "Try adjusting your search query" : 
            "No data is available at this time"}
        </div>
      </div>
    );
  }, [quickFilterText, noRowsMessage]);
  
  // Loading overlay component
  const loadingOverlayComponent = useMemo(() => {
    return () => (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <div className="text-gray-500 mt-4">{loadingMessage}</div>
      </div>
    );
  }, [loadingMessage]);

  // Render search input
  const renderSearchInput = () => (
    <div className="relative flex-1 bg-white dark:bg-gray-800">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={searchPlaceholder}
        value={quickFilterText}
        onChange={onFilterTextChange}
        className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
      />
      {quickFilterText && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        {!hideSearch && renderSearchInput()}
        
        {headerContent && (
          <div className={`${!hideSearch ? 'ml-3' : 'flex-1'}`}>
            {headerContent}
          </div>
        )}
        
        {actionButtons && (
          <div className={`${!hideSearch ? 'ml-3' : 'flex-1'}`}>
            {actionButtons}
          </div>
        )}
      </div>
      <div className={`ag-theme-custom ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : ''}`} style={{ height, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows={true}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          paginationAutoPageSize={paginationAutoPageSize}
          domLayout="normal"
          noRowsOverlayComponent={noRowsOverlayComponent}
          loadingOverlayComponent={loadingOverlayComponent}
          context={context}
          rowSelection="multiple"
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          suppressCellFocus={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          suppressMenuHide={false}
        />
      </div>
    </div>
  );
}
