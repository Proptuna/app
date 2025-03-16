"use client"

import React from "react";
import { Sidebar } from "(components)/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

export default function Layout({
  children,
  setCurrentPage,
  currentPage,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
