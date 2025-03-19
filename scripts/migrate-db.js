#!/usr/bin/env node

/**
 * This script runs Supabase migrations during Vercel deployment
 * It uses the Supabase CLI commands but with production database credentials
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if we should run migrations
if (process.env.MIGRATE_ON_BUILD !== 'true') {
  console.log('Skipping database migration (MIGRATE_ON_BUILD is not set to "true")');
  process.exit(0);
}

// Ensure required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_DB_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set these environment variables in your Vercel project settings.');
  process.exit(1);
}

try {
  console.log('Starting database migration process...');
  
  // Get the project root directory
  const projectRoot = path.resolve(__dirname, '..');
  
  // Path to migrations directory
  const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');
  
  // Verify migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found at: ${migrationsDir}`);
    process.exit(1);
  }
  
  console.log(`Found migrations directory at: ${migrationsDir}`);
  const migrationFiles = fs.readdirSync(migrationsDir);
  console.log(`Found ${migrationFiles.length} migration files.`);
  
  // Run migrations using Supabase CLI
  console.log('Running migrations...');
  
  // Use DATABASE_URL environment variable to connect to the production database
  execSync(`supabase db push --db-url "${process.env.SUPABASE_DB_URL}"`, {
    stdio: 'inherit',
    cwd: projectRoot
  });
  
  console.log('Database migration completed successfully.');
  process.exit(0);
} catch (error) {
  console.error('Migration error:', error.message);
  process.exit(1);
}
