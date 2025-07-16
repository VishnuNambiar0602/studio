

import type { Part, Order, Booking, User, OrderStatus } from './types';

// This file is now a reference for mock data structure and can be used for seeding the database.
// The live application will now use the functions in `actions.ts` which query the PostgreSQL database.

export const MOCK_PARTS: Part[] = [
  {
    id: 'part-001',
    name: 'All-Terrain Tire Set',
    description: 'A set of four durable tires designed for off-road desert conditions. Excellent grip and longevity.',
    price: 899.99,
    imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    quantity: 10,
    vendorAddress: 'AutoParts Inc.',
    isVisibleForSale: true,
    category: ['new'],
  },
  {
    id: 'part-002',
    name: 'Heavy-Duty Radiator',
    description: 'High-performance radiator to keep your engine cool under the scorching desert sun.',
    price: 349.50,
    imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    quantity: 5,
    vendorAddress: 'Global Auto Spares',
    isVisibleForSale: true,
    category: ['oem'],
  },
];

export const MOCK_ORDERS: Order[] = [
    { id: 'order-1', userId: 'user-123', items: [MOCK_PARTS[0]], total: 899.99, status: 'Delivered', orderDate: new Date('2024-05-20'), deliveryDate: new Date('2024-05-24'), cancelable: false },
    { id: 'order-2', userId: 'user-123', items: [MOCK_PARTS[1]], total: 349.50, status: 'Processing', orderDate: new Date('2024-05-28'), cancelable: true },
];

export const MOCK_BOOKINGS: Booking[] = [
    { id: 'booking-1', partId: 'part-002', partName: 'Heavy-Duty Radiator', userId: 'user-456', userName: 'Jane Smith', bookingDate: new Date('2024-06-10'), status: 'Pending', cost: 349.50 },
];
