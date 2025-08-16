
"use server";

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

let dbInstance: NodePgDatabase<typeof schema> | null = null;

export async function getDb(): Promise<NodePgDatabase<typeof schema>> {
  if (dbInstance) {
    return dbInstance;
  }
  
  if (!process.env.POSTGRES_URL) {
      throw new Error("Database URL is not configured. Please set POSTGRES_URL.");
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    dbInstance = drizzle(client, { schema, logger: false });
    return dbInstance;
  } catch (error) {
      console.error("Failed to connect to the database. Details:", error);
      throw new Error("Could not connect to the database.");
  }
}
