
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import type { User } from './types';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const MOCK_USERS: Omit<User, 'id'>[] = [
  { name: 'John Doe', email: 'john@example.com', username: 'johndoe', role: 'customer', password: 'password123', createdAt: new Date() },
  { name: 'Admin User', email: 'admin@gulfcarx.com', username: 'admin', role: 'admin', password: 'admin', createdAt: new Date() },
  { name: 'Muscat Modern Auto', email: 'mma@example.com', username: 'muscatmodern', role: 'vendor', password: 'password123', shopAddress: 'Muscat Modern Auto', zipCode: '112', createdAt: new Date() },
  { name: 'Salalah Auto Spares', email: 'sas@example.com', username: 'salalahspares', role: 'vendor', password: 'password123', shopAddress: 'Salalah Auto Spares', zipCode: '211', createdAt: new Date() },
  { name: 'Nizwa Car Parts', email: 'nizwa@example.com', username: 'nizwaparts', role: 'vendor', password: 'password123', shopAddress: 'Nizwa Car Parts', zipCode: '611', createdAt: new Date() },
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
