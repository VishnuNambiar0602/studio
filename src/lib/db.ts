
"use server";

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in the environment variables');
}

// A singleton instance of the database client
let dbInstance: NodePgDatabase<typeof schema> | null = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  await client.connect();
  dbInstance = drizzle(client, { schema, logger: true });
  return dbInstance;
}
