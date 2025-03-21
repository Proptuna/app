import { 
  ChatOptions, 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  Message,
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
      description: "Create a maintenance task for a property",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "Description of the maintenance issue"
          },
          property: {
            type: "string",
            description: "ID or name of the property"
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "emergency"],
            description: "Priority level of the task"
          },
          contactInfo: {
            type: "string",
            description: "Contact information for follow-up"
          }
        },
        required: ["description", "property"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "searchDocuments",
      description: "Search for relevant documents based on a query",
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
  }
];

/**
 * Generate chat completion using OpenRouter API with Gemini 2.0 Flash
 */
export const generateChatCompletion = async (
  messages: Message[],
  options: ChatOptions = {}
): Promise<Message> => {
  // Get API key from environment variable
  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  
  // In development environment, if no API key is found, provide detailed guidance
  if (!apiKey) {
    console.error(`
    ===================================
    OpenRouter API Key Missing
    ===================================
    To use the AI chat feature, please:
    
    1. Create a .env.local file in the root of the project
    2. Add your OpenRouter API key: OPEN_ROUTER_API_KEY=your_api_key_here
    3. Restart the Next.js development server
    
    You can get an API key from https://openrouter.ai
    ===================================
    `);
    
    // For development, return a simulated response
    if (process.env.NODE_ENV === 'development') {
      return simulateAIResponse(messages);
    }
    
    throw new Error("OpenRouter API key not found. Please add it to your environment variables as OPEN_ROUTER_API_KEY.");
  }

  // Prepare request payload
  const payload: ChatCompletionRequest = {
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    model: options.modelId || DEFAULT_MODEL,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1000,
    top_p: options.topP || 0.95,
    tools: TOOLS,
    tool_choice: "auto"
  };

  try {
    // Make API request to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://proptuna.com",
        "X-Title": "Proptuna Property Management"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data: ChatCompletionResponse = await response.json();
    
    // Process the response
    const choice = data.choices[0];
    const content = choice.message.content || "";
    
    // For now, just simulate document references (random selection in real implementation)
    // In a real implementation, this would be based on tool calls and relevance
    let documentReference: DocumentReference | null = null;
    let toolUse = null;

    // Check if there are any tool calls in the response
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      
      // Process tool call - making sure status is one of the allowed enum values
      toolUse = {
        toolName: toolCall.function.name,
        toolInput: JSON.parse(toolCall.function.arguments),
        status: 'completed' as const // Explicitly set as 'completed', 'started', or 'failed'
      };
      
      // If the tool is searchDocuments, add a document reference
      if (toolCall.function.name === 'searchDocuments') {
        documentReference = {
          id: "doc-123",
          title: "Maintenance Guidelines",
          type: "markdown",
          relevance: 'high'
        };
      }
    }

    // Return the formatted message
    return {
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      toolUse,
      documentReference
    };
  } catch (error) {
    console.error("Error generating chat completion:", error);
    
    // For development, return a simulated response if the real API call fails
    if (process.env.NODE_ENV === 'development') {
      console.log("Falling back to simulated response in development environment");
      return simulateAIResponse(messages);
    }
    
    throw error;
  }
};

/**
 * Generate a simulated AI response for development when no API key is available
 */
const simulateAIResponse = (messages: Message[]): Message => {
  // Get the last user message
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
  
  let content = "I'm sorry, but I can't process your request right now because the OpenRouter API key is missing.";
  let toolUse = null;
  let documentReference: DocumentReference | null = null;
  
  if (lastUserMessage) {
    const userInput = lastUserMessage.content.toLowerCase();
    
    if (userInput.includes('maintenance') || userInput.includes('repair') || userInput.includes('broken')) {
      content = "I understand you're having a maintenance issue. In a real environment, I would create a maintenance task for this. Since this is a simulated response, please add your OpenRouter API key to use the full functionality.";
      
      toolUse = {
        toolName: "createMaintenanceTask",
        toolInput: {
          description: "Simulated maintenance task",
          property: "Sample Property",
          priority: "medium"
        },
        status: 'completed' as const
      };
    } else if (userInput.includes('document') || userInput.includes('policy') || userInput.includes('guide')) {
      content = "I found some documents that might help you with your question. In a real environment, I would provide specific document references. Since this is a simulated response, please add your OpenRouter API key to use the full functionality.";
      
      documentReference = {
        id: "doc-123",
        title: "Maintenance Guidelines",
        type: "markdown",
        relevance: 'high'
      };
    } else {
      content = "I'm here to help with property management questions. This is a simulated response since the OpenRouter API key is missing. Please add your API key to the environment variables to use the full AI assistant functionality.";
    }
  }
  
  return {
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    toolUse,
    documentReference
  };
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

/**
 * Simulated function to retrieve documents (for demonstration purposes)
 * In a real implementation, this would query your actual document database
 */
export const fetchRelevantDocuments = async (query: string): Promise<DocumentReference[]> => {
  // Simulate an API call to get relevant documents
  return [
    {
      id: "doc-123",
      title: "Maintenance Guidelines",
      type: "markdown",
      relevance: 'high'
    },
    {
      id: "doc-456",
      title: "Tenant Handbook",
      type: "pdf",
      relevance: 'medium'
    }
  ];
};
