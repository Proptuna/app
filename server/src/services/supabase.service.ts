import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

/**
 * Interface for database models
 */
export interface Property {
  id: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  tag: string;
  created_at?: string;
  updated_at?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  property_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
  properties?: Property[];
}

export interface Conversation {
  id: string;
  title: string;
  userId?: string;
  created_at?: string;
  updated_at?: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  toolCalls?: Record<string, unknown>;
}

/**
 * Interface for Supabase service
 */
export interface ISupabaseService {
  getProperties(): Promise<Property[]>;
  getPropertyById(propertyId: string): Promise<Property | null>;
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: string): Promise<Document | null>;
  getPeople(): Promise<Person[]>;
  getPersonById(id: string): Promise<Person | null>;
  getConversations(): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | null>;
  getConversationMessages(conversationId: string): Promise<Message[]>;
  createConversation(title: string, userId: string): Promise<Conversation | null>;
  saveMessage(conversationId: string, content: string, role: 'user' | 'assistant', toolCalls?: Record<string, unknown>): Promise<Message | null>;
}

/**
 * Supabase service implementation
 */
class SupabaseService implements ISupabaseService {
  private supabase: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor() {
    const { supabaseUrl, supabaseKey, supabaseServiceRoleKey } = config.database;
    
    if (!supabaseUrl || !supabaseKey || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase credentials. Please check your .env file.');
    }

    // Regular client with anonymous key
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    // Admin client with service role key for privileged operations
    this.adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    console.log('Supabase clients initialized');
  }

  /**
   * Get all properties
   */
  async getProperties(): Promise<Property[]> {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*');
    
    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Get a property by ID
   * @param propertyId - The ID of the property to retrieve
   * @returns The property data or null if not found
   */
  async getPropertyById(propertyId: string): Promise<Property | null> {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting property by ID:', error);
      return null;
    }
  }

  /**
   * Get all documents
   */
  async getDocuments(): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*');
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<Document | null> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  }

  /**
   * Get all people
   */
  async getPeople(): Promise<Person[]> {
    const { data, error } = await this.supabase
      .from('people')
      .select('*');
    
    if (error) {
      console.error('Error fetching people:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Get person by ID
   */
  async getPersonById(id: string): Promise<Person | null> {
    const { data, error } = await this.supabase
      .from('people')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching person with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  }

  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('ai_conversations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Get conversation by ID
   */
  async getConversationById(id: string): Promise<Conversation | null> {
    try {
      // Get the conversation
      const { data: conversation, error: conversationError } = await this.supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (conversationError) throw conversationError;
      if (!conversation) return null;
      
      // Get the messages for this conversation
      const messages = await this.getConversationMessages(id);
      
      // Return the conversation with messages
      return {
        ...conversation,
        messages
      };
    } catch (error) {
      console.error(`Error fetching conversation with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Create a new conversation
   * @param title - The title of the conversation
   * @param userId - The user ID associated with the conversation
   * @returns The created conversation or null if there was an error
   */
  async createConversation(title: string, userId: string): Promise<Conversation | null> {
    try {
      const { data, error } = await this.supabase
        .from('ai_conversations')
        .insert([
          { title, user_id: userId }
        ])
        .select('*')
        .single();

      if (error) throw error;
      return data as Conversation;
    } catch (error: unknown) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  /**
   * Save a message to a conversation
   * @param conversationId - The ID of the conversation
   * @param content - The message content
   * @param role - The role of the message sender (user or assistant)
   * @returns The saved message or null if there was an error
   */
  async saveMessage(
    conversationId: string, 
    content: string, 
    role: 'user' | 'assistant',
    toolCalls?: Record<string, unknown>
  ): Promise<Message | null> {
    try {
      const { data, error } = await this.supabase
        .from('ai_messages')
        .insert([
          { 
            conversation_id: conversationId,
            content,
            role,
            tool_calls: toolCalls
          }
        ])
        .select('*')
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error: unknown) {
      console.error('Error saving message:', error);
      return null;
    }
  }
}

// Create service instance
const supabaseService = new SupabaseService();

// Export service
export default supabaseService;
