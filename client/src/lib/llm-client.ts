import { 
  ChatOptions, 
  Message,
  ToolUse,
  DocumentReference
} from "@/types/llm";

/**
 * Client-side function to send messages to the AI
 * This is a mock implementation for the React app
 */
export const sendMessageToAI = async (
  messages: Message[],
  options: ChatOptions = {}
): Promise<Message> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!lastUserMessage) {
    throw new Error('No user message found');
  }
  
  const userMessageLower = lastUserMessage.content.toLowerCase();
  
  // Check for maintenance-related keywords
  const isMaintenanceRelated = 
    userMessageLower.includes('broken') || 
    userMessageLower.includes('fix') || 
    userMessageLower.includes('repair') || 
    userMessageLower.includes('leaking') || 
    userMessageLower.includes('maintenance');
  
  // Check for document-related keywords
  const isDocumentRelated = 
    userMessageLower.includes('document') || 
    userMessageLower.includes('policy') || 
    userMessageLower.includes('agreement') || 
    userMessageLower.includes('lease');
  
  // Mock different response types based on message content
  let responseMessage: Message = {
    role: 'assistant',
    content: 'I understand your question. How can I assist you further?',
    timestamp: new Date().toISOString()
  };
  
  if (isMaintenanceRelated && options.createTask) {
    // Generate a maintenance task response
    const toolUse: ToolUse = {
      name: 'createMaintenanceTask',
      args: {
        property: options.property || '123 Main St, Apt 4B',
        contact: 'John Doe (555-123-4567)',
        description: `Issue reported: ${lastUserMessage.content}`,
        priority: userMessageLower.includes('emergency') ? 'emergency' : 
                 userMessageLower.includes('urgent') ? 'high' : 'medium'
      },
      status: 'completed'
    };
    
    responseMessage = {
      role: 'assistant',
      content: 'I\'ve created a maintenance task for you. A property manager will review this and get back to you soon. In the meantime, here are some things you can do:',
      timestamp: new Date().toISOString(),
      toolUse
    };
  } else if (isDocumentRelated) {
    // Generate a document reference response
    const documentReference: DocumentReference = {
      id: 'doc-123',
      title: 'Property Management Policy',
      type: 'pdf',
      relevance: 'high',
      url: '/documents-page?docId=doc-123'
    };
    
    responseMessage = {
      role: 'assistant',
      content: 'I found a document that might help answer your question. You can view it by clicking the link below.',
      timestamp: new Date().toISOString(),
      documentReference
    };
  }
  
  return responseMessage;
}
