# Database Management with Supabase

This project uses Supabase for database management in both local development and production. The database setup, migrations, and seeding are all handled through the Supabase CLI.

## Setup Overview

The database setup consists of:

1. Running a local Supabase instance via Docker
2. Migrations defined in SQL files located in `/supabase/migrations/`
3. Seed data defined in SQL located in `/supabase/seed.sql`
4. Helper scripts to ensure the Supabase instance is running before starting the app

## Directory Structure

- `/src/db/`: Contains TypeScript utilities for database management
  - `ensureSupabase.ts`: Checks if Supabase is running and starts it if not
  - `initialize.ts`: Script to initialize the database (runs migrations and seeds)
  - `supabaseConfig.ts`: Configuration for Supabase connections
- `/supabase/`: Contains Supabase configuration and SQL scripts
  - `/migrations/`: SQL migration files
  - `seed.sql`: SQL seed file for populating the database with initial data
  - `config.toml`: Supabase configuration

## Available Scripts

All database-related scripts are defined in `package.json`:

- `yarn supabase:start`: Start the local Supabase instance
- `yarn supabase:stop`: Stop the local Supabase instance
- `yarn supabase:status`: Check the status of the local Supabase instance
- `yarn db:migrate`: Apply database migrations
- `yarn db:seed`: Seed the database with initial data
- `yarn db:init`: Run migrations and seed the database
- `yarn db:setup`: Start Supabase and initialize the database
- `yarn db:reset`: Reset the database (wipe all data and restart)
- `yarn dev`: Setup the database and start the Next.js development server

## Development Workflow

1. Start the development environment with `yarn dev`, which automatically:
   - Starts the local Supabase instance if not already running
   - Applies any pending migrations 
   - Seeds the database if it's empty
   - Starts the Next.js development server

2. When changes are made to the database schema:
   - Create a new migration file in `/supabase/migrations/` with proper versioning
   - Run `yarn db:migrate` to apply the migration
   - Update the seed data in `/supabase/seed.sql` if necessary

3. To reset the database completely:
   - Run `yarn db:reset` to wipe all data and reapply migrations and seed

## Prerequisites

- Docker must be installed and running on your machine
- Supabase CLI must be installed (installed as a dev dependency)

## Environment Variables

The Supabase connection details are configured in the following files:

- `.env.local` for local development
- `.env.production` for production deployment

The required environment variables are:

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

See `.env.example` for more details.

## Troubleshooting

If you encounter any issues with the database setup:

1. Check that Docker is running
2. Check the status of Supabase with `yarn supabase:status`
3. Try restarting Supabase with `yarn supabase:stop` followed by `yarn supabase:start`
4. Reset the database with `yarn db:reset` if needed
