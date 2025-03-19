import { NextRequest, NextResponse } from "next/server";
import { associateDocumentWithGroup } from "@/lib/documents";

/**
 * POST /api/v1/documents/:id/groups
 * Associate a document with a group
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const documentId = params.id;
  
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.group_id) {
      return NextResponse.json(
        { error: "group_id is required" },
        { status: 400 }
      );
    }
    
    // In a real implementation, get organizationId from auth context
    const organizationId = "123e4567-e89b-12d3-a456-426614174000";
    
    const association = await associateDocumentWithGroup(
      documentId,
      body.group_id,
      body.metadata || {},
      organizationId
    );
    
    return NextResponse.json(association, { status: 201 });
  } catch (error: any) {
    console.error(`Error associating document ${documentId} with group:`, error);
    
    if (error.message.includes("not found") || error.message.includes("not accessible")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
