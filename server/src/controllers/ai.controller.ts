import { Request, Response, NextFunction } from 'express';
import supabaseService from '../services/supabase.service';
import { ApiError } from '../middleware/error';
import httpStatus from 'http-status';
import { config } from '../config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Load the agent prompt
const AGENT_PROMPT_PATH = path.join(process.cwd(), 'prompts', 'agent.prompt.txt');
const AGENT_PROMPT = fs.existsSync(AGENT_PROMPT_PATH) 
  ? fs.readFileSync(AGENT_PROMPT_PATH, 'utf-8')
  : 'You are a helpful AI assistant for a property management company.';

// Define interfaces
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LLMRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * AI controller for handling AI-related requests
 */
class AIController {
  /**
   * Get all conversations
   */
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await supabaseService.getConversations();
      res.json(conversations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const conversation = await supabaseService.getConversationById(id);
      
      if (!conversation) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
      }
      
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, userId } = req.body;
      
      if (!title) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Title is required');
      }
      
      const conversation = await supabaseService.createConversation(
        title,
        userId || 'anonymous'
      );
      
      if (!conversation) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create conversation');
      }
      
      res.status(httpStatus.CREATED).json(conversation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a conversation
   */
  async updateConversation(req: Request, res: Response, next: NextFunction) {
    try {
      // Placeholder for future implementation
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      // Placeholder for future implementation
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send a message to the AI and get a response
   */
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId, message } = req.body;
      
      if (!conversationId || !message) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation ID and message are required');
      }
      
      // Get the conversation
      const conversation = await supabaseService.getConversationById(conversationId);
      
      if (!conversation) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
      }
      
      // Save the user message
      await supabaseService.saveMessage(
        conversationId,
        message,
        'user'
      );
      
      // Get all messages for context
      const messages = await supabaseService.getConversationMessages(conversationId);
      
      // Prepare the messages for the LLM
      const llmMessages: Message[] = [
        { role: 'user', content: AGENT_PROMPT }, // System prompt as first user message
        ...messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      ];
      
      // Call the LLM API
      const openRouterApiKey = config.ai.openRouterApiKey;
      
      if (!openRouterApiKey) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'OpenRouter API key not configured');
      }
      
      const llmRequest: LLMRequest = {
        model: 'openai/gpt-3.5-turbo',
        messages: llmMessages,
        temperature: 0.7,
        max_tokens: 1000
      };
      
      const response = await axios.post(
        `${config.ai.openRouterUrl}/chat/completions`,
        llmRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterApiKey}`
          }
        }
      );
      
      // Extract the AI response
      const aiResponse = response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      // Save the AI response
      const savedMessage = await supabaseService.saveMessage(
        conversationId,
        aiResponse,
        'assistant'
      );
      
      // Return the AI response
      res.json({
        message: savedMessage,
        conversation
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      next(error);
    }
  }
}

// Create controller instance
const aiController = new AIController();

// Export controller
export default aiController;
