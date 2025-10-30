
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env' });

const connectionString = "postgresql://postgres:[&WiM6L&ut6NHMKe]@db.jiipseivhisqnknlvqrk.supabase.co:5432/postgres?sslmode=require";

if (!connectionString) {
  throw new Error('Database connection string is not available.');
}

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
});
