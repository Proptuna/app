"use client"

import "./globals.css";

import React, { useState } from "react";
import Layout from "pages/layout";
import JobsPage from "pages/jobs-page";
import AIPage from "pages/ai-page";
import PropertiesPage from "pages/properties-page";
import UsersPage from "pages/users-page";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("jobs");

  const renderPage = () => {
    switch (currentPage) {
      case "jobs":
        return <JobsPage />;
      case "ai":
        return <AIPage />;
      case "properties":
        return <PropertiesPage />;
      case "users":
        return <UsersPage />;
      default:
        return <JobsPage />;
    }
  };

  return (
  <html lang="en">
    <body>
      <Layout
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
    >
      {renderPage()}
    </Layout>
    </body>
  </html>
)
}
