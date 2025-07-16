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
import type { Part, User, Order, Booking } from './types';

export const userRoleEnum = pgEnum('user_role', ['customer', 'vendor', 'admin']);
export const partCategoryEnum = pgEnum('part_category', ['new', 'used', 'oem']);
export const orderStatusEnum = pgEnum('order_status', ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
export const bookingStatusEnum = pgEnum('booking_status', ['Pending', 'Completed']);


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

export const orders = pgTable('orders', {
    id: varchar('id').primaryKey(),
    userId: varchar('user_id').notNull().references(() => users.id),
    items: jsonb('items').$type<Part[]>().notNull(),
    total: real('total').notNull(),
    status: orderStatusEnum('status').notNull(),
    orderDate: timestamp('order_date', { withTimezone: true }).notNull(),
    deliveryDate: timestamp('delivery_date', { withTimezone: true }),
    cancelable: boolean('cancelable').notNull(),
});

export const bookings = pgTable('bookings', {
    id: varchar('id').primaryKey(),
    partId: varchar('part_id').notNull().references(() => parts.id),
    partName: varchar('part_name').notNull(),
    userId: varchar('user_id').notNull().references(() => users.id),
    userName: varchar('user_name').notNull(),
    bookingDate: timestamp('booking_date', { withTimezone: true }).notNull(),
    status: bookingStatusEnum('status').notNull(),
    cost: real('cost').notNull(),
});
