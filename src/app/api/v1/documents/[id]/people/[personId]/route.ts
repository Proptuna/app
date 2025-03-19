import { NextRequest, NextResponse } from "next/server";
import { getCurrentOrganizationId } from "@/lib/organization";
import { removeDocumentPersonAssociation } from "@/lib/documents";

/**
 * DELETE /api/v1/documents/:id/people/:personId
 * Remove a document's association with a person
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; personId: string } }
) {
  const { id: documentId, personId } = params;
  
  // In a real implementation, get organizationId from auth context
  const organizationId = getCurrentOrganizationId();
  
  try {
    const result = await removeDocumentPersonAssociation(
      documentId,
      personId,
      organizationId
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error removing person association from document ${documentId}:`, error);
    
    if (error.message.includes("not found") || error.message.includes("not accessible")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
