import { NextRequest, NextResponse } from "next/server";
import { getDocumentById, updateDocument, deleteDocument } from "@/lib/documents";

/**
 * GET /api/v1/documents/:id
 * Get a specific document by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // In a real implementation, get organizationId from auth context
  const organizationId = "123e4567-e89b-12d3-a456-426614174000";

  try {
    const document = await getDocumentById(id, organizationId);
    return NextResponse.json(document);
  } catch (error: any) {
    console.error(`Error fetching document ${id}:`, error);
    
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { error: `Document with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/v1/documents/:id
 * Update a document
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const body = await request.json();
    
    // Basic validation
    if (body.visibility && !["internal", "external", "confidential"].includes(body.visibility)) {
      return NextResponse.json(
        { error: "Valid visibility value is required" },
        { status: 400 }
      );
    }
    
    // In a real implementation, get organizationId from auth context
    const organizationId = "123e4567-e89b-12d3-a456-426614174000";
    
    const updatedDocument = await updateDocument(id, body, organizationId);
    return NextResponse.json(updatedDocument);
  } catch (error: any) {
    console.error(`Error updating document ${id}:`, error);
    
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { error: `Document with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/documents/:id
 * Delete a document
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // In a real implementation, get organizationId from auth context
  const organizationId = "123e4567-e89b-12d3-a456-426614174000";
  
  try {
    const result = await deleteDocument(id, organizationId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error deleting document ${id}:`, error);
    
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { error: `Document with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
