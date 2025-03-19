"use client"

import "./globals.css";

import React, { useState } from "react";
import Layout from "pages/layout";
import JobsPage from "pages/jobs-page";
import AIPage from "pages/ai-page";
import PropertiesPage from "pages/properties-page";
import PeoplePage from "pages/people-page";
import AccountPage from "pages/account-page";
import DocumentsPage from "pages/documents-page";
import { Analytics } from "@vercel/analytics/react"

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
      case "people":
        return <PeoplePage />;
      case "documents":
        return <DocumentsPage />;
      case "account":
        return <AccountPage />;
      default:
        return <AIPage/>;
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
    <Analytics />
    </body>
  </html>
)
}
