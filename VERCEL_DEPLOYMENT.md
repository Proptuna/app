# Vercel Deployment with Supabase Migrations

This document explains how to set up Vercel deployment with automatic Supabase migrations.

## Overview

When deploying to Vercel, your Supabase migrations located in the `supabase/migrations` directory will be automatically applied to your production database during the build process. This ensures that your database schema stays in sync with your application code.

## Required Environment Variables

Set the following environment variables in your Vercel project settings:

1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (e.g., `https://yourproject.supabase.co`)
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
3. `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (used for administrative tasks)
4. `SUPABASE_DB_URL` - The connection string to your Supabase PostgreSQL database
   
   Format: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres`

5. `MIGRATE_ON_BUILD` - Set to `true` to run migrations during the build process

## How to Get Supabase Connection Details

1. Log in to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to Project Settings > API
4. Copy the URL, anon key, and service role key
5. For the database connection string, go to Project Settings > Database > Connection String > With Password

## Manually Triggering Migrations

If you need to run migrations manually without redeploying, you can use the Vercel CLI:

```bash
vercel env pull .env.local  # Pull environment variables
source .env.local           # Load environment variables
yarn migrate:prod           # Run migrations
```

## Migration Process

During deployment, Vercel will:

1. Install dependencies (`yarn install`)
2. Run the migration script (`node scripts/migrate-db.js`)
3. Build the Next.js application (`next build`)
4. Deploy the application

The migration script will:
1. Check if migrations should run (`MIGRATE_ON_BUILD=true`)
2. Connect to your production Supabase database
3. Apply any new migrations from the `supabase/migrations` directory

## Troubleshooting

If migrations fail during deployment:

1. Check the build logs in Vercel
2. Verify that all environment variables are set correctly
3. Make sure your migrations are valid SQL files
4. Test migrations locally against a copy of your production database first

## Security Considerations

The `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_DB_URL` provide full access to your database. Ensure they are kept secure and only exposed as encrypted environment variables in Vercel.
