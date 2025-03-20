import { NextRequest, NextResponse } from "next/server";
import { getCurrentOrganizationId } from "@/lib/organization";
import { removeDocumentTagAssociation } from "@/lib/documents";

/**
 * DELETE /api/v1/documents/:id/tags/:tagId
 * Remove a document's association with a tag
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; tagId: string } }
) {
  const { id: documentId, tagId } = params;
  
  // In a real implementation, get organizationId from auth context
  const organizationId = getCurrentOrganizationId();
  
  try {
    const result = await removeDocumentTagAssociation(
      documentId,
      tagId
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error removing tag association from document ${documentId}:`, error);
    
    if (error.message.includes("not found") || error.message.includes("not accessible")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
