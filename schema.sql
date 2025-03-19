-- Accounts to partition all data
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    name VARCHAR(255),
    overview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- People with improved contact structure
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts as a separate table with type encoding
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    person_id UUID NOT NULL REFERENCES people(id),
    contact_type VARCHAR(50) CHECK (contact_type IN ('email', 'phone', 'whatsapp', 'telegram', 'other')),
    contact_value TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties with expanded types
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    address TEXT,
    type VARCHAR(20) CHECK (type IN ('single', 'multi_family', 'condo', 'townhome', 'commercial')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents - includes escalation policies
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    title VARCHAR(255),
    data TEXT,
    is_private BOOLEAN DEFAULT false,
    type VARCHAR(50) CHECK (type IN ('markdown', 'escalation_policy', 'qa')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Conversations with separate message storage, modified job relation
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    status VARCHAR(20) CHECK (status IN ('live', 'completed', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_human_takeover BOOLEAN DEFAULT FALSE
    -- Removed job_id since jobs now reference conversations
);

-- Jobs as the central relational entity with conversation reference
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    overview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    state VARCHAR(50) CHECK (state IN ('conversation_ongoing', 'convo_ended', 'task_created', 'escalation_needed', 'escalation_resolved')),
    is_active BOOLEAN DEFAULT TRUE,
    history JSONB DEFAULT '[]',
    -- Explicit references to related entities
    person_id UUID REFERENCES people(id) NULL,
    property_id UUID REFERENCES properties(id) NULL,
    group_id UUID REFERENCES groups(id) NULL,
    -- Added reference to conversation
    conversation_id UUID REFERENCES conversations(id) NULL
);

-- Messages stored separately
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Tasks must always be related to a job
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    job_id UUID NOT NULL REFERENCES jobs(id), -- Required reference to a job
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    data JSONB DEFAULT '{}',
    task_type VARCHAR(50), -- More generic task type field
    status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    notified JSONB DEFAULT '[]' -- Track who has been notified about this task
);

-- Artifacts for file uploads
CREATE TABLE artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    metadata JSONB DEFAULT '{}',
    task_id UUID REFERENCES tasks(id) NULL,
    conversation_id UUID REFERENCES conversations(id) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EXPLICIT ASSOCIATION TABLES

-- Property-Group associations
CREATE TABLE property_group_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    relationship_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, group_id, relationship_type)
);

-- Person-Property associations
CREATE TABLE person_property_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    person_id UUID NOT NULL REFERENCES people(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    relationship_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(person_id, property_id, relationship_type)
);

-- Person-Group associations
CREATE TABLE person_group_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    person_id UUID NOT NULL REFERENCES people(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    relationship_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(person_id, group_id, relationship_type)
);

-- Document-Group associations
CREATE TABLE document_group_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    relationship_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, group_id, relationship_type)
);

-- Document-Property associations
CREATE TABLE document_property_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    relationship_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, property_id, relationship_type)
);

-- Document-Person associations
CREATE TABLE document_person_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    person_id UUID NOT NULL REFERENCES people(id),
    relationship_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, person_id, relationship_type)
);

-- Indexes for performance
CREATE INDEX idx_jobs_account_id ON jobs(account_id);
CREATE INDEX idx_jobs_state ON jobs(state);
CREATE INDEX idx_jobs_person_id ON jobs(person_id);
CREATE INDEX idx_jobs_property_id ON jobs(property_id);
CREATE INDEX idx_jobs_group_id ON jobs(group_id);
CREATE INDEX idx_jobs_conversation_id ON jobs(conversation_id);

-- Additional combined indexes for faster multi-column queries
CREATE INDEX idx_jobs_person_property ON jobs(person_id, property_id);
CREATE INDEX idx_jobs_person_group ON jobs(person_id, group_id);
CREATE INDEX idx_jobs_property_group ON jobs(property_id, group_id);

CREATE INDEX idx_conversations_account_id ON conversations(account_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_tasks_job_id ON tasks(job_id);
CREATE INDEX idx_tasks_account_id ON tasks(account_id);
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_people_account_id ON people(account_id);
CREATE INDEX idx_properties_account_id ON properties(account_id);
CREATE INDEX idx_documents_account_id ON documents(account_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_contacts_person_id ON contacts(person_id);
CREATE INDEX idx_contacts_type_value ON contacts(contact_type, contact_value);

-- Indexes for association tables
CREATE INDEX idx_property_group_property_id ON property_group_associations(property_id);
CREATE INDEX idx_property_group_group_id ON property_group_associations(group_id);
CREATE INDEX idx_person_property_person_id ON person_property_associations(person_id);
CREATE INDEX idx_person_property_property_id ON person_property_associations(property_id);
CREATE INDEX idx_person_group_person_id ON person_group_associations(person_id);
CREATE INDEX idx_person_group_group_id ON person_group_associations(group_id);
CREATE INDEX idx_document_group_document_id ON document_group_associations(document_id);
CREATE INDEX idx_document_group_group_id ON document_group_associations(group_id);
CREATE INDEX idx_document_property_document_id ON document_property_associations(document_id);
CREATE INDEX idx_document_property_property_id ON document_property_associations(property_id);
CREATE INDEX idx_document_person_document_id ON document_person_associations(document_id);
CREATE INDEX idx_document_person_person_id ON document_person_associations(person_id);