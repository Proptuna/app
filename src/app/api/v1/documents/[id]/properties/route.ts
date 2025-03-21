import { NextRequest, NextResponse } from "next/server";
import { associateDocumentWithProperty } from "@/lib/documents";

/**
 * POST /api/v1/documents/:id/properties
 * Associate a document with a property
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const documentId = params.id;
  
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.property_id) {
      return NextResponse.json(
        { error: "property_id is required" },
        { status: 400 }
      );
    }
    
    const association = await associateDocumentWithProperty(
      documentId,
      body.property_id,
      body.metadata || {}
    );
    
    return NextResponse.json(association, { status: 201 });
  } catch (error: any) {
    console.error(`Error associating document ${documentId} with property:`, error);
    
    if (error.message.includes("not found") || error.message.includes("not accessible")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
