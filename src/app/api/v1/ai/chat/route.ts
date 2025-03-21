import { NextRequest, NextResponse } from "next/server";
import { Message, ChatOptions } from "@/types/llm";
import { generateChatCompletion, fetchRelevantDocuments } from "@/lib/llm-client";
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { messages, options = {} }: { messages: Message[], options: ChatOptions } = await request.json();

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: Messages array is required" },
        { status: 400 }
      );
    }

    // Load system prompt from file
    const promptPath = path.join(process.cwd(), 'src', 'prompts', 'agent.prompt.txt');
    let systemPrompt = '';
    
    try {
      systemPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch (error) {
      console.error('Error loading system prompt:', error);
      systemPrompt = "You are an AI assistant for Proptuna, a property management platform.";
    }

    // Add system message at the beginning if it doesn't exist
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    
    // Create a properly typed system message
    const systemMessage: Message = {
      role: 'system',
      content: systemPrompt,
      timestamp: new Date().toISOString()
    };
    
    const messagesWithSystem = hasSystemMessage 
      ? messages 
      : [systemMessage, ...messages];

    try {
      // Generate completion
      const response = await generateChatCompletion(messagesWithSystem, options);
      
      // Return the response
      return NextResponse.json(response);
    } catch (error: any) {
      console.error("Error in AI chat route:", error);
      
      return NextResponse.json(
        { 
          error: "Failed to generate response",
          details: error.message,
          role: 'assistant',
          content: "I'm sorry, but I encountered an error while processing your request. Please try again later.",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing request:", error);
    
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 400 }
    );
  }
}

// Updated to handle tool calls by connecting to real data sources - placeholder
async function processToolCall(name: string, args: any): Promise<any> {
  switch (name) {
    case 'searchDocuments':
      const { query, limit = 3 } = args;
      // Fetch documents matching the query, but don't fetch all documents
      const relevantDocs = await fetchRelevantDocuments(query, undefined, false);
      
      // Format the results for display
      return relevantDocs.map(doc => {
        // Create a content snippet for display
        const contentSnippet = doc.content 
          ? doc.content.substring(0, 200) + (doc.content.length > 200 ? '...' : '') 
          : 'No content available';
          
        // Create a formatted reference with angle brackets and markdown link
        const formattedReference = `<${doc.id}> [${doc.title}](/documents/${doc.id})`;
        
        return {
          id: doc.id,
          title: doc.title,
          type: doc.type,
          relevance: doc.relevance,
          url: `/documents/${doc.id}`,
          contentSnippet,
          visibility: doc.visibility,
          reference: formattedReference,
          formattedOutput: `**${doc.title}** (${doc.type})\nID: <${doc.id}>\nRelevance: ${doc.relevance}\n\n${contentSnippet}\n\n[View document](/documents/${doc.id})`,
          created_at: doc.created_at || 'unknown'
        };
      });
    
    case 'createMaintenanceTask':
      const { description, property, priority = "medium", contactInfo } = args;
      
      // This would become an actual database call to create a maintenance task
      return { 
        taskId: `task-${Date.now()}`,
        status: 'created',
        priority,
        property: typeof property === 'string' ? property : 'Unknown property',
        description,
        createdAt: new Date().toISOString(),
        estimatedResponse: priority === "high" ? "Within 4 hours" : "Within 24-48 hours",
        message: `Maintenance task created`
      };
    
    case 'getPropertyInfo':
      const { propertyId } = args;
      
      // This would become an actual database call to get property info
      return {
        id: propertyId || 'unknown',
        address: 'To be replaced with database lookup',
        status: 'Query not implemented yet',
        message: 'Property information retrieval will be implemented with actual database queries.'
      };
      
    case 'getDocumentById':
      const { documentId } = args;
      
      // Fetch the document from Supabase via our document client
      const documentResults = await fetchRelevantDocuments("", documentId, false);
      
      if (!documentResults || documentResults.length === 0) {
        return {
          error: `Document with ID ${documentId} not found`,
          success: false
        };
      }
      
      const document = documentResults[0];
      
      // Extract associations for display
      const propertyAssociations = document.associations?.properties || [];
      const personAssociations = document.associations?.people || [];
      const tagAssociations = document.associations?.tags || [];
      
      // Create a formatted content snippet for preview
      const contentSnippet = document.content 
        ? document.content.substring(0, 300) + (document.content.length > 300 ? '...' : '')
        : 'No content available';
        
      // Create a formatted reference with angle brackets and markdown link
      const formattedReference = `<${document.id}> [${document.title}](/documents/${document.id})`;
        
      return {
        id: document.id,
        title: document.title,
        type: document.type,
        content: document.content,
        contentSnippet: contentSnippet,
        created_at: document.created_at || 'unknown',
        updated_at: document.updated_at || 'unknown',
        visibility: document.visibility || 'unknown',
        url: `/documents/${document.id}`,
        associations: {
          properties: propertyAssociations.length > 0 
            ? propertyAssociations.map((p: { address?: string; id: string }) => `${p.address || p.id}`) 
            : ['No associated properties'],
          people: personAssociations.length > 0 
            ? personAssociations.map((p: { name?: string; id: string; type?: string }) => `${p.name || p.id} (${p.type || 'unknown'})`) 
            : ['No associated people'],
          tags: tagAssociations.length > 0 
            ? tagAssociations.map((t: { name: string }) => t.name) 
            : ['No tags']
        },
        reference: formattedReference,
        formattedOutput: `Document: **${document.title}** (${document.type})\n\nID: <${document.id}>\nVisibility: ${document.visibility || 'unknown'}\nCreated: ${document.created_at || 'unknown'}\n\n**Content:**\n${contentSnippet}\n\n**Reference:** [View full document](/documents/${document.id})`,
        success: true
      };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
