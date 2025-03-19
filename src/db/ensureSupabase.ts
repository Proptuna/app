import { spawn } from 'child_process';
import { getServiceSupabase } from '../lib/supabase';

/**
 * Retries an async function with an exponential backoff
 */
async function retry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 2000,
  factor = 1.5
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    console.log(`Retrying... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * factor, factor);
  }
}

/**
 * Checks if Supabase is responding to queries
 */
async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();
    
    // Try to run a simple query
    await supabase.rpc('execute_sql', {
      sql_query: 'SELECT 1;'
    }).throwOnError();
    
    return true;
  } catch (error) {
    console.log('Connection check failed:', error);
    return false;
  }
}

/**
 * Ensures that Supabase is running before attempting to run migrations
 */
export async function ensureSupabaseRunning(): Promise<boolean> {
  try {
    // First try to connect to Supabase
    const connected = await checkSupabaseConnection();
    
    if (connected) {
      console.log('Supabase is already running');
      return true;
    }
    
    // If not connected, start Supabase
    console.log('Supabase is not running. Starting Supabase...');
    const startResult = await startSupabase();
    
    if (!startResult) {
      console.error('Failed to start Supabase');
      return false;
    }
    
    // Wait for Supabase to fully start up
    console.log('Waiting for Supabase to be ready...');
    try {
      await retry(async () => {
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          throw new Error('Supabase not ready yet');
        }
        return true;
      }, 10, 3000);
      
      console.log('Supabase is ready');
      return true;
    } catch (error) {
      console.error('Timed out waiting for Supabase to be ready');
      return false;
    }
  } catch (error) {
    console.error('Error ensuring Supabase is running:', error);
    return false;
  }
}

/**
 * Start the local Supabase instance
 */
async function startSupabase(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const supabaseProcess = spawn('yarn', ['supabase:start'], {
      stdio: 'inherit',
      shell: true,
    });

    supabaseProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Supabase start command completed');
        resolve(true);
      } else {
        console.error(`Supabase start failed with code ${code}`);
        resolve(false);
      }
    });
  });
}

// Allow running this directly from CLI
if (require.main === module) {
  ensureSupabaseRunning()
    .then((success) => {
      if (success) {
        console.log('Supabase is running and ready');
        process.exit(0);
      } else {
        console.error('Failed to ensure Supabase is running');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Error ensuring Supabase:', error);
      process.exit(1);
    });
}
