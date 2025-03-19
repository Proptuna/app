import { NextRequest, NextResponse } from "next/server";
import { fetchDocuments, createDocument } from "@/lib/documents";

/**
 * GET /api/v1/documents
 * List all documents with pagination and filtering
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    const result = await fetchDocuments({});

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

    const document = await createDocument({
      ...body
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
