import { NextRequest, NextResponse } from "next/server";
import { associateDocumentWithPerson } from "@/lib/documents";

/**
 * POST /api/v1/documents/:id/people
 * Associate a document with a person
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const documentId = params.id;
  
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.person_id) {
      return NextResponse.json(
        { error: "person_id is required" },
        { status: 400 }
      );
    }
    
    const association = await associateDocumentWithPerson(
      documentId,
      body.person_id,
      body.metadata || {}
    );
    
    return NextResponse.json(association, { status: 201 });
  } catch (error: any) {
    console.error(`Error associating document ${documentId} with person:`, error);
    
    if (error.message.includes("not found") || error.message.includes("not accessible")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
