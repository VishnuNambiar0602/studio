
import type { Part, Order, Booking } from './types';
import { users } from './users'; // We need user data for some functions

// This is a mock database. In a real-world scenario, you would use a proper database
// like Firestore, PostgreSQL, etc. The data is stored in a global variable to simulate
// persistence across requests during a single server session. It will reset when the
// server restarts.
const partsData: Part[] = [
  {
    id: 'part-001',
    name: 'All-Terrain Tire Set',
    description: 'A set of four durable tires designed for off-road desert conditions. Excellent grip and longevity.',
    price: 899.99,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: 'AutoParts Inc.', // Changed to vendor name
    isVisibleForSale: true,
    category: 'new',
  },
  {
    id: 'part-002',
    name: 'Heavy-Duty Radiator',
    description: 'High-performance radiator to keep your engine cool under the scorching desert sun.',
    price: 349.50,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: 'Global Auto Spares',
    isVisibleForSale: true,
    category: 'oem',
  },
  {
    id: 'part-003',
    name: 'Performance Air Filter',
    description: 'Protects your engine from sand and dust while improving airflow and horsepower.',
    price: 75.00,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: false,
    vendorAddress: 'AutoParts Inc.',
    isVisibleForSale: true,
    category: 'used',
  },
  {
    id: 'part-004',
    name: 'LED Light Bar',
    description: '22-inch light bar for superior visibility during night-time desert drives.',
    price: 199.99,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: 'Desert Off-Road Supply',
    isVisibleForSale: true,
    category: 'new',
  },
  {
    id: 'part-005',
    name: 'Premium Ceramic Brake Pads',
    description: 'Low-dust, quiet operation brake pads with excellent stopping power for any vehicle.',
    price: 120.75,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: 'Global Auto Spares',
    isVisibleForSale: true,
    category: 'oem',
  },
  {
    id: 'part-006',
    name: 'Upgraded Suspension Kit',
    description: 'Provides a smoother ride on rough terrain and increases ground clearance.',
    price: 1250.00,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: 'Desert Off-Road Supply',
    isVisibleForSale: true,
    category: 'used',
  },
  {
    id: 'part-007',
    name: 'Engine Oil - Synthetic Blend',
    description: 'High-mileage synthetic blend oil for superior engine protection in extreme temperatures.',
    price: 45.99,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: 'AutoParts Inc.',
    isVisibleForSale: true,
    category: 'new',
  },
  {
    id: 'part-008',
    name: 'Car Battery - 750 CCA',
    description: 'Reliable car battery with 750 cold cranking amps for consistent starts in all weather.',
    price: 180.00,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: 'Global Auto Spares',
    isVisibleForSale: true,
    category: 'oem',
  },
];

const ordersData: Order[] = [
    { id: 'order-1', userId: 'user-123', items: [partsData[0]], total: 899.99, status: 'Delivered', orderDate: new Date('2024-05-20') },
    { id: 'order-2', userId: 'user-123', items: [partsData[4], partsData[6]], total: 166.74, status: 'Processing', orderDate: new Date('2024-05-28') },
];

const bookingsData: Booking[] = [
    { id: 'booking-1', partId: 'part-002', partName: 'Heavy-Duty Radiator', userId: 'user-456', userName: 'Jane Smith', bookingDate: new Date('2024-06-10'), status: 'Pending', cost: 349.50 },
];

if (!(global as any).parts) {
  (global as any).parts = partsData;
}
if (!(global as any).orders) {
  (global as any).orders = ordersData;
}
if (!(global as any).bookings) {
  (global as any).bookings = bookingsData;
}

const db: { parts: Part[], orders: Order[], bookings: Booking[] } = {
    parts: (global as any).parts,
    orders: (global as any).orders,
    bookings: (global as any).bookings,
};

/**
 * Simulates fetching all parts from a database.
 */
export async function getParts(): Promise<Part[]> {
  await new Promise(resolve => setTimeout(resolve, 250));
  return db.parts;
}

/**
 * Simulates adding a new part to the database.
 */
export async function addPart(part: Part): Promise<Part> {
  await new Promise(resolve => setTimeout(resolve, 250));
  db.parts.unshift(part);
  return part;
}

/**
 * Simulates toggling the visibility of a part in the database.
 */
export async function togglePartVisibility(partId: string): Promise<Part | undefined> {
  await new Promise(resolve => setTimeout(resolve, 250));
  const part = db.parts.find((p) => p.id === partId);
  if (part) {
      part.isVisibleForSale = !part.isVisibleForSale;
      return part;
  }
  return undefined;
}

/**
 * Simulates fetching orders for a specific user.
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return db.orders.filter(order => order.userId === userId);
}


/**
 * Simulates creating a new booking.
 */
export async function createBooking(bookingData: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        status: 'Pending',
        ...bookingData,
    };
    db.bookings.unshift(newBooking);
    return newBooking;
}

/**
 * Simulates fetching all bookings.
 */
export async function getBookings(): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return db.bookings;
}

/**
 * Simulates updating a booking's status.
 */
export async function updateBookingStatus(bookingId: string, status: 'Pending' | 'Completed'): Promise<Booking | undefined> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const booking = db.bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = status;
        return booking;
    }
    return undefined;
}

/**
 * Finds a vendor by their name (used as vendorAddress in Part)
 */
export async function getVendorByAddress(vendorName: string) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return users.find(u => u.role === 'vendor' && u.name === vendorName);
}
