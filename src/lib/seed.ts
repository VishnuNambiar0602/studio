
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
    {
        name: 'OEM Brake Pads',
        description: 'High-quality original equipment manufacturer brake pads for superior stopping power and longevity. Fits various models.',
        price: 85.50,
        imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        quantity: 25,
        vendorAddress: 'Muscat Modern Auto',
        isVisibleForSale: true,
        category: ['oem', 'new'],
        manufacturer: 'OEM Supplier',
    },
    {
        name: 'Used Alternator - Toyota Camry',
        description: 'A tested and fully functional used alternator pulled from a 2018 Toyota Camry. 90-day warranty included.',
        price: 120.00,
        imageUrls: ['https://placehold.co/600x400.png'],
        quantity: 8,
        vendorAddress: 'Salalah Auto Spares',
        isVisibleForSale: true,
        category: ['used'],
        manufacturer: 'Toyota',
    },
    {
        name: 'Performance Air Filter',
        description: 'Washable and reusable high-flow air filter. Increases horsepower and acceleration. A simple upgrade for any car enthusiast.',
        price: 45.00,
        imageUrls: ['https://placehold.co/600x400.png'],
        quantity: 50,
        vendorAddress: 'Muscat Modern Auto',
        isVisibleForSale: true,
        category: ['new'],
        manufacturer: 'Performance Inc',
    },
    {
        name: 'Used Radiator - Nissan Patrol',
        description: 'Used OEM radiator for Nissan Patrol (Y61). Pressure tested and confirmed to be leak-free. Good condition.',
        price: 150.75,
        imageUrls: ['https://placehold.co/600x400.png'],
        quantity: 5,
        vendorAddress: 'Nizwa Car Parts',
        isVisibleForSale: true,
        category: ['used', 'oem'],
        manufacturer: 'Nissan',
    },
    {
        name: 'New Spark Plugs (4-pack)',
        description: 'Set of four iridium spark plugs for improved fuel efficiency and performance. Fits most 4-cylinder engines.',
        price: 30.00,
        imageUrls: ['https://placehold.co/600x400.png'],
        quantity: 100,
        vendorAddress: 'Muscat Modern Auto',
        isVisibleForSale: true,
        category: ['new'],
        manufacturer: 'NGK',
    },
    {
        name: 'Used Headlight Assembly - Lexus IS',
        description: 'Right-side (passenger) headlight assembly for a 2016-2019 Lexus IS. Minor cosmetic wear but fully functional.',
        price: 250.00,
        imageUrls: ['https://placehold.co/600x400.png'],
        quantity: 3,
        vendorAddress: 'Salalah Auto Spares',
        isVisibleForSale: false,
        category: ['used', 'oem'],
        manufacturer: 'Lexus',
    },
    {
        name: 'OEM Oil Filter',
        description: 'Genuine OEM oil filter. Designed for optimal flow and filtration to protect your engine.',
        price: 15.00,
        imageUrls: ['https://placehold.co/600x400.png'],
        quantity: 200,
        vendorAddress: 'Muscat Modern Auto',
        isVisibleForSale: true,
        category: ['oem', 'new'],
        manufacturer: 'OEM Supplier',
    },
    {
        name: 'Used Transmission - Honda Accord',
        description: 'Complete automatic transmission from a 2017 Honda Accord with 80,000 km. Shifted smoothly before removal.',
        price: 800.00,
        imageUrls: ['https://placehold.co/600x400.png'],
        quantity: 1,
        vendorAddress: 'Nizwa Car Parts',
        isVisibleForSale: true,
        category: ['used'],
        manufacturer: 'Honda',
    },
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
  for (const part of MOCK_PARTS) {
     await db.insert(schema.parts).values({
        id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        ...part,
     });
  }
  console.log("Seeded parts.");


  console.log("Database seeding complete!");
  await client.end();
}

seed().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
