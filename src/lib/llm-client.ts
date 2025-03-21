import { 
  ChatOptions, 
  ChatCompletionRequest, 
  ChatCompletionResponse,
  Message,
  ToolUse,
  DocumentReference
} from "@/types/llm";
import { agentPrompt } from "../prompts/agent.prompt";

// OpenRouter models
const MODELS = {
  GEMINI_FLASH: "google/gemini-2.0-flash-001",
  GPT_4: "openai/gpt-4-turbo",
  CLAUDE: "anthropic/claude-3-haiku"
};

// Default model to use
const DEFAULT_MODEL = MODELS.GEMINI_FLASH;

// Define the tools we'll use
const TOOLS = [
  {
    type: "function",
    function: {
      name: "createMaintenanceTask",
      description: "Create a maintenance task for a property. Use this after confirming address and contact details for ANY maintenance issue.",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "Detailed description of the maintenance issue including location, severity, when it started, and any troubleshooting already attempted"
          },
          property: {
            type: "string",
            description: "Complete address of the property with unit/apartment number if applicable"
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "emergency"],
            description: "Priority level of the task: emergency (life/safety issues, floods, fire); high (HVAC failure, major appliance issues); medium (minor repairs); low (cosmetic issues)"
          },
          contact: {
            type: "string",
            description: "Full contact information including name and phone number of the person reporting the issue"
          }
        },
        required: ["description", "property", "priority", "contact"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "createFollowUp",
      description: "Use this tool when you cannot answer the user's question with the available information. This will create a follow-up task to find the answer and get back to the user later.",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The original question the user asked that you cannot answer"
          },
          reason: {
            type: "string",
            description: "Brief explanation of why you cannot answer (missing information, outside scope, needs research, etc.)"
          },
          contactInfo: {
            type: "string",
            description: "Contact information for follow-up (if provided by user)"
          }
        },
        required: ["question", "reason"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "searchDocuments",
      description: "Search for relevant documents based on a query. Use this to find appropriate documents to answer the user's questions about property policies, maintenance, leases, etc.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query to find relevant documents"
          },
          limit: {
            type: "number",
            description: "Maximum number of documents to return"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getPropertyInfo",
      description: "Get information about a specific property",
      parameters: {
        type: "object",
        properties: {
          propertyId: {
            type: "string",
            description: "ID of the property"
          }
        },
        required: ["propertyId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getDocumentById",
      description: "Retrieve a specific document by its ID. Use this when the user asks about a specific document, refers to a document by name or ID, or wants to see details about a document. Returns comprehensive document information including content, metadata, and associations.",
      parameters: {
        type: "object",
        properties: {
          documentId: {
            type: "string",
            description: "ID of the document to retrieve (e.g., doc-123)"
          }
        },
        required: ["documentId"]
      }
    }
  }
];

/**
 * Process document content to make it more suitable for LLM context
 * by focusing on key information and reducing token usage
 */
const processDocumentContent = (doc: DocumentReference): string => {
  if (!doc.content) return 'No content available';
  
  // Extract the document content
  const content = doc.content;
  
  // If content is very long, get strategic parts: beginning, middle and end
  if (content.length > 1500) {
    const beginning = content.substring(0, 500);
    const middle = content.substring(Math.floor(content.length / 2) - 250, Math.floor(content.length / 2) + 250);
    const end = content.substring(content.length - 500);
    
    return `${beginning}\n\n[...]\n\n${middle}\n\n[...]\n\n${end}`;
  }
  
  // Otherwise return the full content
  return content;
};

/**
 * Generate chat completion using OpenRouter API or fallback to local simulation
 * @param messages Array of messages in the conversation
 * @param options Additional options for the chat completion
 */
export const generateChatCompletion = async (
  messages: Message[],
  options: ChatOptions = {}
): Promise<Message> => {
  // Ensure we have an API key
  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API key is required - please set OPEN_ROUTER_API_KEY environment variable");
  }
  
  try {
    // Always fetch all documents from the database
    console.log("Loading all documents for context");
    const allDocuments = await fetchRelevantDocuments("", undefined, true);
    console.log(`Loaded ${allDocuments.length} documents for context`);
    
    // Use the imported agent prompt
    let promptContent = agentPrompt;
    if (!promptContent) {
      // Fallback if import fails
      promptContent = `You are an AI assistant for Proptuna, a property management platform.

Your primary responsibilities include:
1. Answering questions about properties, maintenance, and tenant concerns
2. Helping users diagnose and troubleshoot maintenance issues
3. Creating maintenance tasks when necessary
4. Providing information from available documents when relevant`;
    }
    
    // If we found documents, add a system message with their content
    if (allDocuments.length > 0) {
      // Prepare document content for context, limiting per document to avoid token overflow
      const documentContext = allDocuments.map(doc => {
        // Process the content to optimize for context
        const processedContent = processDocumentContent(doc);
        
        // Ensure correct document URL format
        const documentUrl = `/documents-page?docId=${doc.id}`;
        
        return `--- DOCUMENT: ${doc.title} (ID: ${doc.id}) ---\n${processedContent}\n`;
      }).join('\n\n');
      
      // Add a system message with document context
      messages = [
        ...messages.filter(msg => msg.role !== 'system' || !msg.content?.includes('DOCUMENT:')),
        {
          role: 'system',
          content: `${promptContent}

## Available Documents
${documentContext}`,
          timestamp: new Date().toISOString()
        }
      ];
      
      console.log("Added document context to conversation");
    }
    
    // Prepare the messages for the API call
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Choose the model to use
    const model = options.modelId || DEFAULT_MODEL;
    
    // Create payload
    const payload = {
      model,
      messages: formattedMessages,
      tools: TOOLS,
      stream: false,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    };
    
    // Make API request to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }
    
    const data = await response.json() as ChatCompletionResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response choices returned from API");
    }
    
    const { message } = data.choices[0];
    
    // Parse tool calls if any
    let toolUse: ToolUse | null = null;
    let documentReference: DocumentReference | null = null;
    
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      try {
        const args = JSON.parse(toolCall.function.arguments);
        
        // If it's a document search tool, get document references
        if (toolCall.function.name === "searchDocuments") {
          const referencedDocs = await fetchRelevantDocuments(args.query);
          
          if (referencedDocs && referencedDocs.length > 0) {
            const mostRelevantDoc = referencedDocs[0];
            
            documentReference = {
              id: mostRelevantDoc.id,
              title: mostRelevantDoc.title,
              type: mostRelevantDoc.type,
              relevance: mostRelevantDoc.relevance,
              url: `/documents-page?docId=${mostRelevantDoc.id}`,
              visibility: mostRelevantDoc.visibility
            };
          }
        }
        
        // If it's a document lookup by ID
        if (toolCall.function.name === "getDocumentById") {
          const referencedDocs = await fetchRelevantDocuments("", args.documentId);
          
          if (referencedDocs && referencedDocs.length > 0) {
            const referencedDoc = referencedDocs[0];
            
            documentReference = {
              id: referencedDoc.id,
              title: referencedDoc.title,
              type: referencedDoc.type,
              relevance: referencedDoc.relevance,
              url: `/documents-page?docId=${referencedDoc.id}`,
              visibility: referencedDoc.visibility
            };
          }
        }
        
        toolUse = {
          name: toolCall.function.name,
          args: args,
          toolName: toolCall.function.name, // For backward compatibility
          toolInput: args, // For backward compatibility
          status: 'started' as const
        };
      } catch (error) {
        console.error("Error parsing tool call arguments:", error);
      }
    }
    
    // Check for document references in the content
    const docRefRegex = /<(doc-[^>]+)>/g;
    let docRefs = message.content ? message.content.match(docRefRegex) : null;
    
    // Process document references but keep them in the content for better display
    if (docRefs && docRefs.length > 0) {
      // Get the first document reference
      const docId = docRefs[0].replace(/[<>]/g, '');
      const cleanDocId = docId.replace(/^doc-/, ''); // Remove 'doc-' prefix for lookup
      
      try {
        // Fetch the document directly by ID
        const fetchedDocs = await fetchRelevantDocuments("", cleanDocId);
        
        if (fetchedDocs && fetchedDocs.length > 0) {
          const referencedDoc = fetchedDocs[0];
          
          // If document reference exists, set it as a separate entity
          documentReference = {
            id: referencedDoc.id,
            title: referencedDoc.title || 'Unknown Document',
            type: referencedDoc.type || 'document',
            relevance: 'high',      // Direct ID lookup is highly relevant
            url: `/documents-page?docId=${referencedDoc.id}` // Ensure correct URL format
          };
          
          // Don't remove document references from content
          // This ensures the LLM's formatting with document links is preserved
        }
      } catch (error) {
        console.error("Error fetching referenced document:", error);
      }
    } else {
      // If no explicit doc ref is found, check for markdown links to documents
      const linkRegex = /\[([^\]]+)\]\(\/documents-page\?docId=([^)]+)\)/g;
      const linkMatches = message.content ? Array.from(message.content.matchAll(linkRegex)) : [];
      
      if (linkMatches.length > 0) {
        const [_, title, docId] = linkMatches[0];
        const cleanDocId = docId.replace(/^doc-/, ''); // Remove 'doc-' prefix if present
        
        try {
          // Fetch the document directly by ID
          const fetchedDocs = await fetchRelevantDocuments("", cleanDocId);
          
          if (fetchedDocs && fetchedDocs.length > 0) {
            const referencedDoc = fetchedDocs[0];
            
            // If document reference exists, set it as a separate entity
            documentReference = {
              id: referencedDoc.id,
              title: referencedDoc.title || title,
              type: referencedDoc.type || 'document',
              relevance: 'high',
              url: `/documents-page?docId=${referencedDoc.id}`
            };
          }
        } catch (error) {
          console.error("Error fetching referenced document:", error);
        }
      }
    }
    
    // Check for maintenance task creation and request a follow-up response if needed
    const processMaintenanceTaskResponse = async (toolUse: ToolUse, response: ChatCompletionResponse) => {
      if (toolUse.name === "createMaintenanceTask" && response.choices[0].message.content === null) {
        // The AI didn't provide a follow-up response after creating the task
        // Let's generate one
        const followUpPrompt = {
          role: "system",
          content: `The user reported a maintenance issue and you created a task with the following details:
Priority: ${toolUse.args.priority || "not specified"}
Description: ${toolUse.args.description || "not specified"}
Property: ${toolUse.args.property || "not specified"}

Please generate a helpful response confirming the maintenance task was created. Include:
1. Confirmation that the issue has been reported
2. Next steps the user should take (if any)
3. Expected timeline for resolution based on priority
4. Any safety precautions if relevant (e.g., turn off water main for floods)
5. Ask if there's anything else they need help with

Be empathetic and reassuring, especially for emergency or high-priority issues.`
        };
        
        // Generate a follow-up response
        const followUpPayload = {
          model: response.model,
          messages: [
            followUpPrompt,
            { role: "user", content: "I need a response for the maintenance task I just created." }
          ],
          max_tokens: 1000,
          temperature: 0.7
        };
        
        try {
          const apiKey = process.env.OPEN_ROUTER_API_KEY;
          const followUpResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(followUpPayload)
          });
          
          if (followUpResponse.ok) {
            const followUpData = await followUpResponse.json() as ChatCompletionResponse;
            if (followUpData.choices && followUpData.choices.length > 0) {
              return followUpData.choices[0].message.content || "Your maintenance request has been submitted successfully.";
            }
          }
        } catch (error) {
          console.error("Error generating follow-up response:", error);
        }
        
        // Fallback response if API call fails
        return "Your maintenance request has been submitted successfully. Our team will address it based on the priority level. Is there anything else you need help with?";
      }
      
      return response.choices[0].message.content;
    };

    // Create the final response object
    const assistantMessage: Message = {
      role: "assistant",
      content: message.content || await processMaintenanceTaskResponse(toolUse as ToolUse, data) || "",
      timestamp: new Date().toISOString(),
      toolUse,
      documentReference
    };
    
    return assistantMessage;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw error;
  }
};

/**
 * Fetch all documents from the database or a specific document by ID
 * @param query Search query (ignored when fetchAll is true)
 * @param documentId Optional document ID to get a specific document
 * @param fetchAll Whether to fetch all documents (defaults to true)
 * @returns Array of document references
 */
export const fetchRelevantDocuments = async (
  query: string = "", 
  documentId?: string,
  fetchAll: boolean = true
): Promise<DocumentReference[]> => {
  try {
    // Import the actual document functions
    const { getDocumentById, getDocuments, searchDocuments } = await import('./documents');
    
    // If documentId is provided, prioritize fetching by ID
    if (documentId) {
      try {
        const document = await getDocumentById(documentId);
        
        // Convert document to DocumentReference format
        return [{
          id: document.id,
          title: document.title,
          type: document.type,
          content: document.data, // Use data field for content
          relevance: 'high',      // Direct ID lookup is highly relevant
          created_at: document.created_at,
          updated_at: document.updated_at,
          visibility: document.visibility,
          metadata: document.metadata,
          associations: document.associations,
          url: `/documents-page?docId=${document.id}` // Ensure correct URL format
        }];
      } catch (error) {
        console.error(`Error fetching document by ID ${documentId}:`, error);
        return [];
      }
    }
    
    // If fetchAll is true, get all documents regardless of query
    if (fetchAll) {
      try {
        console.log("Fetching ALL documents from the database");
        const docsResult = await getDocuments({});
        
        console.log(`Retrieved ${docsResult.data?.length || 0} documents from database`);
        
        // Convert to DocumentReference format
        return (docsResult.data || []).map(doc => ({
          id: doc.id,
          title: doc.title,
          type: doc.type,
          content: doc.data, // Use data field for content
          relevance: 'medium',  // All docs have medium relevance by default
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          visibility: doc.visibility,
          metadata: doc.metadata,
          associations: doc.associations,
          url: `/documents-page?docId=${doc.id}` // Ensure correct URL format
        }));
      } catch (error) {
        console.error('Error fetching all documents:', error);
      }
    }
    
    // Fall back to search if fetchAll is false and we have a query
    else if (query && query.trim()) {
      try {
        // Use searchDocuments with the query
        const searchResults = await searchDocuments({
          searchQuery: query,
          limit: 5, // Limit to 5 results
        });
        
        // Convert to DocumentReference format
        return (searchResults.data || []).map(doc => ({
          id: doc.id,
          title: doc.title,
          type: doc.type,
          content: doc.data, // Use data field for content
          relevance: 'medium', // Search results are medium relevance by default
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          visibility: doc.visibility,
          metadata: doc.metadata,
          associations: doc.associations,
          url: `/documents-page?docId=${doc.id}` // Ensure correct URL format
        }));
      } catch (error) {
        console.error(`Error searching documents with query "${query}":`, error);
      }
    }
    
    // Return empty array if all attempts fail
    return [];
  } catch (error) {
    console.error('Error in fetchRelevantDocuments:', error);
    return [];
  }
};

/**
 * Client-side function to send messages to the AI
 */
export const sendMessageToAI = async (
  messages: Message[],
  options: ChatOptions = {}
): Promise<Message> => {
  try {
    const response = await fetch("/api/v1/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, options })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message to AI:", error);
    throw error;
  }
};
