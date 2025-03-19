import { supabase } from "./supabase";

export interface Document {
  id: string;
  title: string;
  data: string;
  visibility: "internal" | "external" | "confidential";
  type: string;
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  version: number;
}

export interface DocumentAssociation {
  id: string;
  document_id: string;
  property_id?: string;
  person_id?: string;
  group_id?: string;
  metadata: Record<string, any>;
  created_at?: string;
}

/**
 * Get a list of documents with filtering
 */
export async function getDocuments(params: {
  type?: string;
  visibility?: string;
  propertyId?: string;
  personId?: string;
  groupId?: string;
}) {
  let query = supabase
    .from("documents")
    .select("*", { count: "exact" });

  // Apply filters
  if (params.type) {
    query = query.eq("type", params.type);
  }

  if (params.visibility) {
    query = query.eq("visibility", params.visibility);
  }

  // Handle property, person, and group filtering through associations
  if (params.propertyId) {
    const propertyDocs = await supabase
      .from("document_property_associations")
      .select("document_id")
      .eq("property_id", params.propertyId);

    if (propertyDocs.data) {
      const docIds = propertyDocs.data.map((d) => d.document_id);
      query = query.in("id", docIds);
    }
  }

  if (params.personId) {
    const personDocs = await supabase
      .from("document_person_associations")
      .select("document_id")
      .eq("person_id", params.personId);

    if (personDocs.data) {
      const docIds = personDocs.data.map((d) => d.document_id);
      query = query.in("id", docIds);
    }
  }

  if (params.groupId) {
    const groupDocs = await supabase
      .from("document_group_associations")
      .select("document_id")
      .eq("group_id", params.groupId);

    if (groupDocs.data) {
      const docIds = groupDocs.data.map((d) => d.document_id);
      query = query.in("id", docIds);
    }
  }

  // Execute query and format response
  const { data, count, error } = await query;

  if (error) {
    throw error;
  }

  return {
    data,
    total_count: count || 0,
  };
}

/**
 * Get a single document by ID
 */
export async function getDocumentById(id: string) {
  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  if (!document) {
    throw new Error(`Document with ID ${id} not found`);
  }

  // Get document associations
  const associations = await getDocumentAssociations(id);

  return {
    ...document,
    associations,
  };
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
}) {
  // Insert the document
  const { data: newDocument, error } = await supabase
    .from("documents")
    .insert({
      title: document.title,
      data: document.data,
      visibility: document.visibility,
      type: document.type,
      metadata: document.metadata || {},
      version: 1, // Initial version
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Create associations if provided
  if (document.associations) {
    await createDocumentAssociations(newDocument.id, document.associations);
  }

  // Get the document with its associations
  return getDocumentById(newDocument.id);
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
) {
  // Get the current document to increment version
  const { data: currentDocument, error: fetchError } = await supabase
    .from("documents")
    .select("version")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!currentDocument) {
    throw new Error(`Document with ID ${id} not found`);
  }

  // Update the document with incremented version
  const { data: updatedDocument, error: updateError } = await supabase
    .from("documents")
    .update({
      ...updates,
      version: (currentDocument.version || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  // Get the document with its associations
  return getDocumentById(id);
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string) {
  // Check if document exists
  const { data: document, error: fetchError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!document) {
    throw new Error(`Document with ID ${id} not found`);
  }

  // Delete associations first
  await Promise.all([
    supabase.from("document_property_associations").delete().eq("document_id", id),
    supabase.from("document_person_associations").delete().eq("document_id", id),
    supabase.from("document_group_associations").delete().eq("document_id", id),
  ]);

  // Delete the document
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw deleteError;
  }

  return {
    success: true,
    id,
  };
}

/**
 * Get all associations for a document
 */
export async function getDocumentAssociations(documentId: string) {
  const [propertyResults, personResults, groupResults] = await Promise.all([
    supabase
      .from("document_property_associations")
      .select("document_id, property_id, properties(id, address)")
      .eq("document_id", documentId),

    supabase
      .from("document_person_associations")
      .select("document_id, person_id, people(id, name, type)")
      .eq("document_id", documentId),

    supabase
      .from("document_group_associations")
      .select("document_id, group_id, groups(id, name)")
      .eq("document_id", documentId),
  ]);

  // Extract properties
  const properties = propertyResults.data
    ? propertyResults.data.map((item) => item.properties)
    : [];

  // Extract people
  const people = personResults.data
    ? personResults.data.map((item) => item.people)
    : [];

  // Extract groups
  const groups = groupResults.data
    ? groupResults.data.map((item) => item.groups)
    : [];

  return {
    properties,
    people,
    groups,
  };
}

/**
 * Create document associations
 */
export async function createDocumentAssociations(
  documentId: string,
  associations: {
    property_ids?: string[];
    person_ids?: string[];
    group_ids?: string[];
  }
) {
  const { property_ids = [], person_ids = [], group_ids = [] } = associations;

  const propertyAssociations = property_ids.map((property_id) => ({
    document_id: documentId,
    property_id,
    metadata: {},
  }));

  const personAssociations = person_ids.map((person_id) => ({
    document_id: documentId,
    person_id,
    metadata: {},
  }));

  const groupAssociations = group_ids.map((group_id) => ({
    document_id: documentId,
    group_id,
    metadata: {},
  }));

  // Create associations in parallel
  await Promise.all([
    propertyAssociations.length > 0
      ? supabase.from("document_property_associations").insert(propertyAssociations)
      : null,
    personAssociations.length > 0
      ? supabase.from("document_person_associations").insert(personAssociations)
      : null,
    groupAssociations.length > 0
      ? supabase.from("document_group_associations").insert(groupAssociations)
      : null,
  ]);
}

/**
 * Associate a document with a property
 */
export async function associateDocumentWithProperty(
  documentId: string,
  propertyId: string,
  metadata: Record<string, any> = {}
) {
  // Verify document exists
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // Verify property exists
  const { data: property, error: propError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .single();

  if (propError || !property) {
    throw new Error(`Property with ID ${propertyId} not found`);
  }

  // Create association
  const { data: association, error } = await supabase
    .from("document_property_associations")
    .insert({
      document_id: documentId,
      property_id: propertyId,
      metadata,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return association;
}

/**
 * Associate a document with a person
 */
export async function associateDocumentWithPerson(
  documentId: string,
  personId: string,
  metadata: Record<string, any> = {}
) {
  // Verify document exists
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // Verify person exists
  const { data: person, error: personError } = await supabase
    .from("people")
    .select("id")
    .eq("id", personId)
    .single();

  if (personError || !person) {
    throw new Error(`Person with ID ${personId} not found`);
  }

  // Create association
  const { data: association, error } = await supabase
    .from("document_person_associations")
    .insert({
      document_id: documentId,
      person_id: personId,
      metadata,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return association;
}

/**
 * Associate a document with a group
 */
export async function associateDocumentWithGroup(
  documentId: string,
  groupId: string,
  metadata: Record<string, any> = {}
) {
  // Verify document exists
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // Verify group exists
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("id", groupId)
    .single();

  if (groupError || !group) {
    throw new Error(`Group with ID ${groupId} not found`);
  }

  // Create association
  const { data: association, error } = await supabase
    .from("document_group_associations")
    .insert({
      document_id: documentId,
      group_id: groupId,
      metadata,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return association;
}

/**
 * Remove a document's association with a property
 */
export async function removeDocumentPropertyAssociation(
  documentId: string,
  propertyId: string
) {
  // Verify document exists
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // Remove association
  const { error } = await supabase
    .from("document_property_associations")
    .delete()
    .eq("document_id", documentId)
    .eq("property_id", propertyId);

  if (error) {
    throw error;
  }

  return { success: true };
}

/**
 * Remove a document's association with a person
 */
export async function removeDocumentPersonAssociation(
  documentId: string,
  personId: string
) {
  // Verify document exists
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // Remove association
  const { error } = await supabase
    .from("document_person_associations")
    .delete()
    .eq("document_id", documentId)
    .eq("person_id", personId);

  if (error) {
    throw error;
  }

  return { success: true };
}

/**
 * Remove a document's association with a group
 */
export async function removeDocumentGroupAssociation(
  documentId: string,
  groupId: string
) {
  // Verify document exists
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // Remove association
  const { error } = await supabase
    .from("document_group_associations")
    .delete()
    .eq("document_id", documentId)
    .eq("group_id", groupId);

  if (error) {
    throw error;
  }

  return { success: true };
}

/**
 * Search for documents across the entire database
 */
export async function searchDocuments(params: {
  searchQuery: string;
  limit?: number;
  startingAfter?: string;
  type?: string;
  visibility?: string;
}) {
  let query = supabase
    .from("documents")
    .select("*", { count: "exact" });

  // Apply search filter - using ilike for case-insensitive search
  if (params.searchQuery) {
    query = query.or(`title.ilike.%${params.searchQuery}%, data.ilike.%${params.searchQuery}%`);
  }

  // Apply additional filters
  if (params.type) {
    query = query.eq("type", params.type);
  }

  if (params.visibility) {
    query = query.eq("visibility", params.visibility);
  }

  // Apply pagination
  const limit = Math.min(params.limit || 10, 100);
  query = query.limit(limit);

  if (params.startingAfter) {
    const startDoc = await supabase
      .from("documents")
      .select("created_at")
      .eq("id", params.startingAfter)
      .single();

    if (startDoc.data) {
      query = query.lt("created_at", startDoc.data.created_at);
    }
  }

  // Order by created_at for consistent pagination
  query = query.order("created_at", { ascending: false });

  // Execute query and format response
  const { data, count, error } = await query;

  if (error) {
    throw error;
  }

  return {
    data,
    has_more: (count || 0) > (data?.length || 0),
    total_count: count || 0,
  };
}

/**
 * Fetch documents with filtering
 */
export async function fetchDocuments(params: {
  title?: string;
  type?: string;
  visibility?: string;
  property_id?: string;
  person_id?: string;
  group_id?: string;
}): Promise<{
  object: string;
  data: any[];
  has_more: boolean;
  url: string;
}> {
  try {
    // Initialize Supabase query
    let query = supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (params.title) {
      query = query.ilike("title", `%${params.title}%`);
    }

    if (params.type) {
      query = query.eq("type", params.type);
    }

    if (params.visibility) {
      query = query.eq("visibility", params.visibility);
    }

    // Handle property association filter
    if (params.property_id) {
      const { data: documentIds } = await supabase
        .from("document_property_associations")
        .select("document_id")
        .eq("property_id", params.property_id);

      if (documentIds && documentIds.length > 0) {
        const ids = documentIds.map(item => item.document_id);
        query = query.in("id", ids);
      } else {
        return {
          object: "list",
          data: [],
          has_more: false,
          url: "/api/v1/documents"
        };
      }
    }

    // Handle person association filter
    if (params.person_id) {
      const { data: documentIds } = await supabase
        .from("document_person_associations")
        .select("document_id")
        .eq("person_id", params.person_id);

      if (documentIds && documentIds.length > 0) {
        const ids = documentIds.map(item => item.document_id);
        query = query.in("id", ids);
      } else {
        return {
          object: "list",
          data: [],
          has_more: false,
          url: "/api/v1/documents"
        };
      }
    }

    // Handle group association filter
    if (params.group_id) {
      const { data: documentIds } = await supabase
        .from("document_group_associations")
        .select("document_id")
        .eq("group_id", params.group_id);

      if (documentIds && documentIds.length > 0) {
        const ids = documentIds.map(item => item.document_id);
        query = query.in("id", ids);
      } else {
        return {
          object: "list",
          data: [],
          has_more: false,
          url: "/api/v1/documents"
        };
      }
    }

    // Execute the query to get all documents
    const { data: documents, error } = await query;

    if (error) {
      console.error("Error fetching documents:", error);
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    console.log(`Found ${documents?.length || 0} documents`);

    // Include document associations
    if (documents) {
      for (const doc of documents) {
        try {
          // Get property associations
          const { data: propertyAssocs } = await supabase
            .from("document_property_associations")
            .select("property_id")
            .eq("document_id", doc.id);
          
          doc.document_property_associations = propertyAssocs || [];
          
          // Get person associations
          const { data: personAssocs } = await supabase
            .from("document_person_associations")
            .select("person_id")
            .eq("document_id", doc.id);
          
          doc.document_person_associations = personAssocs || [];
          
          // Get group associations
          const { data: groupAssocs } = await supabase
            .from("document_group_associations")
            .select("group_id")
            .eq("document_id", doc.id);
          
          doc.document_group_associations = groupAssocs || [];
        } catch (assocError) {
          console.error(`Error fetching associations for document ${doc.id}:`, assocError);
          // Continue with the document, even if associations failed
          doc.document_property_associations = [];
          doc.document_person_associations = [];
          doc.document_group_associations = [];
        }
      }
    }

    return {
      object: "list",
      data: documents || [],
      has_more: false,
      url: "/api/v1/documents"
    };
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }
}