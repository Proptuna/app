import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  MessageSquareIcon,
  BuildingIcon,
  UserIcon,
  FileTextIcon,
  SettingsIcon,
  LogOutIcon,
  SparklesIcon,
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
  const location = useLocation();

  // Function to determine if a nav item is active
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ icon: Icon, path, label }: { icon: any; path: string; label: string }) => (
    <Link to={path}>
      <div 
        className={`flex items-center px-4 py-3 ${
          isActive(path) 
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium rounded-xl shadow-sm" 
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60 rounded-xl"
        } cursor-pointer transition-all duration-200 hover:shadow-sm`}
      >
        <Icon className={`h-5 w-5 mr-3 ${isActive(path) ? "text-indigo-500 dark:text-indigo-300" : ""}`} />
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      <div className="mb-8 flex items-center py-2 px-1">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Proptuna</h1>
          <div className="ml-2 -mt-1">
            <img 
              src="/fish.svg" 
              alt="Proptuna Logo" 
              width="40" 
              height="40" 
              className="transform -rotate-12"
            />
          </div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        <NavItem icon={SparklesIcon} path="/ai-page" label="AI" />
        <NavItem icon={MessageSquareIcon} path="/ai-conversations" label="AI Conversations" />
        <NavItem icon={BuildingIcon} path="/properties-page" label="Properties" />
        <NavItem icon={UserIcon} path="/people-page" label="People" />
        <NavItem icon={FileTextIcon} path="/documents-page" label="Documents" />
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200">
              <Avatar className="h-8 w-8 mr-2 ring-2 ring-indigo-100 dark:ring-indigo-900">
                <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200">
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
              <Link to="/account-page?tab=profile" className="flex cursor-pointer items-center">
                <UserIcon className="mr-2 h-4 w-4 text-indigo-500" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account-page?tab=preferences" className="flex cursor-pointer items-center">
                <SettingsIcon className="mr-2 h-4 w-4 text-indigo-500" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={onLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
