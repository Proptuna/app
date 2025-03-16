"use client"

import React from "react";
import {
  HomeIcon,
  MessageSquareIcon,
  BuildingIcon,
  UsersIcon,
} from "lucide-react";

interface SidebarProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

export function Sidebar({ setCurrentPage, currentPage }: SidebarProps) {
  const navItems = [
    { id: "jobs", label: "Jobs", icon: HomeIcon },
    { id: "ai", label: "AI", icon: MessageSquareIcon },
    { id: "properties", label: "Properties", icon: BuildingIcon },
    { id: "users", label: "Users", icon: UsersIcon },
  ];

  return (
    <div
      className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <h1
          className="text-xl font-semibold text-gray-800 dark:text-white"
        >
          Proptuna
        </h1>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item, index) => (
            <li key={item.id} id={`qw7hn4_${index}`}>
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  currentPage === item.id
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                id={`yzh6yr_${index}`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    currentPage === item.id
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  id={`1kysxh_${index}`}
                />

                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
