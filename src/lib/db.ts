
import { drizzle, type NodePgDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: NodePgDatabase<typeof schema>;

const connectionString = process.env.POSTGRES_URL;

if (!connectionString || connectionString.includes("YOUR-PASSWORD") || connectionString.includes("your_postgres_url_here")) {
  console.warn("⚠️ POSTGRES_URL is not set or is a placeholder. Database features will be disabled.");

  // Create a mock db object that will throw an error only when a query is attempted.
  // This allows the application to start and run without a valid database connection.
  const errorDb = new Proxy({}, {
    get(target, prop) {
      throw new Error(`Database is not configured. Please set a valid POSTGRES_URL in your .env file. Tried to access property: ${String(prop)}`);
    }
  });

  // Assign the mock object, cast to the correct type to satisfy TypeScript.
  db = errorDb as NodePgDatabase<typeof schema>;

} else {
  // If a connection string is present, attempt to connect.
  // Disable pre-fetching data in production for serverless environments.
  const client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
}

export { db };
