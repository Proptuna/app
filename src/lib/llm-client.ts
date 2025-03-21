import { 
  ChatOptions, 
  ChatCompletionRequest, 
  ChatCompletionResponse,
  Message,
  ToolUse,
  DocumentReference
} from "@/types/llm";

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
    
    // Prepare the document context
    let documentContextMessage = null;
    let documentContext = "";
    
    if (allDocuments.length > 0) {
      // Prepare document content for context, limiting per document to avoid token overflow
      documentContext = allDocuments.map(doc => {
        // Process the content to optimize for context
        const processedContent = processDocumentContent(doc);
        
        // Ensure correct document URL format
        const documentUrl = `/documents-page?docId=${doc.id}`;
        
        return `DOCUMENT: ${doc.id}
TITLE: ${doc.title || 'Untitled Document'}
TYPE: ${doc.type || 'document'}
URL: ${documentUrl}
CONTENT: ${processedContent}
---`;
      }).join('\n\n');
      
      // Create a system message with document context
      documentContextMessage = {
        role: 'system' as const,
        content: `You are an AI assistant for Proptuna, a property management platform.

Your primary responsibilities include:
1. Answering questions about properties, maintenance, and tenant concerns
2. Helping users diagnose and troubleshoot maintenance issues
3. Creating maintenance tasks when necessary
4. Providing information from available documents when relevant

## Available Documents
${documentContext}`,
      };
    }
    
    // Prepare the messages for the API call
    const apiMessages = messages.filter(msg => msg.role !== 'system' || !msg.content?.includes('DOCUMENT:'));
    
    // Generate a response using OpenRouter
    const payload: ChatCompletionRequest = {
      model: options.modelId || DEFAULT_MODEL,
      messages: [
        // System prompt
        {
          role: "system" as const,
          content: `You are an AI assistant for Proptuna, a property management platform.

Your primary responsibilities include:
1. Answering questions about properties, maintenance, and tenant concerns
2. Helping users diagnose and troubleshoot maintenance issues
3. Creating maintenance tasks when necessary
4. Providing information from available documents when relevant`
        },
        // Tool usage instruction
        {
          role: "system" as const,
          content: `CRITICAL TOOL USAGE INSTRUCTIONS:
- NEVER output raw function call code like print(default_api.createMaintenanceTask()) or similar
- Do not output Python, JavaScript, or any other programming language syntax
- Use the provided createMaintenanceTask tool directly
- For ANY maintenance issues, IMMEDIATELY use the createMaintenanceTask tool
- If you see indications of floods, leaks, or emergencies along with an address and contact, use the tool immediately
- In emergency situations, DO NOT respond conversationally without using the tool first
- When creating a maintenance task, provide these parameters:
  * property: The full property address
  * contact: The name and phone number of the contact person
  * description: Description of the maintenance issue
  * priority: One of "emergency", "high", "medium", or "low"
- The system will automatically process your tool call and generate a response
- After using a tool, provide a helpful human-readable response to the user`
        },
        // Document context if available
        ...(documentContextMessage ? [documentContextMessage] : []),
        // Previous conversation messages
        ...apiMessages
      ],
      tools: TOOLS,
      tool_choice: detectMaintenanceEmergency(apiMessages) ? {
        type: "function",
        function: { name: "createMaintenanceTask" }
      } : "auto",
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1500
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
        
        // Set tool use info regardless of the specific tool
        toolUse = {
          name: toolCall.function.name,
          args: args,
          toolName: toolCall.function.name, // For backward compatibility
          toolInput: args, // For backward compatibility
          status: 'started' as const
        };
        
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
        
        // Process follow-up tool call (no additional action needed beyond logging it)
        if (toolCall.function.name === "createFollowUp") {
          console.log("Follow-up request created:", args);
        }
        
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
      if (toolUse && toolUse.name === "createMaintenanceTask") {
        // Always generate a follow-up response for maintenance tasks
        // This ensures users get guidance even if the LLM doesn't provide follow-up content
        const priority = toolUse.args.priority || "medium";
        const isEmergency = priority === "emergency" || priority === "high";
        
        const followUpPrompt = {
          role: "system" as const,
          content: `The user reported a maintenance issue and you created a task with the following details:
Priority: ${priority}
Description: ${toolUse.args.description || "not specified"}
Property: ${toolUse.args.property || "not specified"}
Contact: ${toolUse.args.contact || "not specified"}

${isEmergency ? `This is an EMERGENCY situation that requires immediate attention and safety guidance.` : `This is a ${priority} priority issue.`}

Please generate a detailed and helpful response that includes:
1. Confirmation that the issue has been reported and a maintenance task created
2. Specific safety steps the user should take immediately (e.g., turn off water main for floods, electrical breaker for electrical issues)
3. Troubleshooting guidance they can try while waiting for maintenance 
4. Timeline for when they can expect assistance based on the priority
5. Ask if there are other details they need help with

Be empathetic, thorough, and focus on safety first. Provide step-by-step instructions for any emergency procedures.`
        };
        
        // Generate a follow-up response
        const followUpPayload = {
          model: response.model,
          messages: [
            followUpPrompt,
            { role: "user" as const, content: "I need detailed guidance for the maintenance task I just created." }
          ],
          max_tokens: 1500,
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
              return followUpData.choices[0].message.content || generateFallbackResponse(toolUse);
            }
          }
        } catch (error) {
          console.error("Error generating follow-up response:", error);
        }
        
        // Fallback response if API call fails
        return generateFallbackResponse(toolUse);
      }
      
      // Return original message content if not a maintenance task or if above logic didn't return
      return response.choices[0].message.content;
    };

    // Generate a fallback response based on task details
    const generateFallbackResponse = (toolUse: ToolUse): string => {
      const priority = toolUse.args.priority || "medium";
      const isEmergency = priority === "emergency" || priority === "high";
      
      if (isEmergency) {
        return `I've created an emergency maintenance task for this issue. Our team has been notified and will respond as quickly as possible.

In the meantime, here are some important safety steps:
- If this is a water leak: Turn off the water main if you can locate it safely
- For electrical issues: Do not touch wet electrical appliances or wiring
- If there's flooding: Move valuable items to higher ground and avoid walking in standing water
- For gas smell: Leave the area immediately and call emergency services (911)

The property manager will be contacting you soon at the number you provided. Is there anything else you need help with or any other details I should add to the maintenance report?`;
      } else {
        return `Your maintenance request has been submitted successfully. Our team will address it based on the ${priority} priority level, typically within ${priority === "medium" ? "1-2 business days" : "3-5 business days"}.

In the meantime, is there anything specific you'd like to know about the issue or any additional details you'd like to add to the maintenance report?`;
      }
    };
    
    // Create the final response object
    const assistantMessage: Message = {
      role: "assistant" as const,
      content: processResponseContent(message.content || await processMaintenanceTaskResponse(toolUse as ToolUse, data) || ""),
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
 * Detect if the conversation appears to be about a maintenance emergency that requires immediate attention
 * @param messages Recent conversation messages
 * @returns True if this appears to be a maintenance emergency
 */
const detectMaintenanceEmergency = (messages: Message[]): boolean => {
  if (messages.length === 0) return false;
  
  // Get the most recent user message
  const lastUserMessageIndex = messages.findIndex(m => m.role === 'user');
  if (lastUserMessageIndex === -1) return false;
  
  const lastUserMessage = messages[lastUserMessageIndex].content;
  if (!lastUserMessage) return false;
  
  // Emergency keywords
  const emergencyKeywords = [
    'flood', 'flooding', 'water', 'leak', 'leaking', 'burst', 'pipe', 'fire', 
    'smoke', 'gas', 'smell', 'no power', 'power outage', 'electric', 
    'emergency', 'urgent', 'immediately', 'broken', 'damage'
  ];
  
  // Check for address-like patterns (simple check for street names)
  const hasAddressPattern = /\d+\s+[\w\s]+\b(street|st|avenue|ave|road|rd|blvd|boulevard|apt|apartment|unit|#)\b/i.test(lastUserMessage);
  
  // Check for phone number-like patterns
  const hasPhonePattern = /\d{3}[-.)]\d{3}[-.)]\d{4}|\d{10}|\(\d{3}\)\s*\d{3}[-\s]\d{4}/.test(lastUserMessage);
  
  // Check for emergency keywords
  const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
    lastUserMessage.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Return true if we have an emergency keyword, and either an address or phone number
  return hasEmergencyKeyword && (hasAddressPattern || hasPhonePattern);
};

/**
 * Process response content to detect and fix improperly formatted tool calls
 * @param content The response content from the LLM
 * @returns Cleaned content without any raw function call syntax
 */
const processResponseContent = (content: string): string => {
  if (!content) return "";
  
  // Detect Python-style function calls for maintenance task creation
  const pythonStyleRegex = /print\s*\(\s*default_api\.createMaintenanceTask\s*\([^)]*\)\s*\)/g;
  if (pythonStyleRegex.test(content)) {
    console.warn("Detected improper Python-style maintenance task function call in response");
    
    // Extract the maintenance task details from the response - use multiple regexes instead of /s flag
    const propertyMatch = content.match(/property\s*=\s*"([^"]+)"/);
    const contactMatch = content.match(/contact\s*=\s*"([^"]+)"/);
    const descriptionMatch = content.match(/description\s*=\s*"([^"]+)"/);
    const priorityMatch = content.match(/priority\s*=\s*"([^"]+)"/);
    
    if (propertyMatch && contactMatch && descriptionMatch && priorityMatch) {
      const property = propertyMatch[1];
      const contact = contactMatch[1];
      const description = descriptionMatch[1];
      const priority = priorityMatch[1];
      
      // Replace the Python syntax with a proper message
      return content.replace(pythonStyleRegex, 
        `I've created an emergency maintenance task for ${property} with the following details:
        
- **Property**: ${property}
- **Contact**: ${contact}
- **Issue**: ${description}
- **Priority**: ${priority}

Our maintenance team has been notified and will respond as quickly as possible.`);
    }
  }
  
  // Detect other potential code-like syntax
  const genericCodeRegex = /((\w+\.\w+\()|(\w+\().*(\)))/g;
  if (genericCodeRegex.test(content)) {
    console.warn("Detected potential code-like syntax in response");
    // Just log for now, we'll handle specific cases as they arise
  }
  
  return content;
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
