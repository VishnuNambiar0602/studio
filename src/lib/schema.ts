
import { pgTable, text, real, integer, boolean, timestamp, jsonb, varchar } from 'drizzle-orm/pg-core';
import type { Part, OrderStatus, BookingStatus, CartItem } from './types';

export const users = pgTable('users', {
  id: text('id').primaryKey().default(`'user-' || lower(hex(randomblob(4)))`),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  role: text('role', { enum: ['customer', 'vendor', 'admin'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isBlocked: boolean('is_blocked').default(false).notNull(),
  phone: text('phone').unique(),
  accountType: text('account_type', { enum: ['individual', 'business'] }),
  shopAddress: text('shop_address'),
  zipCode: text('zip_code'),
  profilePictureUrl: text('profile_picture_url'),
  password: text('password'),
  verificationCode: text('verification_code'),
});

export const parts = pgTable('parts', {
    id: text('id').primaryKey().default(`'part-' || lower(hex(randomblob(4)))`),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    imageUrls: jsonb('image_urls').$type<string[]>().notNull(),
    quantity: integer('quantity').notNull(),
    vendorAddress: text('vendor_address').notNull(),
    manufacturer: text('manufacturer').notNull(),
    isVisibleForSale: boolean('is_visible_for_sale').notNull(),
    category: jsonb('category').$type<('new' | 'used' | 'oem')[]>().notNull(),
});

export const orders = pgTable('orders', {
    id: text('id').primaryKey().default(`'order-' || lower(hex(randomblob(4)))`),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    items: jsonb('items').$type<CartItem[]>().notNull(),
    total: real('total').notNull(),
    status: text('status').$type<OrderStatus>().notNull(),
    orderDate: timestamp('order_date').defaultNow().notNull(),
    completionDate: timestamp('completion_date'),
    cancelable: boolean('cancelable').notNull(),
});

export const bookings = pgTable('bookings', {
    id: text('id').primaryKey().default(`'booking-' || lower(hex(randomblob(4)))`),
    partId: text('part_id').references(() => parts.id).notNull(),
    partName: text('part_name').notNull(),
    userId: text('user_id').references(() => users.id).notNull(),
    userName: text('user_name').notNull(),
    bookingDate: timestamp('booking_date').defaultNow().notNull(),
    status: text('status').$type<BookingStatus>().notNull(),
    cost: real('cost').notNull(),
    vendorName: text('vendor_name').notNull(),
    orderId: text('order_id'),
});

export const aiInteractions = pgTable('ai_interactions', {
    id: text('id').primaryKey().default(`'ai-' || lower(hex(randomblob(6)))`),
    partId: text('part_id').notNull(),
    partName: text('part_name').notNull(),
    userQuery: text('user_query').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    clicked: boolean('clicked').default(false).notNull(),
    ordered: boolean('ordered').default(false).notNull(),
});
