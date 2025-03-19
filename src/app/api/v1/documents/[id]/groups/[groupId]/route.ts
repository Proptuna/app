import { NextRequest, NextResponse } from "next/server";
import { removeDocumentGroupAssociation } from "@/lib/documents";

/**
 * DELETE /api/v1/documents/:id/groups/:groupId
 * Remove a document's association with a group
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; groupId: string } }
) {
  const { id: documentId, groupId } = params;
  
  // In a real implementation, get organizationId from auth context
  const organizationId = "123e4567-e89b-12d3-a456-426614174000";
  
  try {
    const result = await removeDocumentGroupAssociation(
      documentId,
      groupId,
      organizationId
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Error removing group association from document ${documentId}:`, error);
    
    if (error.message.includes("not found") || error.message.includes("not accessible")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
