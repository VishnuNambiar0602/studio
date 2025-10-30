
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// The POSTGRES_URL is now hardcoded to ensure the correct connection.
const connectionString = "postgresql://postgres:[&WiM6L&ut6NHMKe]@db.jiipseivhisqnknlvqrk.supabase.co:5432/postgres?sslmode=require";

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
