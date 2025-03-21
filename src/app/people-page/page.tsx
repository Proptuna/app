"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchPeople, createPerson, fetchPersonById, Person } from "@/lib/people-client";
import dynamic from "next/dynamic";

// Dynamically import the AG Grid component
const PeopleAgGrid = dynamic(() => import("../(components)/people-ag-grid"), {
  ssr: false,
});

// Dynamically import the Person Detail component
const PersonDetail = dynamic(() => import("../(components)/person-detail"), {
  ssr: false,
});

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [newPerson, setNewPerson] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    role: "",
  });

  // Load people function
  const loadPeople = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPeople();
      setPeople(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching people:", err);
      setError(err.message || "Failed to load people");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch people on component mount
  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  // Handle person ID in URL
  useEffect(() => {
    const handlePersonInUrl = async () => {
      // Check for person ID in query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const queryPersonId = searchParams.get('personId');
      const shouldViewPerson = searchParams.get('view') === 'true';
      
      if (!queryPersonId) return;
      
      console.log("Found person ID in URL:", queryPersonId, "Should view:", shouldViewPerson);
      
      try {
        // First check if person is already in the loaded data
        if (people.length > 0) {
          const person = people.find(p => p.id === queryPersonId);
          if (person) {
            console.log("Person found in already loaded data:", person.name);
            setSelectedPerson(person);
            return;
          }
        }
        
        // If not found in state or people not loaded yet, fetch directly
        if (!loading || shouldViewPerson) {
          console.log("Fetching person directly");
          const person = await fetchPersonById(queryPersonId);
          if (person) {
            console.log("Person fetched successfully:", person.name);
            setSelectedPerson(person);
            
            // Clean up the URL but maintain the personId
            if (shouldViewPerson) {
              const newUrl = `${window.location.pathname}?personId=${queryPersonId}`;
              window.history.replaceState({}, '', newUrl);
            }
          } else {
            console.error("Person not found with ID:", queryPersonId);
          }
        }
      } catch (error) {
        console.error("Error loading person from URL:", error);
      }
    };
    
    handlePersonInUrl();
  }, [people, loading]);

  // Handle person deleted
  const handlePersonDeleted = useCallback((id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
    setSuccessMessage("Person deleted successfully");
    
    // If the deleted person is currently selected, clear the selection
    if (selectedPerson && selectedPerson.id === id) {
      setSelectedPerson(null);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }, [selectedPerson]);

  // Handle person edit
  const handlePersonEdit = useCallback((id: string) => {
    // For now, just log the action
    console.log(`Edit person with ID: ${id}`);
    // In the future, this would navigate to the edit page or open an edit modal
  }, []);

  // Handle person view
  const handlePersonView = useCallback((id: string) => {
    console.log("View person with ID:", id);
    const person = people.find(p => p.id === id);
    console.log("Found person:", person);
    if (person) {
      setSelectedPerson(person);
    } else {
      console.error("Person not found with ID:", id);
    }
  }, [people]);

  // Handle close person detail
  const handleClosePersonDetail = useCallback(() => {
    setSelectedPerson(null);
  }, []);

  // Handle add person
  const handleAddPerson = () => {
    setShowAddPersonModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowAddPersonModal(false);
    setNewPerson({
      name: "",
      email: "",
      phone: "",
      type: "",
      role: "",
    });
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setNewPerson({
      ...newPerson,
      [field]: e.target.value,
    });
  };

  // Handle select change
  const handleSelectChange = (value: string, field: string) => {
    setNewPerson({
      ...newPerson,
      [field]: value,
    });
  };

  // Handle submit new person
  const handleSubmitNewPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const createdPerson = await createPerson({
        name: newPerson.name,
        email: newPerson.email,
        phone: newPerson.phone,
        type: newPerson.type,
        role: newPerson.role,
      });
      
      setPeople((prev) => [...prev, createdPerson]);
      setSuccessMessage("Person created successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      handleCloseModal();
    } catch (err: any) {
      console.error("Error creating person:", err);
      setError(err.message || "Failed to create person");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">People</h1>
          <p className="text-muted-foreground">
            Manage your tenants, owners, and property managers
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleAddPerson}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="bg-red-50 text-red-800 border-red-200 mb-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="relative">
            <div className={`transition-all duration-300 ${selectedPerson ? 'translate-x-[-100%]' : 'translate-x-0'}`}>
              <PeopleAgGrid
                people={people}
                onPersonDeleted={handlePersonDeleted}
                onPersonEdit={handlePersonEdit}
                onPersonView={handlePersonView}
              />
            </div>
            
            <div className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${selectedPerson ? 'translate-x-0' : 'translate-x-[100%]'}`}>
              {selectedPerson && (
                <PersonDetail 
                  person={selectedPerson} 
                  onClose={handleClosePersonDetail}
                  onEdit={handlePersonEdit}
                  onDelete={(id) => {
                    handleClosePersonDetail();
                    handlePersonDeleted(id);
                  }}
                />
              )}
            </div>
          </div>
        )}
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
                  <Label htmlFor="type">
                    Type
                  </Label>
                  <Select
                    value={newPerson.type}
                    onValueChange={(value) => handleSelectChange(value, "type")}
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
