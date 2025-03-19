# Local Development Setup

This document explains how to set up local development with Supabase for this project.

## Prerequisites

- Node.js and Yarn
- Docker (required for Supabase local development)
- Supabase CLI (installed as a project dependency)

## Setup Steps

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server with database initialization:
   ```bash
   yarn dev
   ```

   This will:
   - Start Supabase local development server
   - Run all database migrations
   - Seed the database with initial data
   - Start the Next.js development server

## Useful Commands

- **Start Supabase only**:
  ```bash
  yarn supabase:start
  ```

- **Stop Supabase**:
  ```bash
  yarn supabase:stop
  ```

- **Check Supabase status**:
  ```bash
  yarn supabase:status
  ```

- **Run migrations only**:
  ```bash
  yarn db:migrate
  ```

- **Seed database only**:
  ```bash
  yarn db:seed
  ```

- **Initialize database (migrations + seed)**:
  ```bash
  yarn db:init
  ```

- **Setup database (start Supabase + initialize)**:
  ```bash
  yarn db:setup
  ```

- **Reset database (wipe data and restart)**:
  ```bash
  yarn db:reset
  ```

## Database Structure

The database structure is defined in SQL migration files located in the `/supabase/migrations` directory. The seed data is defined in `/supabase/seed.sql`.

When you run `yarn dev`, the system will:

1. Check if Supabase is running and start it if needed
2. Apply any pending migrations 
3. Seed the database if it's empty

## Making Database Changes

1. **Schema Changes**:
   - Create a new migration file in `/supabase/migrations/` with the next version number
   - Apply the migration with `yarn db:migrate`

2. **Seed Data Changes**:
   - Update the `/supabase/seed.sql` file
   - Apply the changes with `yarn db:seed` or `yarn db:reset` to start fresh

## Environment Variables

For local development, the system automatically uses the Supabase local development URLs and keys. In production, you'll need to set the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

See the `.env.example` file for more details.

## Troubleshooting

- **Supabase fails to start**: Ensure Docker is running
- **Migrations fail**: Check the migration SQL syntax and ensure there are no conflicts
- **Seed fails**: Reset the database with `yarn db:reset` to start fresh
