-- Create AI conversations table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    user_id TEXT DEFAULT 'anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI messages table
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    tool_calls JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add index for faster queries
    CONSTRAINT fk_conversation FOREIGN KEY (conversation_id) REFERENCES public.ai_conversations(id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_timestamp ON public.ai_messages(timestamp);
