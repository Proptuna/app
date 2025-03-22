"use client"

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";

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

interface PropertyTableProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onAddDoc: (propertyId: string) => void;
  onAddEscalationPolicy: (propertyId: string) => void;
}

export function PropertyTable({
  properties,
  onPropertyClick,
  onAddDoc,
  onAddEscalationPolicy,
}: PropertyTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      "vista ridge": true,
      oakwood: true,
    },
  );

  // Group properties by their group
  const groupedProperties = properties.reduce(
    (acc, property) => {
      const group = property.group;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(property);
      return acc;
    },
    {} as Record<string, Property[]>,
  );

  // Toggle group expansion
  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: !expandedGroups[group],
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="bg-gray-50 dark:bg-gray-800 border-b grid grid-cols-5 py-3"
      >
        <div
          className="px-4 font-medium text-sm text-gray-500 dark:text-gray-400"
        >
          Property
        </div>
        <div
          className="px-4 font-medium text-sm text-gray-500 dark:text-gray-400"
        >
          Group
        </div>
        <div
          className="px-4 font-medium text-sm text-gray-500 dark:text-gray-400"
        >
          Tenants
        </div>
        <div
          className="px-4 font-medium text-sm text-gray-500 dark:text-gray-400"
        >
          Docs
        </div>
        <div
          className="px-4 font-medium text-sm text-gray-500 dark:text-gray-400"
        >
          Escalation Policy
        </div>
      </div>

      <div className="divide-y">
        {Object.entries(groupedProperties).map(
          ([group, groupProperties], index) => {
            // Find the group property (if it exists)
            const groupProperty = groupProperties.find((p) => p.name === "—");
            const childProperties = groupProperties.filter(
              (p) => p.name !== "—",
            );
            const isExpanded = expandedGroups[group] || false;

            return (
              <React.Fragment key={group}>
                {/* Group row */}
                {groupProperty && (
                  <div
                    className="grid grid-cols-5 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    id={`y6i0nm_${index}`}
                  >
                    <div
                      className="px-4 flex items-center"
                      id={`bsnkec_${index}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroupExpansion(group);
                        }}
                        id={`toggle_${index}`}
                      >
                        {isExpanded ? (
                          <ChevronDownIcon
                            className="h-4 w-4"
                            id={`p7j8dt_${index}`}
                          />
                        ) : (
                          <ChevronRightIcon
                            className="h-4 w-4"
                            id={`nh20hw_${index}`}
                          />
                        )}
                      </Button>

                      <span
                        className="font-medium cursor-pointer"
                        id={`0rmzm2_${index}`}
                        onClick={() => onPropertyClick(groupProperty)}
                      >
                        {groupProperty.address}
                      </span>
                    </div>
                    <div className="px-4" id={`0a96x0_${index}`}>
                      {group}
                    </div>
                    <div className="px-4" id={`a1x42t_${index}`}>
                      {groupProperty.tenants.length > 0 ? (
                        <div
                          className="flex flex-wrap gap-2"
                          id={`ah5fax_${index}`}
                        >
                          {groupProperty.tenants.map((tenant, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700"
                              id={`of8k4r_${idx}`}
                            >
                              {tenant}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="px-4" id={`anwjp4_${index}`}>
                      <div
                        className="flex flex-wrap gap-2"
                        id={`dg3dyj_${index}`}
                      >
                        {groupProperty.docs.map((doc, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-gray-100 dark:bg-gray-700"
                            id={`07effn_${idx}`}
                          >
                            {doc}
                          </Badge>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddDoc(groupProperty.id);
                          }}
                          id={`7g6rat_${index}`}
                        >
                          <PlusIcon
                            className="h-4 w-4"
                            id={`tkbkxh_${index}`}
                          />
                        </Button>
                      </div>
                    </div>
                    <div className="px-4" id={`td34m6_${index}`}>
                      {groupProperty.escalationPolicy ? (
                        <div
                          className="flex items-center gap-2"
                          id={`ydwqoh_${index}`}
                        >
                          <Badge
                            variant="outline"
                            className="bg-gray-100 dark:bg-gray-700"
                            id={`xsusoe_${index}`}
                          >
                            {groupProperty.escalationPolicy}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddEscalationPolicy(groupProperty.id);
                            }}
                            id={`1vgr81_${index}`}
                          >
                            <PlusIcon
                              className="h-4 w-4"
                              id={`ym0ec6_${index}`}
                            />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddEscalationPolicy(groupProperty.id);
                          }}
                          id={`5ua5xu_${index}`}
                        >
                          <PlusIcon
                            className="h-4 w-4"
                            id={`b92o0q_${index}`}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Child rows */}
                {isExpanded &&
                  childProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="grid grid-cols-5 py-3 pl-8 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => onPropertyClick(property)}
                      id={`dtmomd_${index}`}
                    >
                      <div className="px-4" id={`md6d32_${index}`}>
                        {property.address}
                      </div>
                      <div className="px-4" id={`anfzmt_${index}`}>
                        {property.group}
                      </div>
                      <div className="px-4" id={`tstpzh_${index}`}>
                        <div
                          className="flex flex-wrap gap-2"
                          id={`h1r4x1_${index}`}
                        >
                          {property.tenants.map((tenant, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700"
                              id={`ehs226_${idx}`}
                            >
                              {tenant}
                            </Badge>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add tenant logic would go here
                            }}
                            id={`5f1p5e_${index}`}
                          >
                            <PlusIcon
                              className="h-4 w-4"
                              id={`cinm64_${index}`}
                            />
                          </Button>
                        </div>
                      </div>
                      <div className="px-4" id={`b09zmr_${index}`}>
                        <div
                          className="flex flex-wrap gap-2"
                          id={`xkd13b_${index}`}
                        >
                          {property.docs.map((doc, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700"
                              id={`dpfv86_${idx}`}
                            >
                              {doc}
                            </Badge>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddDoc(property.id);
                            }}
                            id={`y23aie_${index}`}
                          >
                            <PlusIcon
                              className="h-4 w-4"
                              id={`9zcynj_${index}`}
                            />
                          </Button>
                        </div>
                      </div>
                      <div className="px-4" id={`jzjxmz_${index}`}>
                        {property.escalationPolicy ? (
                          <div
                            className="flex items-center gap-2"
                            id={`fq6oc8_${index}`}
                          >
                            <Badge
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700"
                              id={`gobvmy_${index}`}
                            >
                              {property.escalationPolicy}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Remove policy logic would go here
                                }}
                                className="ml-1"
                                id={`5azqfd_${index}`}
                              >
                                <XIcon
                                  className="h-3 w-3"
                                  id={`nfz597_${index}`}
                                />
                              </button>
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddEscalationPolicy(property.id);
                              }}
                              id={`ac2b0j_${index}`}
                            >
                              <PlusIcon
                                className="h-4 w-4"
                                id={`nlzoig_${index}`}
                              />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddEscalationPolicy(property.id);
                            }}
                            id={`w24vn5_${index}`}
                          >
                            <PlusIcon
                              className="h-4 w-4"
                              id={`9hlax4_${index}`}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                {/* For properties without a group */}
                {group === "—" &&
                  groupProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="grid grid-cols-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => onPropertyClick(property)}
                      id={`0he2y6_${index}`}
                    >
                      <div className="px-4" id={`llm288_${index}`}>
                        {property.address}
                      </div>
                      <div className="px-4" id={`abjag6_${index}`}>
                        {property.group !== "—" ? property.group : ""}
                      </div>
                      <div className="px-4" id={`d2k753_${index}`}>
                        <div
                          className="flex flex-wrap gap-2"
                          id={`1itkyi_${index}`}
                        >
                          {property.tenants.map((tenant, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700"
                              id={`mlcgom_${idx}`}
                            >
                              {tenant}
                            </Badge>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add tenant logic would go here
                            }}
                            id={`ynwbk5_${index}`}
                          >
                            <PlusIcon
                              className="h-4 w-4"
                              id={`uaf702_${index}`}
                            />
                          </Button>
                        </div>
                      </div>
                      <div className="px-4" id={`rowis4_${index}`}>
                        <div
                          className="flex flex-wrap gap-2"
                          id={`bk8phf_${index}`}
                        >
                          {property.docs.map((doc, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700"
                              id={`5rxzph_${idx}`}
                            >
                              {doc}
                            </Badge>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddDoc(property.id);
                            }}
                            id={`ifrvuo_${index}`}
                          >
                            <PlusIcon
                              className="h-4 w-4"
                              id={`w0x4ba_${index}`}
                            />
                          </Button>
                        </div>
                      </div>
                      <div className="px-4" id={`7poer9_${index}`}>
                        {property.escalationPolicy ? (
                          <div
                            className="flex items-center gap-2"
                            id={`958sdq_${index}`}
                          >
                            <Badge
                              variant="outline"
                              className="bg-gray-100 dark:bg-gray-700"
                              id={`8169jz_${index}`}
                            >
                              {property.escalationPolicy}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Remove policy logic would go here
                                }}
                                className="ml-1"
                                id={`tn4vlg_${index}`}
                              >
                                <XIcon
                                  className="h-3 w-3"
                                  id={`vk2n8n_${index}`}
                                />
                              </button>
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddEscalationPolicy(property.id);
                              }}
                              id={`k7g19w_${index}`}
                            >
                              <PlusIcon
                                className="h-4 w-4"
                                id={`xpvw2k_${index}`}
                              />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddEscalationPolicy(property.id);
                            }}
                            id={`wdai1m_${index}`}
                          >
                            <PlusIcon
                              className="h-4 w-4"
                              id={`jqf6qx_${index}`}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </React.Fragment>
            );
          },
        )}
      </div>
    </div>
  );
}
