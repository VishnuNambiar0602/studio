
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

// Append sslmode=require for Supabase connection.
const connectionUrl = `${connectionString}?sslmode=require`;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionUrl, { prepare: false });
export const db = drizzle(client, { schema });
