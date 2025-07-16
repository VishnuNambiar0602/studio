
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString || connectionString === "YOUR_SUPABASE_CONNECTION_STRING_HERE") {
  console.warn("⚠️ POSTGRES_URL is not set or is a placeholder. Database features will be disabled.");
  // Create a mock db object that will throw an error when a query is attempted
  const errorDb = new Proxy({}, {
    get(target, prop) {
      throw new Error(`Database is not configured. Please set POSTGRES_URL in your .env file. Tried to access property: ${String(prop)}`);
    }
  });
  // Type assertion to satisfy the export type
  module.exports.db = errorDb as ReturnType<typeof drizzle>;
} else {
  // Disable pre-fetching data in production
  const client = postgres(connectionString, { prepare: false });
  module.exports.db = drizzle(client, { schema });
}
