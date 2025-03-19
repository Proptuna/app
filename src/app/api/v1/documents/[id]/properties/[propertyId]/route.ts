import { NextRequest, NextResponse } from "next/server";
import { getCurrentOrganizationId } from "@/lib/organization";
import { removeDocumentPropertyAssociation } from "@/lib/documents";

/**
 * DELETE /api/v1/documents/:id/properties/:propertyId
 * Remove a document's association with a property
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; propertyId: string } }
) {
  const { id: documentId, propertyId } = params;
  
  // In a real implementation, get organizationId from auth context
  const organizationId = getCurrentOrganizationId();
  
  try {
    const result = await removeDocumentPropertyAssociation(
      documentId,
      propertyId,
      organizationId
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error removing property association from document ${documentId}:`, error);
    
    if (error.message.includes("not found") || error.message.includes("not accessible")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
