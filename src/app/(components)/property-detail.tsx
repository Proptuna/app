"use client"

import React, { useState } from "react";
import {
  ArrowLeftIcon,
  BuildingIcon,
  UserIcon,
  HomeIcon,
  FileTextIcon,
  ClockIcon,
  ShieldIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Property {
  id: string;
  name: string;
  tag: string;
  address: string;
  type: string;
  tenants: string[];
  docs: string[];
  escalationPolicy: string;
}

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
}

export function PropertyDetail({ property, onClose }: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock job history data
  const jobHistory = [
    {
      id: "job-1",
      date: "2023-06-15",
      title: "Broken dishwasher",
      status: "Completed",
    },
    {
      id: "job-2",
      date: "2023-05-22",
      title: "HVAC maintenance",
      status: "Completed",
    },
    {
      id: "job-3",
      date: "2023-04-10",
      title: "Leaking faucet",
      status: "Completed",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-right"
    >
      <header
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Properties
        </Button>
        <h2 className="text-xl font-semibold">
          {property.name !== "—" ? property.name : property.address}
        </h2>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Property info */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle
                  className="flex justify-between items-center"
                >
                  <span>Property Details</span>
                  <Badge variant="outline">
                    {property.type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <h3
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Address
                    </h3>
                    <p
                      className="text-base font-medium mt-1 flex items-center"
                    >
                      <HomeIcon
                        className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
                      />

                      {property.address}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Tag
                    </h3>
                    <p
                      className="text-base font-medium mt-1 flex items-center"
                    >
                      <BuildingIcon
                        className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
                      />

                      {property.tag !== "—" ? property.tag : "None"}
                    </p>
                  </div>

                  {property.tenants.length > 0 && (
                    <div>
                      <h3
                        className="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        Tenants
                      </h3>
                      <div className="mt-1">
                        {property.tenants.map((tenant, index) => (
                          <p
                            key={index}
                            className="flex items-center mb-1"
                            id={`dcng9o_${index}`}
                          >
                            <UserIcon
                              className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
                              id={`3ikpaw_${index}`}
                            />

                            {tenant}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {property.escalationPolicy && (
                    <div>
                      <h3
                        className="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        Escalation Policy
                      </h3>
                      <p className="text-base font-medium mt-1">
                        {property.escalationPolicy}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="jobs"
                  className="flex items-center gap-2"
                >
                  <ClockIcon className="h-4 w-4" />
                  Job History
                </TabsTrigger>
                <TabsTrigger
                  value="docs"
                  className="flex items-center gap-2"
                >
                  <FileTextIcon className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="policies"
                  className="flex items-center gap-2"
                >
                  <ShieldIcon className="h-4 w-4" />
                  Escalation Policies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h3
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Property Type
                        </h3>
                        <Badge variant="outline">
                          {property.type}
                        </Badge>
                      </div>

                      <div>
                        <h3
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Tag Assignment
                        </h3>
                        <p>
                          {property.tag !== "—" ? property.tag : "None"}
                        </p>
                      </div>

                      <Button variant="outline">
                        Edit Property Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {jobHistory.length > 0 ? (
                      <div className="space-y-4">
                        {jobHistory.map((job, index) => (
                          <div
                            key={job.id}
                            className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            id={`7sdfci_${index}`}
                          >
                            <div id={`92mowt_${index}`}>
                              <p className="font-medium" id={`mum47e_${index}`}>
                                {job.title}
                              </p>
                              <p
                                className="text-sm text-gray-500 dark:text-gray-400"
                                id={`i664wb_${index}`}
                              >
                                {job.date}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              id={`cb9n10_${index}`}
                            >
                              {job.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-center text-gray-500 dark:text-gray-400 py-8"
                      >
                        No job history available for this property.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="docs" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {property.docs.length > 0 ? (
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {property.docs.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                            id={`gn22r4_${index}`}
                          >
                            <FileTextIcon
                              className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3"
                              id={`p72075_${index}`}
                            />

                            <div id={`4qguk1_${index}`}>
                              <div
                                className="font-medium"
                                id={`l56vnp_${index}`}
                              >
                                {doc}
                              </div>
                              <div
                                className="text-sm text-gray-500 dark:text-gray-400"
                                id={`ic64tx_${index}`}
                              >
                                Document
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-center text-gray-500 dark:text-gray-400 py-8"
                      >
                        No documents available for this property.
                      </div>
                    )}

                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        Add Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {property.escalationPolicy ? (
                      <div className="space-y-4">
                        <div
                          className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <ShieldIcon
                            className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3"
                          />
                          <div>
                            <div className="font-medium">
                              {property.escalationPolicy}
                            </div>
                            <div
                              className="text-sm text-gray-500 dark:text-gray-400"
                            >
                              Escalation Policy
                            </div>
                          </div>
                        </div>
                        <div
                          className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                        >
                          <h4 className="text-sm font-medium mb-3">
                            Policy Details
                          </h4>
                          <div className="space-y-3">
                            <div
                              className="flex items-center gap-2"
                            >
                              <span
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                1
                              </span>
                              <span className="flex-1">
                                Property Manager
                              </span>
                              <span
                                className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                              >
                                <ClockIcon
                                  className="h-3 w-3 mr-1"
                                />
                                15 min
                              </span>
                            </div>
                            <div
                              className="flex items-center gap-2"
                            >
                              <span
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                2
                              </span>
                              <span className="flex-1">
                                Maintenance Team
                              </span>
                              <span
                                className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                              >
                                <ClockIcon
                                  className="h-3 w-3 mr-1"
                                />
                                30 min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="text-center text-gray-500 dark:text-gray-400 py-8"
                      >
                        No escalation policy set for this property.
                      </div>
                    )}

                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <ShieldIcon className="h-4 w-4 mr-2" />
                        {property.escalationPolicy ? "Edit" : "Add"} Escalation
                        Policy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Additional info */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full">
                    Create New Job
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add Tenant
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add Document
                  </Button>
                  {!property.escalationPolicy && (
                    <Button variant="outline" className="w-full">
                      Set Escalation Policy
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Total Jobs
                    </p>
                    <p className="text-2xl font-bold">
                      {jobHistory.length}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Tenants
                    </p>
                    <p className="text-2xl font-bold">
                      {property.tenants.length}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Documents
                    </p>
                    <p className="text-2xl font-bold">
                      {property.docs.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
