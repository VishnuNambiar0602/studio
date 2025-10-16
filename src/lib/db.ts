
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config } from 'dotenv';

// Load environment variables right at the start
config({ path: '.env' });
config({ path: 'src/.env' });


if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in the environment variables.');
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client, { schema });
