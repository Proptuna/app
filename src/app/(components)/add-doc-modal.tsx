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
import { Textarea } from "@/components/ui/textarea";
import { FileTextIcon, UploadIcon } from "lucide-react";

interface AddDocModalProps {
  onClose: () => void;
  onAdd: (doc: any) => void;
  existingDocs: string[];
}

export function AddDocModal({
  onClose,
  onAdd,
  existingDocs,
}: AddDocModalProps) {
  const [selectedTab, setSelectedTab] = useState("existing");
  const [selectedDoc, setSelectedDoc] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [docType, setDocType] = useState("markdown");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTab === "existing" && selectedDoc) {
      onAdd({ title: selectedDoc, type: "existing" });
    } else if (selectedTab === "new" && newDocTitle) {
      onAdd({
        title: newDocTitle,
        content: newDocContent,
        type: docType,
        file: file,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Select an existing document or create a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">
              Existing Document
            </TabsTrigger>
            <TabsTrigger value="new">
              New Document
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing">
            <form
              onSubmit={handleSubmit}
              className="py-4 space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="existing-doc">
                  Select Document
                </Label>
                <Select
                  value={selectedDoc}
                  onValueChange={setSelectedDoc}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingDocs.map((doc, index) => (
                      <SelectItem key={doc} value={doc} id={`nyy2qr_${index}`}>
                        <div
                          className="flex items-center"
                          id={`35a4zf_${index}`}
                        >
                          <FileTextIcon
                            className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400"
                            id={`z9earo_${index}`}
                          />
                          {doc}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!selectedDoc}>
                  Add Document
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
                <Label htmlFor="doc-title">
                  Document Title
                </Label>
                <Input
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="doc-type">
                  Document Type
                </Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select document type"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">
                      Markdown
                    </SelectItem>
                    <SelectItem value="escalation-policy">
                      Escalation Policy
                    </SelectItem>
                    <SelectItem value="file">
                      File Upload
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {docType === "markdown" && (
                <div className="grid gap-2">
                  <Label htmlFor="doc-content">
                    Document Content
                  </Label>
                  <Textarea
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    placeholder="Enter markdown content"
                    rows={6}
                    required
                  />
                </div>
              )}

              {docType === "file" && (
                <div className="grid gap-2">
                  <Label htmlFor="doc-file">
                    Upload File
                  </Label>
                  <div
                    className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center"
                  >
                    <UploadIcon
                      className="h-8 w-8 mx-auto mb-2 text-gray-400"
                    />
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 mb-2"
                    >
                      {file ? file.name : "Drag and drop or click to upload"}
                    </p>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("doc-file")?.click()
                      }
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              )}

              {docType === "escalation-policy" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="policy-description">
                      Policy Description
                    </Label>
                    <Input
                      placeholder="Brief description of the policy"
                      required
                    />
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">
                      Escalation Steps
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="bg-gray-200 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          1
                        </span>
                        <Input
                          placeholder="Contact name or role"
                          className="flex-1"
                        />

                        <Select defaultValue="15">
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Wait" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">
                              5 min
                            </SelectItem>
                            <SelectItem value="15">
                              15 min
                            </SelectItem>
                            <SelectItem value="30">
                              30 min
                            </SelectItem>
                            <SelectItem value="60">
                              1 hour
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="bg-gray-200 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          2
                        </span>
                        <Input
                          placeholder="Contact name or role"
                          className="flex-1"
                        />

                        <Select defaultValue="30">
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Wait" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">
                              5 min
                            </SelectItem>
                            <SelectItem value="15">
                              15 min
                            </SelectItem>
                            <SelectItem value="30">
                              30 min
                            </SelectItem>
                            <SelectItem value="60">
                              1 hour
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        + Add Step
                      </Button>
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
                <Button type="submit" disabled={!newDocTitle}>
                  Create Document
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
