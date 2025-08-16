
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// This ensures that when you run drizzle-kit, it finds the .env file.
dotenv.config({ path: ".env" });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in the environment variables.');
}

export default defineConfig({
  schema: "./src/lib/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
});
