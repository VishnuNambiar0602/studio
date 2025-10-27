
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config } from 'dotenv';

// Load environment variables from .env files
config({ path: '.env' });
config({ path: 'src/.env' });


const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not set in the environment variables. Please ensure it is defined in your .env file.');
}

// Supabase requires SSL. Using a config object is more robust for special characters.
const client = postgres(connectionString, {
    ssl: 'require'
});

export const db = drizzle(client, { schema });
