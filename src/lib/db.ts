
"use server";

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

if (!process.env.POSTGRES_URL) {
  // This check is primarily for runtime environments.
  // The build process is handled differently in drizzle.config.ts.
  if (process.env.NODE_ENV === 'production') {
      console.error('POSTGRES_URL is not set in the production environment.');
  }
}

// A singleton instance of the database client
let dbInstance: NodePgDatabase<typeof schema> | null = null;
let clientInstance: Client | null = null;

export async function getDb() {
  if (dbInstance && clientInstance && (clientInstance as any)._connected) {
    return dbInstance;
  }
  
  if (!process.env.POSTGRES_URL) {
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
