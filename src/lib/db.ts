
"use server";

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

// This function now creates a new client for each call, which is more robust for serverless environments.
export async function getDb(): Promise<NodePgDatabase<typeof schema>> {
  if (!process.env.POSTGRES_URL) {
      throw new Error("Database URL is not configured. Please set POSTGRES_URL in your environment variables.");
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    // The drizzle instance is created on each request, ensuring a fresh connection.
    const db = drizzle(client, { schema, logger: false });
    return db;
  } catch (error) {
      console.error("Failed to connect to the database. Details:", error);
      // This will help diagnose the specific issue if it persists.
      throw new Error("Could not connect to the database.");
  }
}
