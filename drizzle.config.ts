
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

// The DATABASE_URL is required only for drizzle-kit commands,
// not for the Next.js build process. We check for its existence
// only when the script is one of the drizzle-kit commands.
const isDrizzleKitCommand = ['db:push', 'db:studio'].some(cmd => process.env.npm_lifecycle_event?.includes(cmd));

if (isDrizzleKitCommand && !process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in the environment variables');
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Provide a dummy value for builds, and the real one for drizzle-kit
    url: process.env.POSTGRES_URL || 'postgres://dummy:dummy@dummy/dummy',
  },
});
