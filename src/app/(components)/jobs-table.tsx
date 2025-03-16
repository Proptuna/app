"use client"

import React from "react";
import { Badge } from "@/components/ui/badge";

interface Property {
  address: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  type: string;
  owner?: string;
  manager?: string;
  image?: string;
}

interface Contact {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Job {
  id: string;
  state: string;
  overview: string;
  date: string;
  property?: Property;
  person?: Contact;
  conversation?: Array<{ sender: string; message: string; timestamp: string }>;
  tasks?: Array<{
    id: string;
    description: string;
    status: string;
    created: string;
    createdBy: string;
    notified: string[];
  }>;
  documents?: Array<{ title: string; type: string }>;
  isLive?: boolean;
  needsAttention?: boolean;
  suggestedAction?: string;
}

interface JobsTableProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

export function JobsTable({ jobs, onJobClick }: JobsTableProps) {
  const getStateBadge = (state: string) => {
    switch (state) {
      case "task created":
        return (
          <Badge
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Task Created
          </Badge>
        );

      case "chat ended":
        return (
          <Badge
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            Chat Ended
          </Badge>
        );

      case "Attention needed!":
        return (
          <Badge
            className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          >
            Attention Needed!
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            {state}
          </Badge>
        );
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <table className="w-full">
        <thead>
          <tr
            className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700"
          >
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              State
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Overview
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {jobs.map((job, index) => (
            <tr
              key={job.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
              onClick={() => onJobClick(job)}
              id={`c3hzmz_${index}`}
            >
              <td
                className="px-6 py-4 whitespace-nowrap"
                id={`eeles4_${index}`}
              >
                {getStateBadge(job.state)}
              </td>
              <td className="px-6 py-4" id={`mz58rz_${index}`}>
                <div
                  className="text-sm text-gray-900 dark:text-gray-200"
                  id={`p00nvg_${index}`}
                >
                  {job.overview}
                </div>
                {job.property && (
                  <div
                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                    id={`ci6lpc_${index}`}
                  >
                    {job.property.address}
                    {job.property.unit && `, Unit ${job.property.unit}`}
                  </div>
                )}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                id={`zx1say_${index}`}
              >
                <div
                  className="text-sm text-gray-500 dark:text-gray-400"
                  id={`053tsl_${index}`}
                >
                  {job.date}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
