"use client"

import React from "react";
import {
  HomeIcon,
  MessageSquareIcon,
  BuildingIcon,
  UserIcon,
  FileTextIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
  userProfile?: {
    name: string;
    email: string;
    imageUrl: string;
    authProvider: string;
  };
  onLogout?: () => void;
}

export function Sidebar({
  setCurrentPage,
  currentPage,
  userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "https://github.com/yusufhilmi.png",
    authProvider: "google",
  },
  onLogout = () => console.log("Logout clicked"),
}: SidebarProps) {
  const navItems = [
    { id: "ai", label: "AI", icon: MessageSquareIcon },
    { id: "jobs", label: "Jobs", icon: HomeIcon },
    { id: "properties", label: "Properties", icon: BuildingIcon },
    { id: "people", label: "People", icon: UserIcon },
    { id: "documents", label: "Documents", icon: FileTextIcon },
  ];

  return (
    <div
      className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
    >
      <div className="p-6">
        <h1
          className="text-xl font-semibold text-gray-800 dark:text-white"
        >
          Proptuna
        </h1>
      </div>
      <nav className="mt-6 flex-1">
        <ul>
          {navItems.map((item, index) => (
            <li key={item.id} id={`rhc3l5_${index}`}>
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  currentPage === item.id
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                id={`2imytk_${index}`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    currentPage === item.id
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  id={`78glwe_${index}`}
                />

                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center w-full px-4 py-2 text-left rounded-lg ${
                currentPage === "account"
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage
                  src={userProfile.imageUrl}
                  alt={userProfile.name}
                />

                <AvatarFallback>
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-medium text-sm">
                  {userProfile.name}
                </span>
                <span
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  {userProfile.email}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium">
              My Account
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setCurrentPage("account")}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-600 dark:text-red-400"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
