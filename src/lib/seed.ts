
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import type { User } from './types';

// Seeding now relies on the environment being correctly set up, e.g., using `dotenv` with the script command
// Example: `npm run db:seed` with `tsx` might need `dotenv-cli` -> `dotenv -e .env -- tsx src/lib/seed.ts`
// Or ensure your execution environment loads .env automatically.

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const MOCK_USERS: Omit<User, 'id' | 'createdAt' | 'isBlocked'>[] = [
  { name: 'John Doe', email: 'john@example.com', username: 'johndoe', role: 'customer', password: 'password123', phone: '1112223333', accountType: 'individual' },
  { name: 'Muscat Modern Auto', email: 'mma@example.com', username: 'muscatmodern', role: 'vendor', password: 'password123', shopAddress: 'Muscat Modern Auto', zipCode: '112', phone: '2223334444', accountType: 'business' },
  { name: 'Salalah Auto Spares', email: 'sas@example.com', username: 'salalahspares', role: 'vendor', password: 'password123', shopAddress: 'Salalah Auto Spares', zipCode: '211', phone: '3334445555', accountType: 'business' },
  { name: 'Nizwa Car Parts', email: 'nizwa@example.com', username: 'nizwaparts', role: 'vendor', password: 'password123', shopAddress: 'Nizwa Car Parts', zipCode: '611', phone: '4445556666', accountType: 'business' },
];

async function seed() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  
  try {
    await client.connect();
    const db = drizzle(client, { schema });

    console.log("Seeding database...");

    // Clear existing data in the correct order to avoid foreign key constraints
    console.log("Clearing existing data...");
    await db.delete(schema.bookings).execute();
    await db.delete(schema.orders).execute();
    await db.delete(schema.parts).execute();
    await db.delete(schema.users).execute();
    console.log("Cleared existing data.");

    // Seed Users
    console.log("Seeding users...");
    for (const user of MOCK_USERS) {
      await db.insert(schema.users).values({
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date(),
        isBlocked: false,
        ...user,
      });
    }
    console.log("Seeded users.");

    console.log("Database seeding complete!");

  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
