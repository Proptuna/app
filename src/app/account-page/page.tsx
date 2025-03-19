"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserIcon,
  BuildingIcon,
  SettingsIcon,
  SaveIcon,
  UploadIcon,
  CreditCardIcon,
  ShieldIcon,
  GlobeIcon,
  LogOutIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");

  // Mock user data
  const [userSettings, setUserSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    role: "admin",
    imageUrl: "https://github.com/yusufhilmi.png",
    authProvider: "google", // could be 'google', 'github', 'email', etc.
  });

  // Mock organization data
  const [organizationSettings, setOrganizationSettings] = useState({
    name: "Proptuna Inc.",
    slug: "proptuna",
    primaryDomain: "proptuna.com",
    status: "active",
    subscriptionTier: "professional",
    imageUrl: "https://github.com/polymet-ai.png",
  });

  // Mock organization members
  const [organizationMembers, setOrganizationMembers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "owner",
      imageUrl: "https://github.com/yusufhilmi.png",
      joinedAt: "2023-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "admin",
      imageUrl: "https://github.com/furkanksl.png",
      joinedAt: "2023-02-20",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "member",
      imageUrl: "",
      joinedAt: "2023-03-10",
    },
  ]);

  const handleOrganizationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setOrganizationSettings({
      ...organizationSettings,
      [field]: e.target.value,
    });
  };

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    setUserSettings({
      ...userSettings,
      [field]: e.target.value,
    });
  };

  const handleSelectChange = (
    value: string,
    field: string,
    settingsType: "organization" | "user",
  ) => {
    if (settingsType === "organization") {
      setOrganizationSettings({
        ...organizationSettings,
        [field]: value,
      });
    } else {
      setUserSettings({
        ...userSettings,
        [field]: value,
      });
    }
  };

  const handleSaveSettings = (settingsType: "organization" | "user") => {
    if (settingsType === "organization") {
      console.log("Saving organization settings:", organizationSettings);
    } else {
      console.log("Saving user settings:", userSettings);
    }
    // In a real app, this would save the settings to the database
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // In a real app, this would call the authentication signOut method
  };

  const handleAddMember = () => {
    if (newMemberEmail && newMemberRole) {
      const newMember = {
        id: (organizationMembers.length + 1).toString(),
        name: newMemberEmail.split("@")[0], // Just for demo
        email: newMemberEmail,
        role: newMemberRole,
        imageUrl: "",
        joinedAt: new Date().toISOString().split("T")[0],
      };

      setOrganizationMembers([...organizationMembers, newMember]);
      setNewMemberEmail("");
      setNewMemberRole("member");
      setShowAddMemberDialog(false);
    }
  };

  const handleRemoveMember = () => {
    if (memberToRemove) {
      setOrganizationMembers(
        organizationMembers.filter((member) => member.id !== memberToRemove),
      );
      setMemberToRemove(null);
      setShowRemoveMemberDialog(false);
    }
  };

  const confirmRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId);
    setShowRemoveMemberDialog(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "member":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getAuthProviderIcon = () => {
    return (
      <svg
        className="h-5 w-5 text-red-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Account Settings
        </h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOutIcon className="h-4 w-4" />
          Log out
        </Button>
      </div>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2"
          >
            <UserIcon className="h-4 w-4" />
            User Profile
          </TabsTrigger>
          <TabsTrigger
            value="organization"
            className="flex items-center gap-2"
          >
            <BuildingIcon className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div
                  className="flex flex-col items-center space-y-4 md:w-1/3"
                >
                  <Avatar
                    className="h-32 w-32 border-2 border-gray-200 dark:border-gray-700"
                  >
                    <AvatarImage
                      src={userSettings.imageUrl}
                      alt={userSettings.name}
                    />

                    <AvatarFallback>
                      {userSettings.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>

                  <div
                    className="w-full mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <h3
                      className="font-medium mb-2 flex items-center"
                    >
                      <ShieldIcon className="h-4 w-4 mr-2" />
                      Authentication
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getAuthProviderIcon()}
                      <span className="text-sm">
                        Signed in with{" "}
                        {userSettings.authProvider.charAt(0).toUpperCase() +
                          userSettings.authProvider.slice(1)}
                      </span>
                    </div>
                    <Badge
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 md:w-2/3">
                  <div className="grid gap-2">
                    <Label htmlFor="user-name">
                      Full Name
                    </Label>
                    <Input
                      value={userSettings.name}
                      onChange={(e) => handleUserChange(e, "name")}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="user-email">
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => handleUserChange(e, "email")}
                      placeholder="john.doe@example.com"
                      disabled={userSettings.authProvider !== "email"}
                    />

                    {userSettings.authProvider !== "email" && (
                      <p className="text-xs text-muted-foreground">
                        Email is managed by your {userSettings.authProvider}{" "}
                        account and cannot be changed here.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="user-phone">
                      Phone Number
                    </Label>
                    <Input
                      value={userSettings.phone}
                      onChange={(e) => handleUserChange(e, "phone")}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="user-role">
                      Role
                    </Label>
                    <Select
                      value={userSettings.role}
                      onValueChange={(value) =>
                        handleSelectChange(value, "role", "user")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          Admin
                        </SelectItem>
                        <SelectItem value="manager">
                          Manager
                        </SelectItem>
                        <SelectItem value="maintenance">
                          Maintenance
                        </SelectItem>
                        <SelectItem value="leasing_agent">
                          Leasing Agent
                        </SelectItem>
                        <SelectItem value="support">
                          Support
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => handleSaveSettings("user")}
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div
                  className="flex flex-col items-center space-y-4 md:w-1/3"
                >
                  <Avatar
                    className="h-32 w-32 border-2 border-gray-200 dark:border-gray-700"
                  >
                    <AvatarImage
                      src={organizationSettings.imageUrl}
                      alt={organizationSettings.name}
                    />

                    <AvatarFallback>
                      {organizationSettings.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>

                  <div
                    className="w-full mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <h3
                      className="font-medium mb-2 flex items-center"
                    >
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Subscription
                    </h3>
                    <Badge
                      className="mb-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {organizationSettings.status.charAt(0).toUpperCase() +
                        organizationSettings.status.slice(1)}
                    </Badge>
                    <p
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      Tier:{" "}
                      {organizationSettings.subscriptionTier
                        .charAt(0)
                        .toUpperCase() +
                        organizationSettings.subscriptionTier.slice(1)}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      size="sm"
                    >
                      Manage Subscription
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 md:w-2/3">
                  <div className="grid gap-2">
                    <Label htmlFor="org-name">
                      Organization Name
                    </Label>
                    <Input
                      value={organizationSettings.name}
                      onChange={(e) => handleOrganizationChange(e, "name")}
                      placeholder="Proptuna Inc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="org-slug">
                      Slug
                    </Label>
                    <div className="flex items-center">
                      <span
                        className="text-gray-500 dark:text-gray-400 mr-2"
                      >
                        app.proptuna.com/
                      </span>
                      <Input
                        value={organizationSettings.slug}
                        onChange={(e) => handleOrganizationChange(e, "slug")}
                        placeholder="organization-name"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="org-domain">
                      Primary Domain
                    </Label>
                    <div className="flex items-center">
                      <GlobeIcon
                        className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
                      />
                      <Input
                        value={organizationSettings.primaryDomain}
                        onChange={(e) =>
                          handleOrganizationChange(e, "primaryDomain")
                        }
                        placeholder="yourdomain.com"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="org-status">
                      Status
                    </Label>
                    <Select
                      value={organizationSettings.status}
                      onValueChange={(value) =>
                        handleSelectChange(value, "status", "organization")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          Active
                        </SelectItem>
                        <SelectItem value="suspended">
                          Suspended
                        </SelectItem>
                        <SelectItem value="trial">
                          Trial
                        </SelectItem>
                        <SelectItem value="canceled">
                          Canceled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="org-tier">
                      Subscription Tier
                    </Label>
                    <Select
                      value={organizationSettings.subscriptionTier}
                      onValueChange={(value) =>
                        handleSelectChange(
                          value,
                          "subscriptionTier",
                          "organization",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">
                          Free
                        </SelectItem>
                        <SelectItem value="basic">
                          Basic
                        </SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => handleSaveSettings("organization")}
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between"
            >
              <CardTitle>Organization Members</CardTitle>
              <Button
                onClick={() => setShowAddMemberDialog(true)}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizationMembers.map((member, index) => (
                    <TableRow key={member.id} id={`4giuva_${index}`}>
                      <TableCell
                        className="flex items-center gap-3"
                        id={`txhcd5_${index}`}
                      >
                        <Avatar className="h-8 w-8" id={`3gc3b6_${index}`}>
                          {member.imageUrl ? (
                            <AvatarImage
                              src={member.imageUrl}
                              alt={member.name}
                              id={`yyrges_${index}`}
                            />
                          ) : (
                            <AvatarFallback id={`o0zl8j_${index}`}>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div id={`tjp0j7_${index}`}>
                          <div className="font-medium" id={`giguk7_${index}`}>
                            {member.name}
                          </div>
                          <div
                            className="text-sm text-muted-foreground"
                            id={`mlpxue_${index}`}
                          >
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell id={`riaydf_${index}`}>
                        <Badge
                          className={getRoleBadgeColor(member.role)}
                          id={`4mqzlg_${index}`}
                        >
                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell id={`rftok1_${index}`}>
                        {member.joinedAt}
                      </TableCell>
                      <TableCell className="text-right" id={`uerwid_${index}`}>
                        {member.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            id={`am45et_${index}`}
                          >
                            <TrashIcon
                              className="h-4 w-4"
                              id={`dgy1ma_${index}`}
                            />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <h3
                    className="text-lg font-medium mb-4 flex items-center"
                  >
                    <ShieldIcon
                      className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
                    />
                    Security Settings
                  </h3>

                  {userSettings.authProvider === "email" ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">
                          Change Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="New password"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Button variant="outline" className="mt-2">
                        Update Password
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div
                        className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        {getAuthProviderIcon()}
                        <div>
                          <p className="font-medium">
                            Signed in with{" "}
                            {userSettings.authProvider.charAt(0).toUpperCase() +
                              userSettings.authProvider.slice(1)}
                          </p>
                          <p
                            className="text-sm text-muted-foreground"
                          >
                            Password management is handled by your{" "}
                            {userSettings.authProvider} account
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <h3 className="text-lg font-medium mb-4">
                    Notification Preferences
                  </h3>

                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between"
                    >
                      <Label
                        htmlFor="email-notif"
                        className="flex-1"
                      >
                        Email Notifications
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder="Select option"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All notifications
                          </SelectItem>
                          <SelectItem value="important">
                            Important only
                          </SelectItem>
                          <SelectItem value="none">
                            None
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor="sms-notif" className="flex-1">
                        SMS Notifications
                      </Label>
                      <Select defaultValue="important">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder="Select option"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All notifications
                          </SelectItem>
                          <SelectItem value="important">
                            Important only
                          </SelectItem>
                          <SelectItem value="none">
                            None
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog
        open={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Organization Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member-email">
                Email address
              </Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-role">
                Role
              </Label>
              <Select
                value={newMemberRole}
                onValueChange={setNewMemberRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    Admin
                  </SelectItem>
                  <SelectItem value="member">
                    Member
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMemberDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <Dialog
        open={showRemoveMemberDialog}
        onOpenChange={setShowRemoveMemberDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from your
              organization? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowRemoveMemberDialog(false)}
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
