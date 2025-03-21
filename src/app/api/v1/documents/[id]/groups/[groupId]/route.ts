import { NextRequest, NextResponse } from "next/server";
import { removeDocumentTagAssociation } from "@/lib/documents";

/**
 * DELETE /api/v1/documents/:id/groups/:groupId
 * Remove a document's association with a group (using tags since groups are implemented as tags)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; groupId: string } }
) {
  const { id: documentId, groupId } = params;
  
  // Using tagId since groups are implemented as tags
  const tagId = groupId;
  
  try {
    const result = await removeDocumentTagAssociation(
      documentId,
      tagId
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
