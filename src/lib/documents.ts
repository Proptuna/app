import { supabase } from "./supabase";

export interface Document {
  id: string;
  organization_id: string;
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
 * Get a list of documents with pagination and filtering
 */
export async function getDocuments(params: {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  type?: string;
  visibility?: string;
  propertyId?: string;
  personId?: string;
  groupId?: string;
  organizationId: string;
}) {
  let query = supabase
    .from("documents")
    .select("*", { count: "exact" })
    .eq("organization_id", params.organizationId);

  // Apply filters
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
      query = query.gt("created_at", startDoc.data.created_at);
    }
  }

  if (params.endingBefore) {
    const endDoc = await supabase
      .from("documents")
      .select("created_at")
      .eq("id", params.endingBefore)
      .single();

    if (endDoc.data) {
      query = query.lt("created_at", endDoc.data.created_at);
    }
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
  const { data, count, error } = await query.order("created_at", {
    ascending: false,
  });

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
 * Get a single document by ID
 */
export async function getDocumentById(id: string, organizationId: string) {
  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organizationId)
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
  organization_id: string;
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
      organization_id: document.organization_id,
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
  return getDocumentById(newDocument.id, document.organization_id);
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
  },
  organizationId: string
) {
  // Get the current document to increment version
  const { data: currentDocument, error: fetchError } = await supabase
    .from("documents")
    .select("version")
    .eq("id", id)
    .eq("organization_id", organizationId)
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
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  // Get the document with its associations
  return getDocumentById(id, organizationId);
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string, organizationId: string) {
  // Check if document exists and belongs to organization
  const { data: document, error: fetchError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", id)
    .eq("organization_id", organizationId)
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
    .eq("id", id)
    .eq("organization_id", organizationId);

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
  metadata: Record<string, any> = {},
  organizationId: string
) {
  // Verify document exists and belongs to organization
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("organization_id", organizationId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found or not accessible`);
  }

  // Verify property exists and belongs to organization
  const { data: property, error: propError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("account_id", organizationId)
    .single();

  if (propError || !property) {
    throw new Error(`Property with ID ${propertyId} not found or not accessible`);
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
  metadata: Record<string, any> = {},
  organizationId: string
) {
  // Verify document exists and belongs to organization
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("organization_id", organizationId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found or not accessible`);
  }

  // Verify person exists and belongs to organization
  const { data: person, error: personError } = await supabase
    .from("people")
    .select("id")
    .eq("id", personId)
    .eq("account_id", organizationId)
    .single();

  if (personError || !person) {
    throw new Error(`Person with ID ${personId} not found or not accessible`);
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
  metadata: Record<string, any> = {},
  organizationId: string
) {
  // Verify document exists and belongs to organization
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("organization_id", organizationId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found or not accessible`);
  }

  // Verify group exists and belongs to organization
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("id", groupId)
    .eq("account_id", organizationId)
    .single();

  if (groupError || !group) {
    throw new Error(`Group with ID ${groupId} not found or not accessible`);
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
  propertyId: string,
  organizationId: string
) {
  // Verify document exists and belongs to organization
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("organization_id", organizationId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found or not accessible`);
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
  personId: string,
  organizationId: string
) {
  // Verify document exists and belongs to organization
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("organization_id", organizationId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found or not accessible`);
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
  groupId: string,
  organizationId: string
) {
  // Verify document exists and belongs to organization
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("organization_id", organizationId)
    .single();

  if (docError || !document) {
    throw new Error(`Document with ID ${documentId} not found or not accessible`);
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
 * Fetch documents with filtering and pagination
 */
export async function fetchDocuments(params: {
  limit?: number;
  cursor?: string;
  title?: string;
  type?: string;
  visibility?: string;
  propertyId?: string;
  personId?: string;
  groupId?: string;
}) {
  // Start building the query
  let query = supabase
    .from("documents")
    .select("*, document_property_associations(property_id), document_person_associations(person_id), document_group_associations(group_id)", {
      count: "exact",
    });

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

  // Cursor-based pagination
  if (params.cursor) {
    // If we have a cursor, get items created before that timestamp
    query = query.lt("created_at", params.cursor);
  }

  // Set limit (+1 to check if there's more)
  const limit = params.limit || 10;
  query = query.limit(limit + 1);

  // Property associations filter
  if (params.propertyId) {
    const propertyDocs = await supabase
      .from("document_property_associations")
      .select("document_id")
      .eq("property_id", params.propertyId);

    if (propertyDocs.data) {
      const docIds = propertyDocs.data.map((d: { document_id: string }) => d.document_id);
      if (docIds.length > 0) {
        query = query.in("id", docIds);
      } else {
        // If no documents match the property, return empty result
        return {
          data: [],
          has_more: false,
          total_count: 0,
          next_cursor: null,
        };
      }
    }
  }

  // Person associations filter
  if (params.personId) {
    const personDocs = await supabase
      .from("document_person_associations")
      .select("document_id")
      .eq("person_id", params.personId);

    if (personDocs.data) {
      const docIds = personDocs.data.map((d: { document_id: string }) => d.document_id);
      if (docIds.length > 0) {
        query = query.in("id", docIds);
      } else {
        // If no documents match the person, return empty result
        return {
          data: [],
          has_more: false,
          total_count: 0,
          next_cursor: null,
        };
      }
    }
  }

  if (params.groupId) {
    const groupDocs = await supabase
      .from("document_group_associations")
      .select("document_id")
      .eq("group_id", params.groupId);

    if (groupDocs.data) {
      const docIds = groupDocs.data.map((d: { document_id: string }) => d.document_id);
      if (docIds.length > 0) {
        query = query.in("id", docIds);
      } else {
        // If no documents match the group, return empty result
        return {
          data: [],
          has_more: false,
          total_count: 0,
          next_cursor: null,
        };
      }
    }
  }

  // Execute query and format response
  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      data: [],
      has_more: false,
      total_count: 0,
      next_cursor: null,
    };
  }

  // Check if we have more results than the requested limit
  const hasMore = data.length > limit;

  // Return only the requested amount
  const results = hasMore ? data.slice(0, limit) : data;

  // Get the cursor for the next page (timestamp of the last item)
  const nextCursor = hasMore ? results[results.length - 1].created_at : null;

  return {
    data: results,
    has_more: hasMore,
    total_count: hasMore ? undefined : results.length, // We don't know the total if there are more pages
    next_cursor: nextCursor,
  };
}
