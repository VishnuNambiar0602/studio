
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { users, parts, orders, bookings } from './schema';
import type { User, Part, Order, Booking } from './types';
import { config } from 'dotenv';

config({ path: '.env' });

const MOCK_PARTS_DATA: Omit<Part, 'id'>[] = [
  {
    name: 'OEM Brake Pads - Toyota Camry',
    description: 'High-quality original equipment manufacturer brake pads for superior stopping power and longevity. Fits Toyota Camry 2018-2023 models.',
    price: 85.50,
    imageUrls: ['https://images.unsplash.com/photo-1599408423233-5a245649a56c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMHBhZHN8ZW58MHx8fHwxNzE2NDEyNjAyfDA&ixlib=rb-4.0.3&q=80&w=1080'],
    quantity: 25,
    vendorAddress: 'Muscat Modern Auto',
    isVisibleForSale: true,
    manufacturer: 'Toyota Genuine Parts',
    category: ['oem', 'new'],
  },
  {
    name: 'Used Alternator - Honda Accord',
    description: 'A tested and fully functional used alternator pulled from a 2019 Honda Accord. 90-day warranty included.',
    price: 120.00,
    imageUrls: ['https://images.unsplash.com/photo-1620864399739-03a855b3f7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBhbHRlcm5hdG9yfGVufDB8fHx8MTcxNjQxMjY4OHww&ixlib=rb-4.0.3&q=80&w=1080'],
    quantity: 8,
    vendorAddress: 'Salalah Auto Spares',
    isVisibleForSale: true,
    manufacturer: 'Honda',
    category: ['used'],
  },
  {
    name: 'K&N Performance Air Filter',
    description: 'Washable and reusable high-flow air filter. Increases horsepower and acceleration. A simple upgrade for any car enthusiast.',
    price: 45.00,
    imageUrls: ['https://images.unsplash.com/photo-1550102142-8a6e7c6b4539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBhaXIlMjBmaWx0ZXJ8ZW58MHx8fHwxNzE2NDEyNzU4fDA&ixlib=rb-4.0.3&q=80&w=1080'],
    quantity: 50,
    vendorAddress: 'Muscat Modern Auto',
    isVisibleForSale: true,
    manufacturer: 'K&N Engineering',
    category: ['new'],
  },
  {
    name: 'Used Radiator - Nissan Patrol Y61',
    description: 'Used OEM radiator for Nissan Patrol (Y61). Pressure tested and confirmed to be leak-free. Good condition.',
    price: 150.75,
    imageUrls: ['https://images.unsplash.com/photo-1615923974447-f554854515a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjByYWRpYXRvcnxlbnwwfHx8fDE3MTY0MTI4MjV8MA&ixlib=rb-4.0.3&q=80&w=1080'],
    quantity: 5,
    vendorAddress: 'Nizwa Car Parts',
    isVisibleForSale: true,
    manufacturer: 'Nissan',
    category: ['used', 'oem'],
  },
  {
    name: 'Denso Iridium Spark Plugs (4-pack)',
    description: 'Set of four iridium spark plugs for improved fuel efficiency and performance. Fits most 4-cylinder engines.',
    price: 30.00,
    imageUrls: ['https://images.unsplash.com/photo-1600172454238-66299d255a29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcGFyayUyMHBsdWdzfGVufDB8fHx8MTcxNjQxMjg4OXww&ixlib=rb-4.0.3&q=80&w=1080'],
    quantity: 100,
    vendorAddress: 'Muscat Modern Auto',
    isVisibleForSale: true,
    manufacturer: 'Denso',
    category: ['new'],
  },
  {
    name: 'Used Headlight Assembly - Lexus IS',
    description: 'Right-side (passenger) headlight assembly for a 2016-2019 Lexus IS. Minor cosmetic wear but fully functional.',
    price: 250.00,
    imageUrls: ['https://images.unsplash.com/photo-1543166597-5a1b37346757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBoZWFkbGlnaHR8ZW58MHx8fHwxNzE2NDEyOTg1fDA&ixlib=rb-4.0.3&q=80&w=1080'],
    quantity: 3,
    vendorAddress: 'Salalah Auto Spares',
    isVisibleForSale: false,
    manufacturer: 'Lexus',
    category: ['used', 'oem'],
  },
];


const MOCK_USERS_DATA: Omit<User, 'id'>[] = [
    { name: 'Ahmed Al Farsi', email: 'ahmed@example.com', username: 'ahmed_alfarsi', role: 'customer', password: 'password123', phone: '+96898765432', createdAt: new Date('2024-05-10'), isBlocked: false, accountType: 'individual' },
    { name: 'Muscat Modern Auto', email: 'mma@example.com', username: 'muscatmodern', role: 'vendor', password: 'password123', shopAddress: 'Muscat Modern Auto', zipCode: '112', phone: '+96891111111', createdAt: new Date('2024-01-15'), isBlocked: false, accountType: 'business' },
    { name: 'Admin', email: 'admin@gulfcarx.com', username: 'admin', role: 'admin', password: 'admin', phone: '+96899999999', createdAt: new Date('2024-01-01'), isBlocked: false, accountType: 'business' },
    { name: 'Salalah Auto Spares', email: 'sas@example.com', username: 'salalahspares', role: 'vendor', password: 'password123', shopAddress: 'Salalah Auto Spares', zipCode: '211', phone: '+96892222222', createdAt: new Date('2024-03-20'), isBlocked: false, accountType: 'business' },
    { name: 'Nizwa Car Parts', email: 'nizwa@example.com', username: 'nizwaparts', role: 'vendor', password: 'password123', shopAddress: 'Nizwa Car Parts', zipCode: '611', phone: '+96893333333', createdAt: new Date('2024-04-05'), isBlocked: true, accountType: 'business' },
];


export async function seed() {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL is not set in the environment variables.');
    }
    const db = drizzle(postgres(process.env.POSTGRES_URL, { max: 1 }));
    console.log("Seeding database...");

    try {
        // Clean up existing data
        console.log("Clearing existing data...");
        await db.delete(bookings);
        await db.delete(orders);
        await db.delete(parts);
        await db.delete(users);

        // Insert Users
        console.log("Inserting users...");
        await db.insert(users).values(MOCK_USERS_DATA);
        console.log(`${MOCK_USERS_DATA.length} users inserted.`);

        // Insert Parts
        console.log("Inserting parts...");
        await db.insert(parts).values(MOCK_PARTS_DATA);
        console.log(`${MOCK_PARTS_DATA.length} parts inserted.`);

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

// Allow running this file directly
if (require.main === module) {
  seed().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
}
