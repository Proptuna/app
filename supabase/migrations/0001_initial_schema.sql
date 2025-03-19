-- Migration: 0001_initial_schema.sql
-- Created at: 2025-03-17
-- Description: Initial database schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (combines previous accounts and organizations concepts)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR(255) UNIQUE, -- Clerk's organization ID
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    primary_domain VARCHAR(255) NULL,
    status VARCHAR(50) CHECK (status IN ('active', 'suspended', 'trial', 'canceled')) DEFAULT 'active',
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE NULL,
    image_url TEXT,
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255),
    overview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- People with improved contact structure
CREATE TABLE IF NOT EXISTS people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name VARCHAR(255),
    type VARCHAR(20) CHECK (type IN ('tenant', 'owner')), -- Type to enforce people are only tenants or owners
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table for company staff/employees (compatible with Clerk)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    clerk_id VARCHAR(255) NOT NULL UNIQUE, -- Clerk's user ID
    name VARCHAR(255) NOT NULL,
    primary_email VARCHAR(255), -- Optional, just for reference
    primary_phone VARCHAR(50), -- Optional, just for reference
    metadata JSONB DEFAULT '{}', -- Store additional user metadata
    image_url TEXT, -- Profile picture URL
    role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'maintenance', 'leasing_agent', 'support')),
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Organization memberships
CREATE TABLE IF NOT EXISTS organization_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Contacts as a separate table with type encoding
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    person_id UUID NOT NULL REFERENCES people(id),
    contact_type VARCHAR(50) CHECK (contact_type IN ('email', 'phone', 'whatsapp', 'telegram', 'other')),
    contact_value TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties with expanded types
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    address TEXT,
    type VARCHAR(20) CHECK (type IN ('single', 'multi_family', 'condo/townhome', 'commercial')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents - includes escalation policies
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(255),
    data TEXT,
    visibility VARCHAR(20) CHECK (visibility IN ('internal', 'external', 'confidential')) DEFAULT 'internal',
    type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Jobs as the central relational entity
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
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
    assigned_user_id UUID REFERENCES users(id) NULL -- Reference to the assigned user
);

-- Conversations with separate message storage, referencing jobs
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    status VARCHAR(20) CHECK (status IN ('live', 'completed', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_human_takeover BOOLEAN DEFAULT FALSE,
    job_id UUID REFERENCES jobs(id) NULL,
    medium_type VARCHAR(50) CHECK (medium_type IN ('phone_call', 'email', 'whatsapp', 'sms')),
    medium_id TEXT
);

-- Messages stored separately
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Tasks must always be related to a job
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    job_id UUID NOT NULL REFERENCES jobs(id), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    data JSONB DEFAULT '{}',
    task_type VARCHAR(50), 
    status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    notified JSONB DEFAULT '[]' 
);

-- Artifacts for file uploads
CREATE TABLE IF NOT EXISTS artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
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
CREATE TABLE IF NOT EXISTS property_group_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, group_id)
);

-- Person-Property associations
CREATE TABLE IF NOT EXISTS person_property_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    person_id UUID NOT NULL REFERENCES people(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(person_id, property_id)
);

-- Document-Group associations
CREATE TABLE IF NOT EXISTS document_group_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, group_id)
);

-- Document-Property associations
CREATE TABLE IF NOT EXISTS document_property_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, property_id)
);

-- Document-Person associations
CREATE TABLE IF NOT EXISTS document_person_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    person_id UUID NOT NULL REFERENCES people(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, person_id)
);

-- Document-Organization associations for organization-wide policies
CREATE TABLE IF NOT EXISTS document_organization_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    document_id UUID NOT NULL REFERENCES documents(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, organization_id)
);

-- Create indexes for all tables to improve query performance

-- Organization indexes
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_clerk_id ON organizations(clerk_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_tier ON organizations(subscription_tier);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);

-- Organization membership indexes
CREATE INDEX IF NOT EXISTS idx_org_membership_org_id ON organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_membership_user_id ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_membership_role ON organization_memberships(role);

-- Person indexes
CREATE INDEX IF NOT EXISTS idx_people_organization_id ON people(organization_id);
CREATE INDEX IF NOT EXISTS idx_people_name ON people(name);

-- Contact indexes
CREATE INDEX IF NOT EXISTS idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_person_id ON contacts(person_id);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_value ON contacts(contact_value);

-- Property indexes
CREATE INDEX IF NOT EXISTS idx_properties_organization_id ON properties(organization_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_organization_id ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_title ON documents(title);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);

-- Job indexes
CREATE INDEX IF NOT EXISTS idx_jobs_organization_id ON jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_person_id ON jobs(person_id);
CREATE INDEX IF NOT EXISTS idx_jobs_property_id ON jobs(property_id);
CREATE INDEX IF NOT EXISTS idx_jobs_group_id ON jobs(group_id);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_user_id ON jobs(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(state);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);

-- Conversation indexes
CREATE INDEX IF NOT EXISTS idx_conversations_organization_id ON conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversations_job_id ON conversations(job_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_medium_type ON conversations(medium_type);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_organization_id ON messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_organization_id ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_job_id ON tasks(job_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Artifact indexes
CREATE INDEX IF NOT EXISTS idx_artifacts_organization_id ON artifacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_task_id ON artifacts(task_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_conversation_id ON artifacts(conversation_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_file_type ON artifacts(file_type);

-- Association table indexes
CREATE INDEX IF NOT EXISTS idx_property_group_property_id ON property_group_associations(property_id);
CREATE INDEX IF NOT EXISTS idx_property_group_group_id ON property_group_associations(group_id);
CREATE INDEX IF NOT EXISTS idx_person_property_person_id ON person_property_associations(person_id);
CREATE INDEX IF NOT EXISTS idx_person_property_property_id ON person_property_associations(property_id);
CREATE INDEX IF NOT EXISTS idx_document_group_document_id ON document_group_associations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_group_group_id ON document_group_associations(group_id);
CREATE INDEX IF NOT EXISTS idx_document_property_document_id ON document_property_associations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_property_property_id ON document_property_associations(property_id);
CREATE INDEX IF NOT EXISTS idx_document_person_document_id ON document_person_associations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_person_person_id ON document_person_associations(person_id);
CREATE INDEX IF NOT EXISTS idx_document_organization_document_id ON document_organization_associations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_organization_organization_id ON document_organization_associations(organization_id);
