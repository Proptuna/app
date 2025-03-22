import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Configuration object
export interface AppConfig {
  server: {
    port: number;
    env: string;
  };
  database: {
    supabaseUrl: string;
    supabaseKey: string;
    supabaseServiceRoleKey: string;
  };
  ai: {
    openRouterApiKey?: string;
    openRouterUrl?: string;
  };
}

export const config: AppConfig = {
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    env: process.env.NODE_ENV || 'development'
  },
  database: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
  },
  ai: {
    openRouterApiKey: process.env.OPEN_ROUTER_API_KEY,
    openRouterUrl: process.env.OPEN_ROUTER_URL || 'https://openrouter.ai/api/v1'
  }
};
