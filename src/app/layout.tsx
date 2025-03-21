"use client"

import "./globals.css";

import React from "react";
import { Analytics } from "@vercel/analytics/react"
import { Sidebar } from "./(components)/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 overflow-auto p-6 md:p-8">
            <main className="mx-auto max-w-7xl">
              {children}
            </main>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
