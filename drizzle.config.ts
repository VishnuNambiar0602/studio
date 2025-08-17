
import { defineConfig } from "drizzle-kit";

// Note: In the mock database setup, this file is not actively used for database
// connections but is kept for Drizzle Studio compatibility and future-proofing.
// The POSTGRES_URL is not required for the app to run in its current state.

export default defineConfig({
  schema: "./src/lib/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    // This URL is a placeholder and not used by the running application.
    url: process.env.POSTGRES_URL || "postgres://user:password@host:port/db",
  },
});
