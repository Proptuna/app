"use client"

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddPropertyModalProps {
  onClose: () => void;
  onAdd: (property: any) => void;
  existingGroups: string[];
}

export function AddPropertyModal({
  onClose,
  onAdd,
  existingGroups,
}: AddPropertyModalProps) {
  const [propertyType, setPropertyType] = useState<"single" | "multi">(
    "single",
  );
  const [address, setAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [group, setGroup] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const property = {
      address,
      unit,
      city,
      state,
      zip,
      type: propertyType,
      group: showNewGroupInput ? newGroup : group,
    };

    onAdd(property);
  };

  const handleGroupChange = (value: string) => {
    if (value === "add-new") {
      setShowNewGroupInput(true);
      setGroup("");
    } else {
      setShowNewGroupInput(false);
      setGroup(value);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Enter the details for the new property. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property-type">
                Property Type
              </Label>
              <RadioGroup
                value={propertyType}
                onValueChange={(value) =>
                  setPropertyType(value as "single" | "multi")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" />
                  <Label htmlFor="single">
                    Single Family
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multi" />
                  <Label htmlFor="multi">
                    Multi Family
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">
                Street Address
              </Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St"
                required
              />
            </div>

            {propertyType === "multi" && (
              <div className="grid gap-2">
                <Label htmlFor="unit">
                  Unit (optional)
                </Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Apt 4B"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">
                  City
                </Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Anytown"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">
                  State
                </Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="CA"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="zip">
                  ZIP Code
                </Label>
                <Input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="12345"
                  required
                />
              </div>
            </div>

            {propertyType === "multi" && (
              <div className="grid gap-2">
                <Label htmlFor="group">
                  Property Group
                </Label>
                {showNewGroupInput ? (
                  <div className="flex gap-2">
                    <Input
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                      placeholder="New Group Name"
                      required
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewGroupInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={group}
                    onValueChange={handleGroupChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add-new">
                        + Add New Group
                      </SelectItem>
                      {existingGroups.map((group, index) => (
                        <SelectItem
                          key={group}
                          value={group}
                          id={`qpv7r3_${index}`}
                        >
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <p className="text-xs text-muted-foreground">
                  All multi-family properties must be assigned to a group.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Property
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
