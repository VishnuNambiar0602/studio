
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
let clientInstance: Client | null = null;

export async function getDb() {
  if (dbInstance) {
    // Basic check to see if client is still connected.
    // This is not foolproof but helps in some serverless environments.
    if (clientInstance && !(clientInstance as any)._connected) {
        await clientInstance.connect();
    }
    return dbInstance;
  }
  
  clientInstance = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  await clientInstance.connect();
  dbInstance = drizzle(clientInstance, { schema, logger: true });
  return dbInstance;
}
