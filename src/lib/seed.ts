
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { User, Part, Order, Booking } from './types';
import { config } from 'dotenv';

// Load environment variables from both possible locations
config({ path: '.env' });
config({ path: 'src/.env' });


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


const MOCK_USERS_DATA: Omit<User, 'id' | 'createdAt'>[] = [
    { name: 'Ahmed Al Farsi', email: 'ahmed@example.com', username: 'ahmed_alfarsi', role: 'customer', password: 'password123', phone: '+96898765432' },
    { name: 'Muscat Modern Auto', email: 'mma@example.com', username: 'muscatmodern', role: 'vendor', password: 'password123', shopAddress: 'Muscat Modern Auto', zipCode: '112', phone: '+96891111111' },
    { name: 'Admin', email: 'admin@gulfcarx.com', username: 'admin', role: 'admin', password: 'admin', phone: '+96899999999' },
    { name: 'Salalah Auto Spares', email: 'sas@example.com', username: 'salalahspares', role: 'vendor', password: 'password123', shopAddress: 'Salalah Auto Spares', zipCode: '211', phone: '+96892222222' },
    { name: 'Nizwa Car Parts', email: 'nizwa@example.com', username: 'nizwaparts', role: 'vendor', password: 'password123', shopAddress: 'Nizwa Car Parts', zipCode: '611', phone: '+96893333333' },
];


async function createTables(db: postgres.Sql) {
  console.log("Creating tables if they don't exist...");

  await db.unsafe(`
    DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
            CREATE TYPE account_type AS ENUM ('individual', 'business');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
            CREATE TYPE order_status AS ENUM ('Placed', 'Processing', 'Ready for Pickup', 'Picked Up', 'Cancelled');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
            CREATE TYPE booking_status AS ENUM ('Pending', 'Completed', 'Order Fulfillment');
        END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS public.users (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL UNIQUE,
      username VARCHAR NOT NULL UNIQUE,
      role user_role NOT NULL,
      password TEXT,
      shop_address VARCHAR,
      zip_code VARCHAR,
      verification_code VARCHAR,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      is_blocked BOOLEAN DEFAULT false NOT NULL,
      profile_picture_url VARCHAR,
      phone VARCHAR NOT NULL,
      account_type account_type
    );

    CREATE TABLE IF NOT EXISTS public.parts (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
      quantity INTEGER NOT NULL,
      vendor_address VARCHAR NOT NULL,
      manufacturer VARCHAR NOT NULL,
      is_visible_for_sale BOOLEAN DEFAULT true NOT NULL,
      category JSONB DEFAULT '[]'::jsonb NOT NULL
    );

    CREATE TABLE IF NOT EXISTS public.orders (
      id VARCHAR PRIMARY KEY,
      user_id VARCHAR NOT NULL,
      items JSONB NOT NULL,
      total REAL NOT NULL,
      status order_status NOT NULL,
      order_date TIMESTAMPTZ NOT NULL,
      completion_date TIMESTAMPTZ,
      cancelable BOOLEAN NOT NULL
    );

    CREATE TABLE IF NOT EXISTS public.bookings (
      id VARCHAR PRIMARY KEY,
      part_id VARCHAR NOT NULL,
      part_name VARCHAR NOT NULL,
      user_id VARCHAR NOT NULL,
      user_name VARCHAR NOT NULL,
      booking_date TIMESTAMPTZ NOT NULL,
      status booking_status NOT NULL,
      cost REAL NOT NULL,
      vendor_name VARCHAR NOT NULL,
      order_id VARCHAR
    );

    CREATE TABLE IF NOT EXISTS public.ai_interactions (
        id VARCHAR PRIMARY KEY,
        part_id VARCHAR NOT NULL,
        part_name VARCHAR NOT NULL,
        user_query TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        clicked BOOLEAN NOT NULL,
        ordered BOOLEAN NOT NULL
    );
  `);
  
  console.log("Table creation step completed.");
}

export async function seed() {
    if (!process.env.POSTGRES_URL) {
      console.warn('POSTGRES_URL is not set, skipping database seeding. Please set it in your .env file.');
      return;
    }
    const client = postgres(process.env.POSTGRES_URL, { prepare: false, max: 1 });
    const db = drizzle(client);

    console.log("Seeding database...");

    try {
        await createTables(client);

        // Clean up existing data to ensure a fresh seed
        console.log("Clearing existing data...");
        // Order matters due to potential foreign key constraints in a real DB
        await client.unsafe('DELETE FROM public.bookings');
        await client.unsafe('DELETE FROM public.orders');
        await client.unsafe('DELETE FROM public.ai_interactions');
        await client.unsafe('DELETE FROM public.parts');
        await client.unsafe('DELETE FROM public.users');

        // Insert Users
        console.log("Inserting users...");
        const userValues = MOCK_USERS_DATA.map(user => ({
            ...user,
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            shopAddress: user.shopAddress || null,
            zipCode: user.zipCode || null,
        }));
        await client`INSERT INTO public.users ${client(userValues, 'name', 'email', 'username', 'role', 'password', 'phone', 'shopAddress', 'zipCode', 'id', 'createdAt')}`;
        console.log(`${userValues.length} users inserted.`);


        // Insert Parts
        console.log("Inserting parts...");
        const partValues = MOCK_PARTS_DATA.map(part => ({
          ...part,
          id: `part-${Math.random().toString(36).substr(2, 9)}`
        }));
        await client`INSERT INTO public.parts ${client(partValues, 'name', 'description', 'price', 'imageUrls', 'quantity', 'vendorAddress', 'isVisibleForSale', 'manufacturer', 'category', 'id')}`;
        console.log(`${partValues.length} parts inserted.`);


        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.end();
    }
}

// This allows the script to be run directly from the command line
if (require.main === module) {
  seed();
}
