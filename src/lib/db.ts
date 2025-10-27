
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in the environment variables.');
}

const connectionString = process.env.POSTGRES_URL;

// The postgres client needs sslmode=require for Supabase.
// Appending it if it's not already there.
const connectionUrl = new URL(connectionString);
if (!connectionUrl.searchParams.has('sslmode')) {
  connectionUrl.searchParams.set('sslmode', 'require');
}

const client = postgres(connectionUrl.toString(), { prepare: false });
export const db = drizzle(client, { schema });
