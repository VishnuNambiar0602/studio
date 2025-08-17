
// This script is not intended to be run directly when using the mock database,
// as the mock data is sourced directly from `src/lib/mock-data.ts`.

// The purpose of this file in a mock setup is to provide a reference for what
// the seeding process would look like with a real database.

async function seed() {
  console.log("Database seeding is disabled in mock mode.");
  console.log("Data is loaded directly from src/lib/mock-data.ts.");
  // In a real database scenario, you would connect to the database
  // and use Drizzle ORM to insert your seed data here.
}

seed();
