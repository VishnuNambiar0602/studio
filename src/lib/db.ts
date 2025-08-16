
"use server";

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

// A singleton instance of the database client
let dbInstance: NodePgDatabase<typeof schema> | null = null;
let clientInstance: Client | null = null;

export async function getDb() {
  if (dbInstance && clientInstance && (clientInstance as any)._connected) {
    return dbInstance;
  }
  
  if (!process.env.POSTGRES_URL) {
      console.error('POSTGRES_URL is not set in the environment variables.');
      throw new Error("Database URL is not configured. Please set POSTGRES_URL.");
  }

  clientInstance = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await clientInstance.connect();
    dbInstance = drizzle(clientInstance, { schema, logger: false });
    return dbInstance;
  } catch (error) {
      // Enhanced logging to capture the specific connection error
      console.error("Failed to connect to the database. Details:", error);
      throw new Error("Could not connect to the database.");
  }
}
