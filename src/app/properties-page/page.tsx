"use client"

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  XIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { PropertyDetail } from "(components)/property-detail";
import { AddPropertyModal } from "(components)/add-property-modal";
import { AddDocModal } from "(components)/add-doc-modal";
import { AddEscalationPolicyModal } from "(components)/add-escalation-policy-modal";
import { PropertyTable } from "(components)/property-table";

interface Property {
  id: string;
  name: string;
  group: string;
  address: string;
  type: string;
  tenants: string[];
  docs: string[];
  escalationPolicy: string;
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddEscalationModal, setShowAddEscalationModal] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState<string | null>(
    null,
  );
  const [properties, setProperties] = useState<Property[]>([]);

  // Sample data
  useEffect(() => {
    const propertiesData: Property[] = [
      {
        id: "group-1",
        name: "—",
        group: "vista ridge",
        address: "Vista Ridge Properties",
        type: "multi-family",
        tenants: [],
        docs: ["policies", "qa", "history"],
        escalationPolicy: "default",
      },
      {
        id: "1",
        name: "unit 1",
        group: "vista ridge",
        address: "123 Vista Ridge Rd, Unit 1",
        type: "apartment",
        tenants: ["John Doe"],
        docs: [],
        escalationPolicy: "",
      },
      {
        id: "2",
        name: "unit 2",
        group: "vista ridge",
        address: "123 Vista Ridge Rd, Unit 2",
        type: "apartment",
        tenants: ["Jane Smith"],
        docs: [],
        escalationPolicy: "",
      },
      {
        id: "3",
        name: "unit 3",
        group: "vista ridge",
        address: "123 Vista Ridge Rd, Unit 3",
        type: "apartment",
        tenants: [],
        docs: [],
        escalationPolicy: "",
      },
      {
        id: "4",
        name: "935 woodmoor",
        group: "—",
        address: "935 Woodmoor Dr",
        type: "single-family",
        tenants: ["Robert Johnson", "Sarah Johnson"],
        docs: [],
        escalationPolicy: "",
      },
      {
        id: "group-2",
        name: "—",
        group: "oakwood",
        address: "Oakwood Properties",
        type: "multi-family",
        tenants: [],
        docs: ["maintenance", "emergency contacts"],
        escalationPolicy: "urgent",
      },
      {
        id: "5",
        name: "unit A",
        group: "oakwood",
        address: "456 Oakwood Ave, Unit A",
        type: "apartment",
        tenants: ["Michael Brown"],
        docs: [],
        escalationPolicy: "",
      },
      {
        id: "6",
        name: "unit B",
        group: "oakwood",
        address: "456 Oakwood Ave, Unit B",
        type: "apartment",
        tenants: ["Lisa Davis"],
        docs: [],
        escalationPolicy: "",
      },
    ];

    setProperties(propertiesData);
  }, []);

  // Handle adding a new property
  const handleAddProperty = () => {
    setShowAddPropertyModal(true);
  };

  // Close property detail view
  const handleClosePropertyDetail = () => {
    setSelectedProperty(null);
  };

  // Handle property click
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  // Handle add doc
  const handleAddDoc = (propertyId: string) => {
    setCurrentPropertyId(propertyId);
    setShowAddDocModal(true);
  };

  // Handle add escalation policy
  const handleAddEscalationPolicy = (propertyId: string) => {
    setCurrentPropertyId(propertyId);
    setShowAddEscalationModal(true);
  };

  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.tenants.some((tenant) =>
        tenant.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Properties
        </h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleAddProperty}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="relative max-w-md">
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />

        <Input
          type="search"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <PropertyTable
        properties={filteredProperties}
        onPropertyClick={handlePropertyClick}
        onAddDoc={handleAddDoc}
        onAddEscalationPolicy={handleAddEscalationPolicy}
      />

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={handleClosePropertyDetail}
        />
      )}

      {showAddPropertyModal && (
        <AddPropertyModal
          onClose={() => setShowAddPropertyModal(false)}
          onAdd={(property) => {
            // In a real app, this would add the property to the database
            console.log("Add property", property);
            setShowAddPropertyModal(false);
          }}
          existingGroups={Array.from(
            new Set(properties.map((p) => p.group).filter((g) => g !== "—")),
          )}
        />
      )}

      {showAddDocModal && (
        <AddDocModal
          onClose={() => setShowAddDocModal(false)}
          onAdd={(doc) => {
            // In a real app, this would add the doc to the property
            console.log("Add doc", doc, "to property", currentPropertyId);
            setShowAddDocModal(false);
          }}
          existingDocs={[
            "policies",
            "qa",
            "history",
            "maintenance",
            "emergency contacts",
            "tenant handbook",
          ]}
        />
      )}

      {showAddEscalationModal && (
        <AddEscalationPolicyModal
          onClose={() => setShowAddEscalationModal(false)}
          onAdd={(policy) => {
            // In a real app, this would add the escalation policy to the property
            console.log(
              "Add escalation policy",
              policy,
              "to property",
              currentPropertyId,
            );
            setShowAddEscalationModal(false);
          }}
          existingPolicies={["default", "urgent", "maintenance"]}
        />
      )}
    </div>
  );
}
