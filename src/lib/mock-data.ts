
import type { Part, User, Order, Booking } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'user-cust1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    username: 'johndoe', 
    role: 'customer', 
    password: 'password123', 
    phone: '1112223333', 
    accountType: 'individual', 
    createdAt: new Date('2024-05-01'),
    isBlocked: false,
    profilePictureUrl: 'https://placehold.co/100x100.png',
  },
  { 
    id: 'user-vendor1', 
    name: 'Muscat Modern Auto', 
    email: 'mma@example.com', 
    username: 'muscatmodern', 
    role: 'vendor', 
    password: 'password123', 
    shopAddress: 'Muscat Modern Auto', 
    zipCode: '112', 
    phone: '2223334444', 
    accountType: 'business',
    createdAt: new Date('2024-04-15'),
    isBlocked: false,
    profilePictureUrl: 'https://placehold.co/100x100.png',
  },
  { 
    id: 'user-vendor2', 
    name: 'Salalah Auto Spares', 
    email: 'sas@example.com', 
    username: 'salalahspares', 
    role: 'vendor', 
    password: 'password123', 
    shopAddress: 'Salalah Auto Spares', 
    zipCode: '211', 
    phone: '3334445555', 
    accountType: 'business',
    createdAt: new Date('2024-03-20'),
    isBlocked: false,
    profilePictureUrl: 'https://placehold.co/100x100.png',
  },
  { 
    id: 'user-vendor3', 
    name: 'Nizwa Car Parts', 
    email: 'nizwa@example.com', 
    username: 'nizwaparts', 
    role: 'vendor', 
    password: 'password123', 
    shopAddress: 'Nizwa Car Parts', 
    zipCode: '611', 
    phone: '4445556666', 
    accountType: 'business',
    createdAt: new Date('2024-05-10'),
    isBlocked: false,
    profilePictureUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: 'user-admin1',
    name: 'Admin',
    email: 'admin@gulfcarx.com',
    username: 'admin',
    role: 'admin',
    password: 'admin',
    phone: '000000000',
    accountType: 'business',
    createdAt: new Date('2024-01-01'),
    isBlocked: false,
  }
];

export const MOCK_PARTS: Part[] = [
  {
    id: 'part-001',
    name: 'OEM Brake Pads',
    description: 'High-quality original equipment manufacturer brake pads for superior stopping power and longevity. Fits various models.',
    price: 85.50,
    imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    quantity: 25,
    vendorAddress: 'Muscat Modern Auto',
    manufacturer: 'Toyota',
    isVisibleForSale: true,
    category: ['oem', 'new'],
  },
  {
    id: 'part-002',
    name: 'Used Alternator - Toyota Camry',
    description: 'A tested and fully functional used alternator pulled from a 2018 Toyota Camry. 90-day warranty included.',
    price: 120.00,
    imageUrls: ['https://placehold.co/600x400.png'],
    quantity: 8,
    vendorAddress: 'Salalah Auto Spares',
    manufacturer: 'Denso',
    isVisibleForSale: true,
    category: ['used'],
  },
  {
    id: 'part-003',
    name: 'Performance Air Filter',
    description: 'Washable and reusable high-flow air filter. Increases horsepower and acceleration. A simple upgrade for any car enthusiast.',
    price: 45.00,
    imageUrls: ['https://placehold.co/600x400.png'],
    quantity: 50,
    vendorAddress: 'Muscat Modern Auto',
    manufacturer: 'K&N',
    isVisibleForSale: true,
    category: ['new'],
  },
  {
    id: 'part-004',
    name: 'Used Radiator - Nissan Patrol',
    description: 'Used OEM radiator for Nissan Patrol (Y61). Pressure tested and confirmed to be leak-free. Good condition.',
    price: 150.75,
    imageUrls: ['https://placehold.co/600x400.png'],
    quantity: 5,
    vendorAddress: 'Nizwa Car Parts',
    manufacturer: 'Nissan',
    isVisibleForSale: true,
    category: ['used', 'oem'],
  },
  {
    id: 'part-005',
    name: 'New Spark Plugs (4-pack)',
    description: 'Set of four iridium spark plugs for improved fuel efficiency and performance. Fits most 4-cylinder engines.',
    price: 30.00,
    imageUrls: ['https://placehold.co/600x400.png'],
    quantity: 100,
    vendorAddress: 'Muscat Modern Auto',
    manufacturer: 'NGK',
    isVisibleForSale: true,
    category: ['new'],
  },
  {
    id: 'part-006',
    name: 'Used Headlight Assembly - Lexus IS',
    description: 'Right-side (passenger) headlight assembly for a 2016-2019 Lexus IS. Minor cosmetic wear but fully functional.',
    price: 250.00,
    imageUrls: ['https://placehold.co/600x400.png'],
    quantity: 3,
    vendorAddress: 'Salalah Auto Spares',
    manufacturer: 'Lexus',
    isVisibleForSale: false,
    category: ['used', 'oem'],
  },
  {
    id: 'part-007',
    name: 'OEM Oil Filter',
    description: 'Genuine OEM oil filter. Designed for optimal flow and filtration to protect your engine.',
    price: 15.00,
    imageUrls: ['https://placehold.co/600x400.png'],
    quantity: 200,
    vendorAddress: 'Muscat Modern Auto',
    manufacturer: 'Mazda',
    isVisibleForSale: true,
    category: ['oem', 'new'],
  },
  {
    id: 'part-008',
    name: 'Used Transmission - Honda Accord',
    description: 'Complete automatic transmission from a 2017 Honda Accord with 80,000 km. Shifted smoothly before removal.',
    price: 800.00,
    imageUrls: ['https://placehold.co/600x400.png'],
    quantity: 1,
    vendorAddress: 'Nizwa Car Parts',
    manufacturer: 'Honda',
    isVisibleForSale: true,
    category: ['used'],
  },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 'order-001',
        userId: 'user-cust1',
        items: [
            {...MOCK_PARTS[0], purchaseQuantity: 1 }, 
            {...MOCK_PARTS[4], purchaseQuantity: 1 }
        ],
        total: MOCK_PARTS[0].price + MOCK_PARTS[4].price,
        status: 'Picked Up',
        orderDate: new Date('2024-04-15T10:00:00Z'),
        completionDate: new Date('2024-04-18T14:00:00Z'),
        cancelable: false,
    },
    {
        id: 'order-002',
        userId: 'user-cust1',
        items: [{...MOCK_PARTS[2], purchaseQuantity: 2 }],
        total: MOCK_PARTS[2].price * 2,
        status: 'Ready for Pickup',
        orderDate: new Date('2024-05-01T11:30:00Z'),
        cancelable: true,
    },
     {
        id: 'order-003',
        userId: 'user-cust1',
        items: [{...MOCK_PARTS[7], purchaseQuantity: 1 }],
        total: MOCK_PARTS[7].price,
        status: 'Placed',
        orderDate: new Date('2024-05-03T09:00:00Z'),
        cancelable: true,
    }
];

export const MOCK_BOOKINGS: Booking[] = [
    {
        id: 'booking-001',
        partId: 'part-002',
        partName: 'Used Alternator - Toyota Camry',
        userId: 'user-cust1',
        userName: 'John Doe',
        bookingDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        status: 'Pending',
        cost: 120.00,
        vendorName: 'Salalah Auto Spares',
    },
    {
        id: 'booking-002',
        partId: 'part-004',
        partName: 'Used Radiator - Nissan Patrol',
        userId: 'user-cust1',
        userName: 'John Doe',
        bookingDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: 'Pending',
        cost: 150.75,
        vendorName: 'Nizwa Car Parts',
    },
    {
        id: 'booking-003',
        partId: 'part-008',
        partName: 'Used Transmission - Honda Accord',
        userId: 'user-cust1',
        userName: 'John Doe',
        bookingDate: new Date('2024-04-28T15:00:00Z'),
        status: 'Completed',
        cost: 800.00,
        vendorName: 'Nizwa Car Parts',
    },
    ...MOCK_ORDERS.flatMap(order => 
        order.items.map(item => ({
             id: `booking-task-${order.id}-${item.id}`,
            partId: item.id,
            partName: `Order: ${item.name}`,
            userId: order.userId,
            userName: MOCK_USERS.find(u => u.id === order.userId)?.name || 'Customer',
            bookingDate: order.orderDate,
            status: 'Order Fulfillment',
            cost: item.price * item.purchaseQuantity,
            vendorName: item.vendorAddress,
            orderId: order.id,
        }))
    )
];

// Ensure order bookings are updated based on order status
MOCK_BOOKINGS.forEach(b => {
    if (b.orderId) {
        const order = MOCK_ORDERS.find(o => o.id === b.orderId);
        if (order && order.status === 'Picked Up') {
            b.status = 'Completed';
        }
         if (order && order.status === 'Cancelled') {
            b.status = 'Completed'; // Or some other status
        }
    }
});
