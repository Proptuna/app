"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Plus, Trash, Clock, Users, AlertTriangle } from "lucide-react";

interface EscalationStage {
  id: string;
  timeToNextStage: number; // in minutes
  contacts: { id: string; name: string; email?: string; phone?: string }[];
}

interface EscalationPolicyFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function EscalationPolicyForm({ onSubmit, isSubmitting }: EscalationPolicyFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"internal" | "external" | "confidential">("internal");
  const [stages, setStages] = useState<EscalationStage[]>([
    {
      id: `stage-${Date.now()}`,
      timeToNextStage: 30,
      contacts: [{ id: `contact-${Date.now()}`, name: "" }]
    }
  ]);

  const addStage = () => {
    setStages([
      ...stages,
      {
        id: `stage-${Date.now()}`,
        timeToNextStage: 30,
        contacts: [{ id: `contact-${Date.now()}`, name: "" }]
      }
    ]);
  };

  const removeStage = (stageId: string) => {
    if (stages.length > 1) {
      setStages(stages.filter(stage => stage.id !== stageId));
    }
  };

  const addContact = (stageId: string) => {
    setStages(stages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          contacts: [
            ...stage.contacts,
            { id: `contact-${Date.now()}`, name: "" }
          ]
        };
      }
      return stage;
    }));
  };

  const removeContact = (stageId: string, contactId: string) => {
    setStages(stages.map(stage => {
      if (stage.id === stageId) {
        if (stage.contacts.length > 1) {
          return {
            ...stage,
            contacts: stage.contacts.filter(contact => contact.id !== contactId)
          };
        }
      }
      return stage;
    }));
  };

  const updateStage = (stageId: string, field: string, value: any) => {
    setStages(stages.map(stage => {
      if (stage.id === stageId) {
        return { ...stage, [field]: value };
      }
      return stage;
    }));
  };

  const updateContact = (stageId: string, contactId: string, field: string, value: string) => {
    setStages(stages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          contacts: stage.contacts.map(contact => {
            if (contact.id === contactId) {
              return { ...contact, [field]: value };
            }
            return contact;
          })
        };
      }
      return stage;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the escalation policy data
    const escalationPolicy = {
      title,
      description,
      stages: stages.map((stage, index) => ({
        level: index + 1,
        timeToNextStage: stage.timeToNextStage,
        contacts: stage.contacts.map(contact => ({
          name: contact.name,
          email: contact.email,
          phone: contact.phone
        }))
      }))
    };
    
    onSubmit({
      title,
      data: JSON.stringify(escalationPolicy),
      type: "escalation-policy",
      visibility,
      metadata: {
        description,
        stageCount: stages.length,
        created_via: "web_form"
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Policy Title</Label>
        <Input
          id="title"
          placeholder="Enter a title for your escalation policy"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the purpose of this escalation policy..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="visibility">Visibility</Label>
        <Select
          value={visibility}
          onValueChange={(value: "internal" | "external" | "confidential") => setVisibility(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="internal">Internal (Staff Only)</SelectItem>
            <SelectItem value="external">External (Public)</SelectItem>
            <SelectItem value="confidential">Confidential (Restricted)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Escalation Stages</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addStage}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Stage
          </Button>
        </div>

        <div className="space-y-4">
          {stages.map((stage, stageIndex) => (
            <Card key={stage.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Stage {stageIndex + 1}</CardTitle>
                  {stages.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStage(stage.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Define who to contact in this stage and how long to wait before escalating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Time to Next Stage (minutes)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={stage.timeToNextStage}
                      onChange={(e) => updateStage(stage.id, "timeToNextStage", parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Contacts for this Stage
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addContact(stage.id)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Contact
                    </Button>
                  </div>

                  {stage.contacts.map((contact, contactIndex) => (
                    <div key={contact.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-gray-50 dark:bg-gray-800 relative">
                      <div className="space-y-1">
                        <Label htmlFor={`contact-name-${contact.id}`}>Name</Label>
                        <Input
                          id={`contact-name-${contact.id}`}
                          value={contact.name}
                          onChange={(e) => updateContact(stage.id, contact.id, "name", e.target.value)}
                          placeholder="Contact name"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`contact-email-${contact.id}`}>Email</Label>
                        <Input
                          id={`contact-email-${contact.id}`}
                          type="email"
                          value={contact.email || ""}
                          onChange={(e) => updateContact(stage.id, contact.id, "email", e.target.value)}
                          placeholder="Contact email"
                        />
                      </div>
                      <div className="space-y-1 md:pr-8">
                        <Label htmlFor={`contact-phone-${contact.id}`}>Phone</Label>
                        <Input
                          id={`contact-phone-${contact.id}`}
                          value={contact.phone || ""}
                          onChange={(e) => updateContact(stage.id, contact.id, "phone", e.target.value)}
                          placeholder="Contact phone"
                        />
                      </div>
                      
                      {stage.contacts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContact(stage.id, contact.id)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6 md:flex hidden"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-800">Important Note</p>
          <p className="text-sm text-amber-700">
            Escalation policies define who to contact and when during critical situations. 
            Make sure all contact information is accurate and up-to-date.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : "Create Escalation Policy"}
        </Button>
      </div>
    </form>
  );
}
