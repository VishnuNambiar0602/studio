// Edited

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const isDrizzleKitCommand = ['push:pg', 'studio'].some(cmd => process.env.npm_lifecycle_event?.includes(cmd));

const dbCredentials = {
  url: process.env.POSTGRES_URL || 'postgres://dummy:dummy@dummy/dummy',
};

if (isDrizzleKitCommand && !process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in the environment variables for Drizzle Kit commands.');
}

export default defineConfig({
  schema: "./src/lib/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials,
});
