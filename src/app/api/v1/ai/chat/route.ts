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
      console.error("Error in AI completion:", error);
      
      // Check if it's an API key issue
      if (error.message && error.message.includes('API key')) {
        return NextResponse.json(
          { 
            role: 'assistant',
            content: "I'm having trouble connecting to my AI services. Please check your API configuration and try again later.",
            timestamp: new Date().toISOString(),
            error: error.message
          },
          { status: 500 }
        );
      }
      
      // Return a more user-friendly error for other issues
      return NextResponse.json(
        { 
          role: 'assistant',
          content: "I'm sorry, I encountered an issue processing your request. Please try again later.",
          timestamp: new Date().toISOString(),
          error: error.message
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in AI chat API:", error);
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to simulate tool usage
async function processToolCall(name: string, args: any): Promise<any> {
  switch (name) {
    case 'searchDocuments':
      return await fetchRelevantDocuments(args.query);
    
    case 'createMaintenanceTask':
      // In a real implementation, this would create a task in your database
      return { 
        taskId: `task-${Date.now()}`,
        status: 'created',
        message: `Maintenance task created for ${args.property}`
      };
    
    case 'getPropertyInfo':
      // Simulate fetching property information
      return {
        id: args.propertyId,
        address: "123 Sample Street",
        owner: "John Doe",
        type: "Residential"
      };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
