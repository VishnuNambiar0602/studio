import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client;
try {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('POSTGRES_URL is not set in the environment variables.');
  }
  // Validate the URL format before creating a client
  new URL(connectionString);
  client = postgres(connectionString, { prepare: false });
} catch (error) {
  console.warn('Could not connect to the database. Using a mock client.');
  console.warn('Error:', (error as Error).message);
  // Create a mock client that will throw an error when a query is made
  client = postgres('', {
    onnotice: () => {},
    onparameter: () => {},
    // @ts-ignore
    transform: {
      undefined: null,
    },
    // Mock the query function to throw a more helpful error
    query: () => {
       throw new Error('Database not configured. Please set a valid POSTGRES_URL in your .env file.');
    },
  });
}

export const db = drizzle(client, { schema });
