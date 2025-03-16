"use client"

import React from "react";
import { BuildingIcon, UserIcon, HomeIcon } from "lucide-react";

interface Property {
  address: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  type: string;
  owner?: string;
  manager?: string;
  image?: string;
}

interface PropertyInfoProps {
  property: Property;
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {property.image && (
          <div className="md:w-1/3 h-48 md:h-auto">
            <img
              src={property.image}
              alt={property.address}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className={`p-4 ${property.image ? "md:w-2/3" : "w-full"}`}
        >
          <h3
            className="text-lg font-semibold mb-3 flex items-center"
          >
            <HomeIcon
              className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"
            />
            Property Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Address
              </p>
              <p className="font-medium">
                {property.address}
                {property.unit && `, Unit ${property.unit}`}
              </p>
              {(property.city || property.state || property.zip) && (
                <p className="font-medium">
                  {property.city && `${property.city}, `}
                  {property.state && `${property.state} `}
                  {property.zip && property.zip}
                </p>
              )}
            </div>

            <div>
              <p
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Property Type
              </p>
              <p className="font-medium flex items-center">
                <BuildingIcon
                  className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400"
                />
                {property.type}
              </p>
            </div>

            {property.owner && (
              <div>
                <p
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Owner
                </p>
                <p className="font-medium flex items-center">
                  <UserIcon
                    className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400"
                  />
                  {property.owner}
                </p>
              </div>
            )}

            {property.manager && (
              <div>
                <p
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Property Manager
                </p>
                <p className="font-medium flex items-center">
                  <UserIcon
                    className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400"
                  />
                  {property.manager}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
