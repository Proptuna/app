"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  userProfile?: {
    name: string;
    email: string;
    imageUrl: string;
    authProvider: string;
  };
  onLogout?: () => void;
}

export function Sidebar({
  userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "/avatar-placeholder.png",
    authProvider: "google",
  },
  onLogout = () => console.log("Logout clicked"),
}: SidebarProps) {
  const pathname = usePathname();

  // Function to determine if a nav item is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ icon: Icon, path, label }: { icon: any; path: string; label: string }) => (
    <Link href={path} passHref>
      <div 
        className={`flex items-center px-4 py-3 ${
          isActive(path) 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        } rounded-md cursor-pointer transition-colors`}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Proptuna</h1>
      </div>

      <nav className="space-y-1 flex-1">
        <NavItem icon={MessageSquareIcon} path="/ai-conversations-page" label="AI Conversations" />
        <NavItem icon={HomeIcon} path="/ai-page" label="AI" />
        <NavItem icon={BuildingIcon} path="/properties-page" label="Properties" />
        <NavItem icon={UserIcon} path="/people-page" label="People" />
        <NavItem icon={FileTextIcon} path="/documents-page" label="Documents" />
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
                <AvatarFallback>
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{userProfile.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile.email}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/account-page" className="cursor-pointer">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
