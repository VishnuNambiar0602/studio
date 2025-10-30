
import type { User, Part, Order, Booking, AiInteraction } from './types';

export const MOCK_USERS: User[] = [
    { id: 'user-cust1', name: 'Ahmed Al Farsi', email: 'ahmed@example.com', username: 'ahmed_alfarsi', role: 'customer', password: 'password123', phone: '+96898765432', accountType: 'individual', createdAt: new Date('2024-05-10'), isBlocked: false },
    { id: 'user-vendor1', name: 'Muscat Modern Auto', email: 'mma@example.com', username: 'muscatmodern', role: 'vendor', password: 'password123', shopAddress: 'Muscat Modern Auto', zipCode: '112', phone: '+96891111111', accountType: 'business', createdAt: new Date('2024-01-15'), isBlocked: false },
    { id: 'user-admin1', name: 'Admin', email: 'admin@gulfcarx.com', username: 'admin', role: 'admin', password: 'admin', phone: '+96899999999', accountType: 'business', createdAt: new Date('2024-01-01'), isBlocked: false },
    { id: 'user-vendor2', name: 'Salalah Auto Spares', email: 'sas@example.com', username: 'salalahspares', role: 'vendor', password: 'password123', shopAddress: 'Salalah Auto Spares', zipCode: '211', phone: '+96892222222', accountType: 'business', createdAt: new Date('2024-03-20'), isBlocked: false },
    { id: 'user-vendor3', name: 'Nizwa Car Parts', email: 'nizwa@example.com', username: 'nizwaparts', role: 'vendor', password: 'password123', shopAddress: 'Nizwa Car Parts', zipCode: '611', phone: '+96893333333', accountType: 'business', createdAt: new Date('2024-04-05'), isBlocked: true },
];


export const MOCK_PARTS: Part[] = [
  {
    id: 'part-1',
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
    id: 'part-2',
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
    id: 'part-3',
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
    id: 'part-4',
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
    id: 'part-5',
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
    id: 'part-6',
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


export const MOCK_ORDERS: Order[] = [
    {
        id: 'order-1',
        userId: 'user-cust1',
        items: [
            {...MOCK_PARTS[0], purchaseQuantity: 1},
            {...MOCK_PARTS[2], purchaseQuantity: 2},
        ],
        total: (MOCK_PARTS[0].price * 1) + (MOCK_PARTS[2].price * 2),
        status: 'Picked Up',
        orderDate: new Date('2024-05-01'),
        completionDate: new Date('2024-05-03'),
        cancelable: false,
    },
    {
        id: 'order-2',
        userId: 'user-cust1',
        items: [
            {...MOCK_PARTS[3], purchaseQuantity: 1}
        ],
        total: MOCK_PARTS[3].price,
        status: 'Processing',
        orderDate: new Date(),
        cancelable: true,
    }
];

export const MOCK_BOOKINGS: Booking[] = [
    { id: 'booking-1', partId: 'part-1', partName: 'OEM Brake Pads - Toyota Camry', userId: 'user-cust1', userName: 'Ahmed Al Farsi', bookingDate: new Date('2024-05-15'), status: 'Completed', cost: MOCK_PARTS[0].price, vendorName: 'Muscat Modern Auto' },
    { id: 'booking-2', partId: 'part-2', partName: 'Used Alternator - Honda Accord', userId: 'user-cust1', userName: 'Ahmed Al Farsi', bookingDate: new Date('2024-05-18'), status: 'Pending', cost: MOCK_PARTS[1].price, vendorName: 'Salalah Auto Spares' },
    { id: 'booking-3', partId: 'part-5', partName: 'Order: Denso Iridium Spark Plugs', userId: 'user-cust1', userName: 'Ahmed Al Farsi', bookingDate: new Date('2024-05-20'), status: 'Order Fulfillment', cost: MOCK_PARTS[4].price, vendorName: 'Muscat Modern Auto', orderId: 'order-3' }
];

export const MOCK_AI_INTERACTIONS: AiInteraction[] = [
    { id: 'ai-1', partId: 'part-1', partName: 'OEM Brake Pads - Toyota Camry', userQuery: "I need brakes for my camry", timestamp: new Date(), clicked: true, ordered: true },
    { id: 'ai-2', partId: 'part-3', partName: 'K&N Performance Air Filter', userQuery: "what's a good air filter?", timestamp: new Date(), clicked: true, ordered: false },
    { id: 'ai-3', partId: 'part-4', partName: 'Used Radiator - Nissan Patrol Y61', userQuery: "radiator for patrol", timestamp: new Date(), clicked: false, ordered: false },
]
