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
      console.log("Successfully loaded prompt from file");
    } catch (error) {
      console.error('Error loading system prompt:', error);
      // Fallback prompt if file can't be loaded
      systemPrompt = `You are an AI assistant for Proptuna, a property management platform.

Your primary responsibilities include:
1. Answering questions about properties, maintenance, and tenant concerns
2. Helping users diagnose and troubleshoot maintenance issues
3. Creating maintenance tasks when necessary
4. Providing information from available documents when relevant

DOCUMENT HANDLING:
- When you find relevant information in a document, include both the document ID and a markdown link
- The system will handle making these references clickable for the user
- If multiple documents have relevant information, reference all of them

MAINTENANCE TASKS:
- For maintenance issues, collect necessary information and create a task
- Set appropriate priority based on severity
- After creating the task, provide a helpful response with next steps`;
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
      
      // Check if response is an array (multiple messages, e.g. for maintenance tasks)
      if (Array.isArray(response)) {
        // Return the first message with an indicator that there are follow-up messages
        const mainResponse = response[0];
        const hasFollowUps = response.length > 1;
        
        // Return the response with follow-up messages
        return NextResponse.json({
          ...mainResponse,
          followUpMessages: hasFollowUps ? response.slice(1) : undefined
        });
      }
      
      // Return the single response message
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
      try {
        // Fetch documents matching the query, but don't fetch all documents
        const relevantDocs = await fetchRelevantDocuments(query, undefined, false);
        
        // Format the results for display
        return relevantDocs.map(doc => {
          // Create a content snippet for display
          const contentSnippet = doc.content 
            ? doc.content.substring(0, 200) + (doc.content.length > 200 ? '...' : '') 
            : 'No content available';
          
          // Generate the correct URL for the document
          const documentUrl = `/documents-page?docId=${doc.id}`;
            
          // Create a formatted reference with angle brackets and markdown link
          const formattedReference = `<${doc.id}> [${doc.title}](${documentUrl})`;
          
          return {
            id: doc.id,
            title: doc.title,
            type: doc.type,
            relevance: doc.relevance,
            url: documentUrl,
            contentSnippet,
            visibility: doc.visibility,
            reference: formattedReference,
            formattedOutput: `**${doc.title}** (${doc.type})\nID: <${doc.id}>\nRelevance: ${doc.relevance}\n\n${contentSnippet}\n\n[View document](${documentUrl})`,
            created_at: doc.created_at || 'unknown'
          };
        });
      } catch (error: any) {
        console.error(`Error searching documents:`, error);
        return {
          error: error.message || `Failed to search documents`,
          success: false
        };
      }
    
    case 'createMaintenanceTask':
      const { description, property, priority = "medium", contact } = args;
      
      // This would become an actual database call to create a maintenance task
      return { 
        taskId: `task-${Date.now()}`,
        status: 'created',
        priority,
        property: typeof property === 'string' ? property : 'Unknown property',
        description,
        contact,
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
      
      if (!documentId) {
        return {
          error: "Document ID is required",
          success: false
        };
      }
      
      try {
        // Fetch the document from Supabase via our document client
        const documentResults = await fetchRelevantDocuments("", documentId, false);
        
        if (!documentResults || documentResults.length === 0) {
          console.error(`Could not find document with ID ${documentId}`);
          return {
            error: `Document with ID ${documentId} not found`,
            success: false
          };
        }
        
        const document = documentResults[0];
        
        // Generate the correct URL for the document
        const documentUrl = `/documents-page?docId=${document.id}`;
        
        // Extract associations for display
        const propertyAssociations = document.associations?.properties || [];
        const personAssociations = document.associations?.people || [];
        const tagAssociations = document.associations?.tags || [];
        
        // Create a formatted content snippet for preview
        const contentSnippet = document.content 
          ? document.content.substring(0, 300) + (document.content.length > 300 ? '...' : '')
          : 'No content available';
          
        // Create a formatted reference with angle brackets and markdown link
        const formattedReference = `<${document.id}> [${document.title}](${documentUrl})`;
          
        return {
          id: document.id,
          title: document.title,
          type: document.type,
          content: document.content,
          contentSnippet: contentSnippet,
          created_at: document.created_at || 'unknown',
          updated_at: document.updated_at || 'unknown',
          visibility: document.visibility || 'unknown',
          url: documentUrl,
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
          formattedOutput: `Document: **${document.title}** (${document.type})\n\nID: <${document.id}>\nVisibility: ${document.visibility || 'unknown'}\nCreated: ${document.created_at || 'unknown'}\n\n**Content:**\n${contentSnippet}\n\n**Reference:** [View full document](${documentUrl})`,
          success: true
        };
      } catch (error: any) {
        console.error(`Error fetching document with ID ${documentId}:`, error);
        return {
          error: error.message || `Failed to fetch document with ID ${documentId}`,
          success: false
        };
      }
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
