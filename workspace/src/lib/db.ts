
import { drizzle, type NodePgDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL!;

// Disable pre-fetching data in production for serverless environments.
const client = postgres(connectionString, { prepare: false });
export const db: NodePgDatabase<typeof schema> = drizzle(client, { schema });
