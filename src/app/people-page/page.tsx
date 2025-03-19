"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, SearchIcon, MailIcon, PhoneIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  associations: Array<{
    type: string;
    place: string;
  }>;
}

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [newPerson, setNewPerson] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    associationType: "",
    associationPlace: "",
  });

  const people: Person[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      avatar: "https://github.com/yusufhilmi.png",
      role: "admin",
      associations: [
        { type: "owner", place: "Vista Ridge Group" },
        { type: "tenant", place: "Unit 1" },
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      avatar: "https://github.com/furkanksl.png",
      role: "manager",
      associations: [{ type: "tenant", place: "935 Woodmoor" }],
    },
    {
      id: "3",
      name: "Property Management Inc.",
      email: "contact@propmanagement.com",
      phone: "(555) 555-5555",
      avatar: "https://github.com/polymet-ai.png",
      role: "leasing_agent",
      associations: [{ type: "PM", place: "All Properties" }],
    },
  ];

  const getAssociationBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "owner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "tenant":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pm":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "leasing_agent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "support":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleAddPerson = () => {
    setShowAddPersonModal(true);
  };

  const handleViewDetails = (person: Person) => {
    setSelectedPerson(person);
    // In a real app, this would navigate to a person detail page or open a modal
    console.log("View details for person:", person);
  };

  const handleCloseModal = () => {
    setShowAddPersonModal(false);
    setNewPerson({
      name: "",
      email: "",
      phone: "",
      role: "",
      associationType: "",
      associationPlace: "",
    });
  };

  const handleSubmitNewPerson = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would add the person to the database
    console.log("Adding new person:", newPerson);
    handleCloseModal();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setNewPerson({
      ...newPerson,
      [field]: e.target.value,
    });
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewPerson({
      ...newPerson,
      [field]: value,
    });
  };

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.associations.some(
        (assoc) =>
          assoc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assoc.place.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          People
        </h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleAddPerson}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </div>

      <div className="relative max-w-md">
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />

        <Input
          type="search"
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredPeople.map((person, index) => (
          <Card
            key={person.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
            id={`5azfr1_${index}`}
          >
            <CardContent className="p-0" id={`x6ewn1_${index}`}>
              <div className="p-6" id={`cyoww3_${index}`}>
                <div
                  className="flex items-center space-x-4"
                  id={`cartsf_${index}`}
                >
                  <Avatar className="h-12 w-12" id={`tkltc1_${index}`}>
                    <AvatarImage
                      src={person.avatar}
                      alt={person.name}
                      id={`qefs4q_${index}`}
                    />

                    <AvatarFallback id={`a8jl4x_${index}`}>
                      {person.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div id={`hrvsug_${index}`}>
                    <h3
                      className="text-lg font-medium text-gray-900 dark:text-white"
                      id={`n7kway_${index}`}
                    >
                      {person.name}
                    </h3>
                    <div
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                      id={`qcwlkm_${index}`}
                    >
                      <MailIcon
                        className="h-4 w-4 mr-1"
                        id={`c7q77w_${index}`}
                      />

                      {person.email}
                    </div>
                    <div
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                      id={`purwt7_${index}`}
                    >
                      <PhoneIcon
                        className="h-4 w-4 mr-1"
                        id={`btvtv9_${index}`}
                      />

                      {person.phone}
                    </div>
                  </div>
                </div>

                <div className="mt-3" id={`role-badge-${index}`}>
                  <Badge
                    className={getRoleBadgeColor(person.role)}
                    id={`role-badge-text-${index}`}
                  >
                    {person.role.replace("_", " ").charAt(0).toUpperCase() +
                      person.role.replace("_", " ").slice(1)}
                  </Badge>
                </div>

                <div className="mt-4" id={`1sbw0q_${index}`}>
                  <h4
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    id={`7alojb_${index}`}
                  >
                    Associations
                  </h4>
                  <div className="flex flex-wrap gap-2" id={`c3hu9b_${index}`}>
                    {person.associations.map((assoc, idx) => (
                      <Badge
                        key={idx}
                        className={getAssociationBadgeColor(assoc.type)}
                        id={`3rkkv9_${idx}`}
                      >
                        {assoc.type}: {assoc.place}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-end"
                id={`5cqh0d_${index}`}
              >
                <Button
                  variant="ghost"
                  className="text-sm text-gray-600 dark:text-gray-400"
                  onClick={() => handleViewDetails(person)}
                  id={`rguimj_${index}`}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Person Modal */}
      {showAddPersonModal && (
        <Dialog open={true} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
              <DialogDescription>
                Enter the details for the new person. All fields are required.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitNewPerson}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Full Name
                  </Label>
                  <Input
                    value={newPerson.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={newPerson.email}
                    onChange={(e) => handleInputChange(e, "email")}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>
                  <Input
                    value={newPerson.phone}
                    onChange={(e) => handleInputChange(e, "phone")}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">
                    Role
                  </Label>
                  <Select
                    value={newPerson.role}
                    onValueChange={(value) => handleSelectChange(value, "role")}
                    required
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

                <div className="grid gap-2">
                  <Label htmlFor="association-type">
                    Association Type
                  </Label>
                  <Select
                    value={newPerson.associationType}
                    onValueChange={(value) =>
                      handleSelectChange(value, "associationType")
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">
                        Owner
                      </SelectItem>
                      <SelectItem value="tenant">
                        Tenant
                      </SelectItem>
                      <SelectItem value="pm">
                        Property Manager
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="association-place">
                    Associated With
                  </Label>
                  <Input
                    value={newPerson.associationPlace}
                    onChange={(e) => handleInputChange(e, "associationPlace")}
                    placeholder="Property or Group name"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Person
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
