import { ensureSupabaseRunning } from './ensureSupabase';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Initialize the database
 * This runs migrations and seeds the database if needed using Supabase's native mechanisms
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Ensure Supabase is running first
    const isSupabaseRunning = await ensureSupabaseRunning();
    if (!isSupabaseRunning) {
      throw new Error('Failed to start Supabase. Please ensure Docker is running and try again.');
    }
    
    console.log('Supabase is running. Proceeding with database initialization...');
    
    // Run migrations and seeding using Supabase CLI
    console.log('Running migrations with Supabase CLI...');
    try {
      // Get the project root directory
      const projectRoot = path.resolve(__dirname, '../..');
      
      // Run database migrations
      execSync('supabase db reset -t migrate', { 
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      console.log('Migrations completed successfully');
      
      // Run database seeding
      console.log('Seeding database with Supabase CLI...');
      execSync('supabase db seed', { 
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Error running Supabase migrations/seeding:', error);
      throw error;
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Allow running this directly from CLI
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}
