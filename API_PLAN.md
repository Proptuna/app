# API Plan

## API Philosophy

Our API will follow these principles:

### 1. RESTful Design

- Follow RESTful conventions and best practices
- Utilize appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return appropriate HTTP status codes
- Use plural nouns for resource collections (e.g., `/documents` not `/document`)

### 2. Request/Response Format

- Use JSON for all request and response bodies
- Provide consistent response structures
- Include metadata for pagination and filtering
- Return detailed error messages and codes

### 3. Pagination (Stripe-style)

- Default limit of 10 items per page, maximum of 100
- Use cursor-based pagination with `starting_after` and `ending_before` parameters
- Include `has_more` flag in responses
- Provide `total_count` when available and requested

### 4. Error Handling

- Use standard HTTP status codes
- Include error codes and messages
- Provide actionable error information
- Log detailed errors on the server

## API Endpoints

### Documents API

#### Base URL

```bash
/api/v1/documents
```

#### API Versioning

We'll use URL path versioning for our API to ensure backward compatibility as the API evolves:

- All API routes will include a version number (e.g., `/api/v1/documents`)
- Major version changes (v1, v2, etc.) will be used for breaking changes
- Minor updates that maintain backward compatibility will be implemented within the same version
- When a new version is released, previous versions will be maintained for a deprecation period

#### Implementation with Next.js App Router

We'll implement the Documents API using Next.js App Router and the route handlers feature, which allows us to create API endpoints directly in the app directory.

```bash
src/
  app/
    api/
      v1/
        documents/
          route.ts                 # GET (list), POST (create)
          [id]/
            route.ts               # GET, PUT, DELETE
            properties/
              route.ts             # POST (associate)
              [propertyId]/
                route.ts           # DELETE (remove association)
            people/
              route.ts             # POST (associate)
              [personId]/
                route.ts           # DELETE (remove association)
            groups/
              route.ts             # POST (associate)
              [groupId]/
                route.ts           # DELETE (remove association)
```

#### Document Endpoints

##### 1. List Documents

```bash
GET /api/v1/documents
```

**Query Parameters:**

```bash
limit: number (default: 10, max: 100)
starting_after: string (document ID to start after)
ending_before: string (document ID to end before)
type: string (filter by document type)
visibility: string (filter by visibility)
property_id: uuid (filter by associated property)
person_id: uuid (filter by associated person)
group_id: uuid (filter by associated group)
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "visibility": "internal|external|confidential",
      "type": "string",
      "metadata": {},
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "version": number
    }
  ],
  "has_more": boolean,
  "total_count": number
}
```

##### 2. Get Document

```bash
GET /api/v1/documents/:id
```

**Description:**
Returns details for a specific document.

**Response:**

```json
{
  "id": "uuid",
  "title": "string",
  "data": "string",
  "visibility": "internal|external|confidential",
  "type": "string",
  "metadata": {},
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "version": number,
  "associations": {
    "properties": [
      {
        "id": "uuid",
        "address": "string"
      }
    ],
    "people": [
      {
        "id": "uuid",
        "name": "string",
        "type": "tenant|owner"
      }
    ],
    "groups": [
      {
        "id": "uuid",
        "name": "string"
      }
    ]
  }
}
```

##### 3. Create Document

```bash
POST /api/v1/documents
```

**Request Body:**

```json
{
  "title": "string",
  "data": "string",
  "visibility": "internal|external|confidential",
  "type": "string",
  "metadata": {},
  "associations": {
    "property_ids": ["uuid"],
    "person_ids": ["uuid"],
    "group_ids": ["uuid"]
  }
}
```

**Response:**
Same as Get Document response

##### 4. Update Document

```bash
PUT /api/v1/documents/:id
```

**Request Body:**

```json
{
  "title": "string",
  "data": "string",
  "visibility": "internal|external|confidential",
  "type": "string",
  "metadata": {}
}
```

**Response:**
Same as Get Document response

##### 5. Delete Document

```bash
DELETE /api/v1/documents/:id
```

**Response:**

```json
{
  "success": true,
  "id": "uuid"
}
```

##### 6. Associate Document with Property

```bash
POST /api/v1/documents/:id/properties
```

**Request Body:**

```json
{
  "property_id": "uuid",
  "metadata": {}
}
```

**Response:**

```json
{
  "id": "uuid",
  "document_id": "uuid",
  "property_id": "uuid",
  "metadata": {},
  "created_at": "timestamp"
}
```

##### 7. Associate Document with Person

```bash
POST /api/v1/documents/:id/people
```

**Request Body:**

```json
{
  "person_id": "uuid",
  "metadata": {}
}
```

**Response:**

```json
{
  "id": "uuid",
  "document_id": "uuid",
  "person_id": "uuid",
  "metadata": {},
  "created_at": "timestamp"
}
```

##### 8. Associate Document with Group

```bash
POST /api/v1/documents/:id/groups
```

**Request Body:**

```json
{
  "group_id": "uuid",
  "metadata": {}
}
```

**Response:**

```json
{
  "id": "uuid",
  "document_id": "uuid",
  "group_id": "uuid",
  "metadata": {},
  "created_at": "timestamp"
}
```

##### 9. Remove Document Association

```bash
DELETE /api/v1/documents/:id/properties/:property_id
DELETE /api/v1/documents/:id/people/:person_id
DELETE /api/v1/documents/:id/groups/:group_id
```

**Response:**

```json
{
  "success": true
}
```

## API Implementation Progress

### Completed
- **Documents API**
  - Implemented data access layer with Supabase integration
  - Created RESTful API routes in Next.js with versioning (v1)
  - Added support for associating documents with properties, people, and groups
  - Created client-side service for accessing the API
  - Integrated AG Grid for improved document display and filtering

### Next Steps
- Complete authentication and authorization layer
- Implement document versioning
- Add document type-specific handling for escalation policies
- Develop Jobs and Tasks APIs
- Implement Conversations API

## Implementation Plan

### Documents API Implementation

1. **Setup API Routes Structure**:

   - Create the directory structure for API routes in the Next.js app directory
   - Define route handlers for each endpoint

2. **Create Database Access Layer**:

   - Define Supabase queries for document operations
   - Implement pagination and filtering
   - Handle document associations

3. **Frontend Integration**:
   - Update the documents page to use the API
   - Implement document creation, editing, and deletion
   - Add association management UI
   - **Use AG Grid for tables**: We'll replace the current table implementation with AG Grid (https://www.ag-grid.com/) for enhanced data grid capabilities, including:
     - Advanced filtering and sorting
     - Row grouping
     - Column resizing and reordering
     - Excel-like features
     - Improved performance with large datasets
     - we want the ability to add or remove associations and have them persist

### Implementation with Next.js and Supabase

#### 1. Supabase Document Data Access Layer

```typescript
// src/lib/documents.ts
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

// More document functions here...
```

#### 2. Next.js App Router API Implementation

```typescript
// src/app/api/v1/documents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDocuments, createDocument } from "@/lib/documents";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const startingAfter = searchParams.get("starting_after") || undefined;
  const endingBefore = searchParams.get("ending_before") || undefined;
  const type = searchParams.get("type") || undefined;
  const visibility = searchParams.get("visibility") || undefined;
  const propertyId = searchParams.get("property_id") || undefined;
  const personId = searchParams.get("person_id") || undefined;
  const groupId = searchParams.get("group_id") || undefined;

  // In a real implementation, get organizationId from auth context
  const organizationId = "123e4567-e89b-12d3-a456-426614174000";

  try {
    const result = await getDocuments({
      limit,
      startingAfter,
      endingBefore,
      type,
      visibility,
      propertyId,
      personId,
      groupId,
      organizationId,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation would go here

    // In a real implementation, get organizationId from auth context
    const organizationId = "123e4567-e89b-12d3-a456-426614174000";

    const document = await createDocument({
      ...body,
      organization_id: organizationId,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

This approach gives us a solid foundation for the Documents API using Next.js App Router and Supabase, which we can build upon to expand to other API areas later.
