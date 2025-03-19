import { createClient } from '@supabase/supabase-js';
import { getLocalSupabaseUrl, getLocalSupabaseKey, getLocalServiceRoleKey } from '../db/supabaseConfig';

// Get Supabase URL and key from environment variables or default to local values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || getLocalSupabaseUrl();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || getLocalSupabaseKey();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || getLocalServiceRoleKey();

// Check if the required variables are set
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create a service role client for admin operations (migrations, etc.)
// This should only be used on the server side, never in the browser
export const getServiceSupabase = () => {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Re-export the supabase client as a default
export default supabase;
