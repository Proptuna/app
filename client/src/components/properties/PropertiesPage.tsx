"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Property } from "@/types/property";
import PropertiesAgGrid from "./PropertiesAgGrid";
import { PropertyDetailV2 } from "@/components/properties/PropertyDetailV2";
import { AddPropertyModal } from "@/components/properties/AddPropertyModal";
import { AddDocModal } from "@/components/properties/AddDocModal";
import { AddEscalationPolicyModal } from "@/components/properties/AddEscalationPolicyModal";
import { PageLayout } from "@/components/layout/PageLayout";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isAddEscalationPolicyModalOpen, setIsAddEscalationPolicyModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Sample properties data
  const sampleProperties: Property[] = [
    {
      id: "property-1",
      address: "123 Main St",
      unit: "A",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      type: "Single Family",
      tag: "Residential",
      tenants: [
        {
          id: "tenant-1",
          name: "John Doe",
          email: "john@example.com",
          phone: "555-123-4567"
        },
        {
          id: "tenant-2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-987-6543"
        }
      ],
      documents: [
        {
          id: "doc-1",
          name: "Lease Agreement",
          url: "/documents/lease.pdf",
          tags: ["Residential", "Legal"],
          createdAt: "2023-01-15T00:00:00Z",
          updatedAt: "2023-01-15T00:00:00Z"
        },
        {
          id: "doc-2",
          name: "Property Inspection",
          url: "/documents/inspection.pdf",
          tags: ["Residential", "Maintenance"],
          createdAt: "2023-02-20T00:00:00Z",
          updatedAt: "2023-02-20T00:00:00Z"
        }
      ],
      jobs: [
        {
          id: "job-1",
          title: "Fix leaking faucet",
          description: "The kitchen faucet is leaking and needs repair.",
          status: "pending",
          priority: "medium",
          createdAt: "2023-03-10T00:00:00Z"
        },
        {
          id: "job-2",
          title: "Replace smoke detector",
          description: "Smoke detector in hallway needs replacement.",
          status: "completed",
          priority: "high",
          createdAt: "2023-02-15T00:00:00Z",
          completedAt: "2023-02-20T00:00:00Z"
        }
      ],
      aiConversations: [
        {
          id: "conv-1",
          title: "Rent increase discussion",
          description: "AI conversation about potential rent increase for next lease term.",
          status: "pending",
          priority: "medium",
          createdAt: "2023-03-15T00:00:00Z"
        }
      ],
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-03-15T00:00:00Z",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
    },
    {
      id: "property-2",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      type: "Multi Family",
      tag: "Commercial",
      tenants: [
        {
          id: "tenant-3",
          name: "Acme Corp",
          email: "info@acme.com",
          phone: "555-111-2222"
        }
      ],
      documents: [
        {
          id: "doc-3",
          name: "Commercial Lease",
          url: "/documents/commercial-lease.pdf",
          tags: ["Commercial", "Legal"],
          createdAt: "2023-03-10T00:00:00Z",
          updatedAt: "2023-03-10T00:00:00Z"
        }
      ],
      jobs: [],
      aiConversations: [
        {
          id: "conv-2",
          title: "Lease renewal",
          description: "AI conversation about lease renewal options for Acme Corp.",
          status: "completed",
          priority: "high",
          createdAt: "2023-03-20T00:00:00Z",
          completedAt: "2023-03-25T00:00:00Z"
        }
      ],
      createdAt: "2023-02-15T00:00:00Z",
      updatedAt: "2023-04-01T00:00:00Z",
      image: "https://images.unsplash.com/photo-1464082354059-27db6ce50048?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: "property-3",
      address: "789 Pine St",
      unit: "101",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      type: "Condo",
      tag: "Vacation",
      tenants: [],
      documents: [
        {
          id: "doc-4",
          name: "HOA Rules",
          url: "/documents/hoa-rules.pdf",
          tags: ["Vacation", "HOA"],
          createdAt: "2023-04-05T00:00:00Z",
          updatedAt: "2023-04-05T00:00:00Z"
        },
        {
          id: "doc-5",
          name: "Maintenance Schedule",
          url: "/documents/maintenance.pdf",
          tags: ["Vacation", "Maintenance"],
          createdAt: "2023-04-10T00:00:00Z",
          updatedAt: "2023-04-10T00:00:00Z"
        }
      ],
      jobs: [
        {
          id: "job-3",
          title: "Replace light bulbs",
          description: "Replace light bulbs in living room and kitchen.",
          status: "pending",
          priority: "low",
          createdAt: "2023-04-15T00:00:00Z"
        }
      ],
      createdAt: "2023-03-20T00:00:00Z",
      updatedAt: "2023-04-15T00:00:00Z",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: "property-4",
      address: "101 Market St",
      city: "New York",
      state: "NY",
      zip: "10001",
      type: "Commercial",
      tag: "Office",
      tenants: [
        {
          id: "tenant-4",
          name: "Tech Startup Inc",
          email: "contact@techstartup.com",
          phone: "555-333-4444"
        },
        {
          id: "tenant-5",
          name: "Legal Firm LLC",
          email: "info@legalfirm.com",
          phone: "555-555-5555"
        }
      ],
      documents: [],
      jobs: [
        {
          id: "job-4",
          title: "Fix elevator",
          description: "Elevator is not working and needs repair.",
          status: "pending",
          priority: "high",
          createdAt: "2023-05-01T00:00:00Z"
        }
      ],
      createdAt: "2023-05-01T00:00:00Z",
      updatedAt: "2023-05-01T00:00:00Z",
      image: "https://images.unsplash.com/photo-1510915228348-7eb41b63bda4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: "property-5",
      address: "222 Beach Rd",
      city: "Miami",
      state: "FL",
      zip: "33101",
      type: "Single Family",
      tag: "Residential",
      tenants: [
        {
          id: "tenant-6",
          name: "Robert Johnson",
          email: "robert@example.com",
          phone: "555-666-7777"
        }
      ],
      documents: [
        {
          id: "doc-6",
          name: "Insurance Policy",
          url: "/documents/insurance.pdf",
          tags: ["Residential", "Insurance"],
          createdAt: "2023-05-15T00:00:00Z",
          updatedAt: "2023-05-15T00:00:00Z"
        }
      ],
      jobs: [
        {
          id: "job-5",
          title: "Clean pool",
          description: "Clean the pool and surrounding area.",
          status: "pending",
          priority: "medium",
          createdAt: "2023-05-20T00:00:00Z"
        }
      ],
      createdAt: "2023-04-25T00:00:00Z",
      updatedAt: "2023-05-20T00:00:00Z",
      image: "https://images.unsplash.com/photo-1502673530726-86c3f2c62fe6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  // Fetch properties data
  useEffect(() => {
    // Simulate API call with a delay
    setIsLoading(true);
    const fetchProperties = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch from an API
        // const response = await fetch('/api/properties');
        // const data = await response.json();
        
        console.log("Loading sample properties:", sampleProperties);
        setProperties(sampleProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later.");
        setAlertMessage("Failed to load properties. Please try again later.");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleAddPropertySubmit = (property: Property) => {
    // In a real app, you would save to an API
    // For now, just add to the local state
    const newProperty: Property = {
      ...property,
      id: `property-${Date.now()}`,
      tenants: [],
      documents: [],
      jobs: [],
      aiConversations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProperties([...properties, newProperty]);
    setIsAddPropertyModalOpen(false);
    setAlertMessage("Property added successfully!");
    setShowAlert(true);
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedPropertyId(property.id);
    setShowPropertyDetail(true);
    console.log("Selected property:", property);
  };

  const handleAddDocumentSubmit = (document: any) => {
    if (selectedPropertyId) {
      // In a real app, you would save to an API
      // For now, just update the local state
      const updatedProperties = properties.map(p => {
        if (p.id === selectedPropertyId) {
          const documents = p.documents || [];
          return {
            ...p,
            documents: [...documents, { 
              ...document, 
              id: `doc-${Date.now()}`,
              tags: document.tags ? (typeof document.tags === 'string' ? document.tags.split(',').map((tag: string) => tag.trim()) : document.tags) : [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }],
          };
        }
        return p;
      });
      
      setProperties(updatedProperties);
      setIsAddDocumentModalOpen(false);
      setAlertMessage("Document added successfully!");
      setShowAlert(true);
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleAddEscalationPolicySubmit = (policy: any) => {
    if (selectedPropertyId) {
      // In a real app, you would save to an API
      // For now, just update the local state
      const updatedProperties = properties.map(p => {
        if (p.id === selectedPropertyId) {
          return {
            ...p,
            escalationPolicy: policy.name,
          };
        }
        return p;
      });
      
      setProperties(updatedProperties);
      setIsAddEscalationPolicyModalOpen(false);
      setAlertMessage("Escalation policy added successfully!");
      setShowAlert(true);
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleAddTenant = (propertyId: string, tenant: any) => {
    // In a real app, you would save to an API
    // For now, just update the local state
    const updatedProperties = properties.map(p => {
      if (p.id === propertyId) {
        const tenants = p.tenants || [];
        return {
          ...p,
          tenants: [...tenants, { 
            ...tenant, 
            id: `tenant-${Date.now()}` 
          }],
        };
      }
      return p;
    });
    
    setProperties(updatedProperties);
    setAlertMessage("Tenant added successfully!");
    setShowAlert(true);
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleAddJob = (propertyId: string, job: any) => {
    // In a real app, you would save to an API
    // For now, just update the local state
    const updatedProperties = properties.map(p => {
      if (p.id === propertyId) {
        const jobs = p.jobs || [];
        return {
          ...p,
          jobs: [...jobs, { 
            ...job, 
            id: `job-${Date.now()}`,
            status: job.status || 'pending',
            createdAt: new Date().toISOString()
          }],
        };
      }
      return p;
    });
    
    setProperties(updatedProperties);
    setAlertMessage("Job added successfully!");
    setShowAlert(true);
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <PageLayout
      title="Properties"
      subtitle="Manage your properties and view property details"
      actions={
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsAddPropertyModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      }
    >
      {/* Alert for success or error messages */}
      {showAlert && (
        <Alert className={`mb-4 ${error ? "bg-red-50 text-red-800 border-red-200" : "bg-green-50 text-green-800 border-green-200"}`}>
          {error ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertTitle>{error ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <div className="h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {!showPropertyDetail && (
              <PropertiesAgGrid
                properties={properties}
                onPropertyClick={handlePropertyClick}
                onAddDoc={(propertyId: string) => {
                  const property = properties.find(p => p.id === propertyId);
                  if (property) {
                    setSelectedPropertyId(propertyId);
                    setIsAddDocumentModalOpen(true);
                  }
                }}
                onAddEscalationPolicy={(propertyId: string) => {
                  setSelectedPropertyId(propertyId);
                  setIsAddEscalationPolicyModalOpen(true);
                }}
              />
            )}
            
            {showPropertyDetail && selectedPropertyId && (
              <div className="animate-in slide-in-from-right">
                <PropertyDetailV2
                  property={properties.find(p => p.id === selectedPropertyId) as Property}
                  onClose={() => setShowPropertyDetail(false)}
                  onAddDocument={(propertyId: string, document: any) => {
                    handleAddDocumentSubmit(document);
                  }}
                  onAddTenant={(propertyId: string, tenant: any) => {
                    handleAddTenant(propertyId, tenant);
                  }}
                  onAddJob={(propertyId: string, job: any) => {
                    handleAddJob(propertyId, job);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {isAddPropertyModalOpen && (
        <AddPropertyModal
          onClose={() => setIsAddPropertyModalOpen(false)}
          onAdd={handleAddPropertySubmit}
          existingTags={Array.from(
            new Set(properties.map((p) => p.tag || "").filter(tag => tag !== ""))
          )}
        />
      )}

      {isAddDocumentModalOpen && selectedPropertyId && (
        <AddDocModal
          onClose={() => setIsAddDocumentModalOpen(false)}
          onAdd={handleAddDocumentSubmit}
          existingDocs={properties.find(p => p.id === selectedPropertyId)?.documents?.map(doc => doc.name) || []}
        />
      )}

      {isAddEscalationPolicyModalOpen && selectedPropertyId && (
        <AddEscalationPolicyModal
          onClose={() => setIsAddEscalationPolicyModalOpen(false)}
          onAdd={handleAddEscalationPolicySubmit}
          existingPolicies={["default", "urgent", "maintenance"]}
        />
      )}
    </PageLayout>
  );
}
