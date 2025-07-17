
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();
export const db: NodePgDatabase<typeof schema> = drizzle(client, { schema, logger: true });
