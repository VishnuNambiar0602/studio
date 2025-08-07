
"use server";

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// A singleton instance of the database client
let dbInstance: NodePgDatabase<typeof schema> | null = null;
let clientInstance: Client | null = null;

export async function getDb() {
  if (dbInstance && clientInstance && (clientInstance as any)._connected) {
    return dbInstance;
  }
  
  if (!process.env.POSTGRES_URL) {
      // Check for the environment variable right before connecting.
      // This is more robust than checking at the top level of the file.
      console.error('POSTGRES_URL is not set in the environment variables.');
      throw new Error("Database URL is not configured. Please set POSTGRES_URL.");
  }

  clientInstance = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await clientInstance.connect();
    dbInstance = drizzle(clientInstance, { schema, logger: false }); // Disable logger for cleaner output
    return dbInstance;
  } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw new Error("Could not connect to the database.");
  }
}
