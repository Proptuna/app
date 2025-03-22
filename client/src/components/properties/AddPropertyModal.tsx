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
  existingTags: string[];
}

export function AddPropertyModal({
  onClose,
  onAdd,
  existingTags,
}: AddPropertyModalProps) {
  const [propertyType, setPropertyType] = useState<"single" | "multi">(
    "single",
  );
  const [address, setAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [tag, setTag] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const property = {
      address,
      unit,
      city,
      state,
      zip,
      type: propertyType,
      tag: showNewTagInput ? newTag : tag,
    };

    onAdd(property);
  };

  const handleTagChange = (value: string) => {
    if (value === "add-new") {
      setShowNewTagInput(true);
      setTag("");
    } else {
      setShowNewTagInput(false);
      setTag(value);
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
                <Label htmlFor="tag">
                  Property Tag
                </Label>
                {showNewTagInput ? (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="New Tag Name"
                      required
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewTagInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={tag}
                    onValueChange={handleTagChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add-new">
                        + Add New Tag
                      </SelectItem>
                      {existingTags.map((tag, index) => (
                        <SelectItem
                          key={tag}
                          value={tag}
                          id={`qpv7r3_${index}`}
                        >
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <p className="text-xs text-muted-foreground">
                  All multi-family properties must be assigned to a tag.
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
