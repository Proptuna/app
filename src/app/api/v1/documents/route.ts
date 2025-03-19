import { NextRequest, NextResponse } from "next/server";
import { fetchDocuments, createDocument } from "@/lib/documents";

/**
 * GET /api/v1/documents
 * List all documents with pagination and filtering
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const cursor = searchParams.get("cursor") || undefined;
  const title = searchParams.get("title") || undefined;
  const type = searchParams.get("type") || undefined;
  const visibility = searchParams.get("visibility") || undefined;
  const propertyId = searchParams.get("property_id") || undefined;
  const personId = searchParams.get("person_id") || undefined;
  const groupId = searchParams.get("group_id") || undefined;

  // In a real implementation, get organizationId from auth context
  // For now we don't need organizationId as fetchDocuments doesn't require it

  try {
    const result = await fetchDocuments({
      limit,
      cursor,
      title,
      type,
      visibility,
      propertyId,
      personId,
      groupId,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/v1/documents
 * Create a new document
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: "Document type is required" },
        { status: 400 }
      );
    }

    if (!["internal", "external", "confidential"].includes(body.visibility)) {
      return NextResponse.json(
        { error: "Valid visibility value is required" },
        { status: 400 }
      );
    }

    // In a real implementation, get organizationId from auth context
    const organizationId = "123e4567-e89b-12d3-a456-426614174000";

    const document = await createDocument({
      ...body,
      organization_id: organizationId,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
