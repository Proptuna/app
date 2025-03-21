"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, AlertCircle } from "lucide-react";
import { Property } from "@/types/property";
import PropertiesAgGrid from "@/app/(components)/properties-ag-grid";
import { PropertyDetailV2 } from "@/app/(components)/property-detail-v2";
import { AddPropertyModal } from "@/app/(components)/add-property-modal";
import { AddDocModal } from "@/app/(components)/add-doc-modal";
import { AddEscalationPolicyModal } from "@/app/(components)/add-escalation-policy-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isAddEscalationPolicyModalOpen, setIsAddEscalationPolicyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
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

  const handlePropertyClick = (agGridProperty: any) => {
    // Find the corresponding property in our original data
    const property = properties.find(p => p.id === agGridProperty.id);
    if (property) {
      setSelectedProperty(property);
      setShowPropertyDetail(true);
      console.log("Selected property:", property);
    }
  };

  const handleAddDocumentSubmit = (document: any) => {
    if (selectedProperty) {
      // In a real app, you would save to an API
      // For now, just update the local state
      const updatedProperties = properties.map(p => {
        if (p.id === selectedProperty.id) {
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
    if (selectedProperty) {
      // In a real app, you would save to an API
      // For now, just update the local state
      const updatedProperties = properties.map(p => {
        if (p.id === selectedProperty.id) {
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
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your properties and related documents
          </p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsAddPropertyModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Success Message */}
      {showAlert && (
        <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {!showPropertyDetail && (
              <PropertiesAgGrid
                properties={properties.map(property => ({
                  id: property.id || '',
                  name: property.address,
                  tag: property.tag || '',
                  address: property.address,
                  type: property.type || '',
                  tenants: property.tenants?.map(tenant => tenant.name) || [],
                  docs: property.documents?.map(doc => doc.name) || [],
                  jobs: property.jobs?.map(job => job.title) || [],
                  aiConversations: property.aiConversations?.map(conv => conv.title) || [],
                  escalationPolicy: property.escalationPolicy || '',
                  image: property.image || ''
                }))}
                onPropertyClick={handlePropertyClick}
                onAddDoc={(propertyId) => {
                  const property = properties.find(p => p.id === propertyId);
                  if (property) {
                    setSelectedProperty(property);
                    setIsAddDocumentModalOpen(true);
                  }
                }}
                onAddEscalationPolicy={(propertyId) => {
                  const property = properties.find(p => p.id === propertyId);
                  if (property) {
                    setSelectedProperty(property);
                    setIsAddEscalationPolicyModalOpen(true);
                  }
                }}
              />
            )}
            
            {showPropertyDetail && selectedProperty && (
              <div className="animate-in slide-in-from-right">
                <PropertyDetailV2
                  property={{
                    ...selectedProperty,
                    id: selectedProperty.id || '',
                    jobs: selectedProperty.jobs || [],
                    tenants: selectedProperty.tenants || [],
                    documents: selectedProperty.documents || [],
                    createdAt: selectedProperty.createdAt || new Date().toISOString(),
                    updatedAt: selectedProperty.updatedAt || new Date().toISOString()
                  }}
                  onClose={() => setShowPropertyDetail(false)}
                  onAddDocument={(propertyId, document) => {
                    handleAddDocumentSubmit(document);
                  }}
                  onAddTenant={(propertyId, tenant) => {
                    handleAddTenant(propertyId, tenant);
                  }}
                  onAddJob={(propertyId, job) => {
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

      {isAddDocumentModalOpen && selectedProperty && (
        <AddDocModal
          onClose={() => setIsAddDocumentModalOpen(false)}
          onAdd={handleAddDocumentSubmit}
          existingDocs={selectedProperty.documents?.map(doc => doc.name) || []}
        />
      )}

      {isAddEscalationPolicyModalOpen && selectedProperty && (
        <AddEscalationPolicyModal
          onClose={() => setIsAddEscalationPolicyModalOpen(false)}
          onAdd={handleAddEscalationPolicySubmit}
          existingPolicies={["default", "urgent", "maintenance"]}
        />
      )}
    </div>
  );
}
