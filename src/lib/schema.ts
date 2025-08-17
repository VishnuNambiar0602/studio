
// This file defines the database schema using Drizzle ORM.
// While the app is running on mock data, this file is kept for future-proofing
// and to allow Drizzle Studio to potentially visualize the data structure.
// No database connection is made, so these definitions are for structure only.

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
import type { Part, User, Order, Booking, CartItem } from './types';

export const userRoleEnum = pgEnum('user_role', ['customer', 'vendor', 'admin']);
export const accountTypeEnum = pgEnum('account_type', ['individual', 'business']);
export const partCategoryEnum = pgEnum('part_category', ['new', 'used', 'oem']);
export const orderStatusEnum = pgEnum('order_status', ['Placed', 'Processing', 'Ready for Pickup', 'Picked Up', 'Cancelled']);
export const bookingStatusEnum = pgEnum('booking_status', ['Pending', 'Completed', 'Order Fulfillment']);

// The following table definitions are not actively connected to a database
// in the current mock data setup.

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  username: varchar('username').notNull().unique(),
  role: userRoleEnum('role').notNull(),
  password: text('password'),
  shopAddress: varchar('shop_address'),
  zipCode: varchar('zip_code'),
  verificationCode: varchar('verification_code'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  isBlocked: boolean('is_blocked').default(false).notNull(),
  profilePictureUrl: varchar('profile_picture_url'),
  phone: varchar('phone').notNull(),
  accountType: accountTypeEnum('account_type'),
});

export const parts = pgTable('parts', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  imageUrls: jsonb('image_urls').$type<string[]>().default([]).notNull(),
  quantity: integer('quantity').notNull(),
  vendorAddress: varchar('vendor_address').notNull(),
  manufacturer: varchar('manufacturer').notNull(),
  isVisibleForSale: boolean('is_visible_for_sale').default(true).notNull(),
  category: jsonb('category').$type<Array<'new' | 'used' | 'oem'>>().default([]).notNull(),
});

export const orders = pgTable('orders', {
    id: varchar('id').primaryKey(),
    userId: varchar('user_id').notNull(), // No foreign key in mock setup
    items: jsonb('items').$type<CartItem[]>().notNull(),
    total: real('total').notNull(),
    status: orderStatusEnum('status').notNull(),
    orderDate: timestamp('order_date', { withTimezone: true }).notNull(),
    completionDate: timestamp('completion_date', { withTimezone: true }),
    cancelable: boolean('cancelable').notNull(),
});

export const bookings = pgTable('bookings', {
    id: varchar('id').primaryKey(),
    partId: varchar('part_id').notNull(), // No foreign key in mock setup
    partName: varchar('part_name').notNull(),
    userId: varchar('user_id').notNull(), // No foreign key
    userName: varchar('user_name').notNull(),
    bookingDate: timestamp('booking_date', { withTimezone: true }).notNull(),
    status: bookingStatusEnum('status').notNull(),
    cost: real('cost').notNull(),
    vendorName: varchar('vendor_name').notNull(),
    orderId: varchar('order_id'), // No foreign key
});
