-- Migration: 0000_migrations_table.sql
-- Created at: 2025-03-17
-- Description: Create migrations table to track applied migrations

-- This table stores information about which migrations have been applied
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
