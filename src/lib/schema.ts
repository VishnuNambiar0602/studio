
import { pgTable, text, real, integer, boolean, varchar, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import type { Part, Order, Booking, AiInteraction } from './types';

export const roleEnum = pgEnum('role', ['customer', 'vendor', 'admin']);
export const accountTypeEnum = pgEnum('account_type', ['individual', 'business']);

export const users = pgTable('users', {
    id: varchar('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    role: roleEnum('role').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    isBlocked: boolean('is_blocked').default(false).notNull(),
    phone: text('phone').unique(),
    accountType: accountTypeEnum('account_type'),
    shopAddress: text('shop_address'),
    zipCode: text('zip_code'),
    profilePictureUrl: text('profile_picture_url'),
    password: text('password'),
    verificationCode: text('verification_code'),
    verificationCodeExpires: timestamp('verification_code_expires'),
});

export const parts = pgTable('parts', {
    id: varchar('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    imageUrls: jsonb('image_urls').$type<string[]>().notNull(),
    quantity: integer('quantity').notNull(),
    vendorAddress: text('vendor_address').notNull(),
    manufacturer: text('manufacturer').notNull(),
    isVisibleForSale: boolean('is_visible_for_sale').notNull(),
    category: jsonb('category').$type<Array<'new' | 'used' | 'oem'>>().notNull(),
});

export const orderStatusEnum = pgEnum('order_status', ['Placed', 'Processing', 'Ready for Pickup', 'Picked Up', 'Cancelled']);

export const orders = pgTable('orders', {
    id: varchar('id').primaryKey(),
    userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    items: jsonb('items').$type<Order['items']>().notNull(),
    total: real('total').notNull(),
    status: orderStatusEnum('status').notNull(),
    orderDate: timestamp('order_date').defaultNow().notNull(),
    completionDate: timestamp('completion_date'),
    cancelable: boolean('cancelable').notNull(),
});

export const bookingStatusEnum = pgEnum('booking_status', ['Pending', 'Completed', 'Order Fulfillment']);

export const bookings = pgTable('bookings', {
    id: varchar('id').primaryKey(),
    partId: varchar('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
    partName: text('part_name').notNull(),
    userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    userName: text('user_name').notNull(),
    bookingDate: timestamp('booking_date').defaultNow().notNull(),
    status: bookingStatusEnum('status').notNull(),
    cost: real('cost').notNull(),
    vendorName: text('vendor_name').notNull(),
    orderId: varchar('order_id'),
});


export const aiInteractions = pgTable('ai_interactions', {
    id: varchar('id').primaryKey(),
    partId: varchar('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
    partName: text('part_name').notNull(),
    userQuery: text('user_query').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    clicked: boolean('clicked').notNull(),
    ordered: boolean('ordered').notNull(),
});
