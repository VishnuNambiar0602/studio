
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import type { Part, User } from './types';

dotenv.config({ path: './.env' });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

const db = drizzle(client, { schema });

const MOCK_PARTS: Omit<Part, 'id'>[] = [
    // All mock product data has been removed.
    // You can add your own sample products here if needed for testing.
];

const MOCK_USERS: Omit<User, 'id'>[] = [
  { name: 'John Doe', email: 'john@example.com', username: 'johndoe', role: 'customer', password: 'password123', createdAt: new Date() },
  { name: 'Muscat Modern Auto', email: 'mma@example.com', username: 'muscatmodern', role: 'vendor', password: 'password123', shopAddress: 'Muscat Modern Auto', zipCode: '112', createdAt: new Date() },
  { name: 'Admin User', email: 'admin@gulfcarx.com', username: 'admin', role: 'admin', password: 'admin', createdAt: new Date() },
  { name: 'Salalah Auto Spares', email: 'sas@example.com', username: 'salalahspares', role: 'vendor', password: 'password123', shopAddress: 'Salalah Auto Spares', zipCode: '211', createdAt: new Date() },
  { name: 'Nizwa Car Parts', email: 'nizwa@example.com', username: 'nizwaparts', role: 'vendor', password: 'password123', shopAddress: 'Nizwa Car Parts', zipCode: '611', createdAt: new Date() },
];


async function seed() {
  await client.connect();
  console.log("Seeding database...");

  // Clear existing data in the correct order
  await db.delete(schema.bookings);
  await db.delete(schema.orders);
  await db.delete(schema.parts);
  await db.delete(schema.users);
  console.log("Cleared existing data.");

  // Seed Users
  for (const user of MOCK_USERS) {
    await db.insert(schema.users).values({
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...user,
    });
  }
  console.log("Seeded users.");

  // Seed Parts
  if (MOCK_PARTS.length > 0) {
    for (const part of MOCK_PARTS) {
        await db.insert(schema.parts).values({
          id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          ...part,
        });
    }
    console.log("Seeded parts.");
  } else {
    console.log("No mock parts to seed.");
  }


  console.log("Database seeding complete!");
  await client.end();
}

seed().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
