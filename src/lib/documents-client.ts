/**
 * Client-side document service for interacting with the Documents API
 */

export interface Document {
  id: string;
  title: string;
  type: string;
  data: string;
  visibility: "internal" | "external" | "confidential";
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  version: number;
  associations?: {
    properties: Array<{ id: string; address: string }>;
    people: Array<{ id: string; name: string; type: string }>;
    groups: Array<{ id: string; name: string }>;
  };
}

export interface DocumentListParams {
  title?: string;
  type?: string;
  visibility?: string;
  propertyId?: string;
  personId?: string;
  groupId?: string;
}

export interface DocumentListResponse {
  data: Document[];
  has_more: boolean;
  total_count?: number;
}

/**
 * Fetch a list of documents with filtering
 */
export async function fetchDocuments(params: DocumentListParams = {}): Promise<DocumentListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.title) queryParams.append("title", params.title);
  if (params.type) queryParams.append("type", params.type);
  if (params.visibility) queryParams.append("visibility", params.visibility);
  if (params.propertyId) queryParams.append("property_id", params.propertyId);
  if (params.personId) queryParams.append("person_id", params.personId);
  if (params.groupId) queryParams.append("group_id", params.groupId);
  
  const url = `/api/v1/documents${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch documents");
  }
  
  return response.json();
}

/**
 * Fetch a single document by ID
 */
export async function fetchDocumentById(id: string): Promise<Document> {
  console.log(`Client: Fetching document with ID: ${id}`);
  
  try {
    const url = `/api/v1/documents/${id}`;
    console.log(`Client: Making request to ${url}`);
    
    const response = await fetch(url);
    console.log(`Client: Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Client: Error fetching document ${id}:`, errorData);
      throw new Error(errorData.error || `Failed to fetch document with ID ${id} (Status: ${response.status})`);
    }
    
    const document = await response.json();
    console.log(`Client: Document fetched successfully with title: ${document.title}`);
    return document;
  } catch (error: any) {
    console.error(`Client: Error in fetchDocumentById for ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new document
 */
export async function createDocument(document: {
  title: string;
  data: string;
  visibility: "internal" | "external" | "confidential";
  type: string;
  metadata?: Record<string, any>;
  associations?: {
    property_ids?: string[];
    person_ids?: string[];
    group_ids?: string[];
  };
}): Promise<Document> {
  const response = await fetch("/api/v1/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(document),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create document");
  }
  
  return response.json();
}

/**
 * Update an existing document
 */
export async function updateDocument(
  id: string,
  updates: {
    title?: string;
    data?: string;
    visibility?: "internal" | "external" | "confidential";
    type?: string;
    metadata?: Record<string, any>;
  }
): Promise<Document> {
  const response = await fetch(`/api/v1/documents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to update document with ID ${id}`);
  }
  
  return response.json();
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<{ success: boolean; id: string }> {
  const response = await fetch(`/api/v1/documents/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to delete document with ID ${id}`);
  }
  
  return response.json();
}

/**
 * Associate a document with a property
 */
export async function associateDocumentWithProperty(
  documentId: string,
  propertyId: string,
  metadata: Record<string, any> = {}
): Promise<any> {
  const response = await fetch(`/api/v1/documents/${documentId}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ property_id: propertyId, metadata }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to associate document with property");
  }
  
  return response.json();
}

/**
 * Associate a document with a person
 */
export async function associateDocumentWithPerson(
  documentId: string,
  personId: string,
  metadata: Record<string, any> = {}
): Promise<any> {
  const response = await fetch(`/api/v1/documents/${documentId}/people`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ person_id: personId, metadata }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to associate document with person");
  }
  
  return response.json();
}

/**
 * Associate a document with a group
 */
export async function associateDocumentWithGroup(
  documentId: string,
  groupId: string,
  metadata: Record<string, any> = {}
): Promise<any> {
  const response = await fetch(`/api/v1/documents/${documentId}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: groupId, metadata }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to associate document with group");
  }
  
  return response.json();
}

/**
 * Remove a document's association with a property
 */
export async function removeDocumentPropertyAssociation(
  documentId: string,
  propertyId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/v1/documents/${documentId}/properties/${propertyId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove property association");
  }
  
  return response.json();
}

/**
 * Remove a document's association with a person
 */
export async function removeDocumentPersonAssociation(
  documentId: string,
  personId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/v1/documents/${documentId}/people/${personId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove person association");
  }
  
  return response.json();
}

/**
 * Remove a document's association with a group
 */
export async function removeDocumentGroupAssociation(
  documentId: string,
  groupId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/v1/documents/${documentId}/groups/${groupId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove group association");
  }
  
  return response.json();
}

/**
 * Search for documents across the database
 */
export async function searchDocuments(params: {
  query: string;
  type?: string;
  visibility?: string;
}): Promise<DocumentListResponse> {
  const queryParams = new URLSearchParams();
  
  queryParams.append("query", params.query);
  if (params.type) queryParams.append("type", params.type);
  if (params.visibility) queryParams.append("visibility", params.visibility);
  
  const url = `/api/v1/documents/search?${queryParams.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to search documents");
  }
  
  return response.json();
}
