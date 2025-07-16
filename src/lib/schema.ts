import {
  pgTable,
  text,
  varchar,
  real,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';
import type { Part, User } from './types';

export const userRoleEnum = pgEnum('user_role', ['customer', 'vendor', 'admin']);

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  username: varchar('username').notNull().unique(),
  role: userRoleEnum('role').notNull(),
  password: text('password').notNull(),
  shopAddress: varchar('shop_address'),
  zipCode: varchar('zip_code'),
  verificationCode: varchar('verification_code'),
  verificationCodeExpires: timestamp('verification_code_expires', { withTimezone: true }),
});

export const partCategoryEnum = pgEnum('part_category', ['new', 'used', 'oem']);

export const parts = pgTable('parts', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  imageUrls: jsonb('image_urls').$type<string[]>().default([]).notNull(),
  quantity: integer('quantity').notNull(),
  vendorAddress: varchar('vendor_address').notNull(),
  isVisibleForSale: boolean('is_visible_for_sale').default(true).notNull(),
  category: jsonb('category').$type<Array<'new' | 'used' | 'oem'>>().default([]).notNull(),
});

// We can add tables for orders and bookings later.
// For now, let's focus on users and parts.