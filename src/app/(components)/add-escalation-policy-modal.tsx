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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, XIcon, ClockIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EscalationStep {
  id: string;
  contact: string;
  waitTime: string;
}

interface AddEscalationPolicyModalProps {
  onClose: () => void;
  onAdd: (policy: any) => void;
  existingPolicies: string[];
}

export function AddEscalationPolicyModal({
  onClose,
  onAdd,
  existingPolicies,
}: AddEscalationPolicyModalProps) {
  const [selectedTab, setSelectedTab] = useState("existing");
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [newPolicyName, setNewPolicyName] = useState("");
  const [steps, setSteps] = useState<EscalationStep[]>([
    { id: "1", contact: "", waitTime: "15" },
    { id: "2", contact: "", waitTime: "30" },
  ]);

  // Mock users for contact selection
  const users = [
    { id: "1", name: "John Doe", avatar: "https://github.com/yusufhilmi.png" },
    { id: "2", name: "Jane Smith", avatar: "https://github.com/furkanksl.png" },
    {
      id: "3",
      name: "Property Management",
      avatar: "https://github.com/polymet-ai.png",
    },
    { id: "4", name: "Maintenance Team", avatar: "" },
    { id: "5", name: "Emergency Services", avatar: "" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTab === "existing" && selectedPolicy) {
      onAdd({ name: selectedPolicy, type: "existing" });
    } else if (selectedTab === "new" && newPolicyName) {
      onAdd({
        name: newPolicyName,
        steps: steps,
        type: "new",
      });
    }
  };

  const addStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { id: newId, contact: "", waitTime: "15" }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const updateStep = (
    id: string,
    field: keyof EscalationStep,
    value: string,
  ) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Escalation Policy</DialogTitle>
          <DialogDescription>
            Select an existing policy or create a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">
              Existing Policy
            </TabsTrigger>
            <TabsTrigger value="new">
              New Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing">
            <form
              onSubmit={handleSubmit}
              className="py-4 space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="existing-policy">
                  Select Policy
                </Label>
                <Select
                  value={selectedPolicy}
                  onValueChange={setSelectedPolicy}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingPolicies.map((policy, index) => (
                      <SelectItem
                        key={policy}
                        value={policy}
                        id={`gb1ni0_${index}`}
                      >
                        {policy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPolicy && (
                <div
                  className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <h4 className="text-sm font-medium mb-3">
                    Policy Preview
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        1
                      </span>
                      <span className="flex-1">
                        Property Manager
                      </span>
                      <span
                        className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                      >
                        <ClockIcon className="h-3 w-3 mr-1" />
                        15 min
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        2
                      </span>
                      <span className="flex-1">
                        Maintenance Team
                      </span>
                      <span
                        className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                      >
                        <ClockIcon className="h-3 w-3 mr-1" />
                        30 min
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        3
                      </span>
                      <span className="flex-1">
                        Regional Manager
                      </span>
                      <span
                        className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                      >
                        <ClockIcon className="h-3 w-3 mr-1" />1 hour
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!selectedPolicy}>
                  Use Policy
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="new">
            <form
              onSubmit={handleSubmit}
              className="py-4 space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="policy-name">
                  Policy Name
                </Label>
                <Input
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  placeholder="Enter policy name"
                  required
                />
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">
                  Escalation Steps
                </h4>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 mb-4"
                >
                  Define who to contact and how long to wait before escalating
                  to the next person.
                </p>

                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2"
                      id={`ghb849_${index}`}
                    >
                      <span
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        id={`wsbhhi_${index}`}
                      >
                        {index + 1}
                      </span>

                      <Select
                        value={step.contact}
                        onValueChange={(value) =>
                          updateStep(step.id, "contact", value)
                        }
                        required
                        id={`f9h9z7_${index}`}
                      >
                        <SelectTrigger
                          className="flex-1"
                          id={`dxwhfa_${index}`}
                        >
                          <SelectValue
                            placeholder="Select contact"
                            id={`1uod2c_${index}`}
                          />
                        </SelectTrigger>
                        <SelectContent id={`qn0brx_${index}`}>
                          {users.map((user, index) => (
                            <SelectItem
                              key={user.id}
                              value={user.id}
                              id={`ryegkt_${index}`}
                            >
                              <div
                                className="flex items-center"
                                id={`tolvcg_${index}`}
                              >
                                <Avatar
                                  className="h-6 w-6 mr-2"
                                  id={`tssywj_${index}`}
                                >
                                  {user.avatar ? (
                                    <AvatarImage
                                      src={user.avatar}
                                      alt={user.name}
                                      id={`i0b9k3_${index}`}
                                    />
                                  ) : (
                                    <AvatarFallback id={`o2xq0q_${index}`}>
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                {user.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={step.waitTime}
                        onValueChange={(value) =>
                          updateStep(step.id, "waitTime", value)
                        }
                        id={`yd1psv_${index}`}
                      >
                        <SelectTrigger className="w-24" id={`zmxqfk_${index}`}>
                          <SelectValue
                            placeholder="Wait"
                            id={`9qew9o_${index}`}
                          />
                        </SelectTrigger>
                        <SelectContent id={`0fsznd_${index}`}>
                          <SelectItem value="5" id={`j17yyi_${index}`}>
                            5 min
                          </SelectItem>
                          <SelectItem value="15" id={`p87f6z_${index}`}>
                            15 min
                          </SelectItem>
                          <SelectItem value="30" id={`mqxa5u_${index}`}>
                            30 min
                          </SelectItem>
                          <SelectItem value="60" id={`eb2rzu_${index}`}>
                            1 hour
                          </SelectItem>
                          <SelectItem value="120" id={`jgme6h_${index}`}>
                            2 hours
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step.id)}
                        disabled={steps.length <= 1}
                        id={`kgnsp3_${index}`}
                      >
                        <XIcon className="h-4 w-4" id={`c09bpf_${index}`} />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addStep}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !newPolicyName || steps.some((step) => !step.contact)
                  }
                >
                  Create Policy
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
