
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, CheckoutDetails, CartItem, AiInteraction } from "./types";
import { subMonths, format, getYear, getMonth, subDays, startOfDay } from 'date-fns';

// --- MOCK DATA STORE ---

let MOCK_PARTS: Part[] = [
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

let MOCK_USERS: User[] = [
    { id: 'user-cust1', name: 'Ahmed Al Farsi', email: 'ahmed@example.com', username: 'ahmed_alfarsi', role: 'customer', password: 'password123', createdAt: new Date('2023-01-15'), isBlocked: false, phone: '+96898765432', accountType: 'individual' },
    { id: 'user-vendor1', name: 'Muscat Modern Auto', email: 'mma@example.com', username: 'muscatmodern', role: 'vendor', password: 'password123', shopAddress: 'Muscat Modern Auto', zipCode: '112', createdAt: new Date('2022-11-20'), isBlocked: false, phone: '+96891111111', accountType: 'business'},
    { id: 'user-admin1', name: 'Admin', email: 'admin@gulfcarx.com', username: 'admin', role: 'admin', password: 'admin', createdAt: new Date('2022-10-01'), isBlocked: false, phone: '+96899999999', accountType: 'business' },
    { id: 'user-vendor2', name: 'Salalah Auto Spares', email: 'sas@example.com', username: 'salalahspares', role: 'vendor', password: 'password123', shopAddress: 'Salalah Auto Spares', zipCode: '211', createdAt: new Date('2023-03-10'), isBlocked: false, phone: '+96892222222', accountType: 'business' },
    { id: 'user-vendor3', name: 'Nizwa Car Parts', email: 'nizwa@example.com', username: 'nizwaparts', role: 'vendor', password: 'password123', shopAddress: 'Nizwa Car Parts', zipCode: '611', createdAt: new Date('2023-05-22'), isBlocked: true, phone: '+96893333333', accountType: 'business' },
];

let MOCK_ORDERS: Order[] = [];
let MOCK_BOOKINGS: Booking[] = [];
let MOCK_AI_INTERACTIONS: AiInteraction[] = [];


// --- PART ACTIONS ---

export async function createPart(partData: Omit<Part, 'id' | 'isVisibleForSale'>): Promise<Part | null> {
    const newPart: Part = {
        ...partData,
        id: `part-${Math.random().toString(36).substr(2, 9)}`,
        isVisibleForSale: true,
    };
    MOCK_PARTS.unshift(newPart);
    
    revalidatePath('/');
    revalidatePath('/new-parts');
    revalidatePath('/used-parts');
    revalidatePath('/oem-parts');
    revalidatePath('/vendor/inventory');
    revalidatePath('/vendor/dashboard');
    revalidatePath('/vendor/account');
    revalidatePath('/admin');
    revalidatePath('/admin/vendors', 'layout');

    return newPart;
}

export async function updatePart(partId: string, partData: Part) {
    const index = MOCK_PARTS.findIndex(p => p.id === partId);
    if (index !== -1) {
        MOCK_PARTS[index] = partData;
    }

    revalidatePath(`/part/${partId}`);
    revalidatePath("/vendor/inventory");
    revalidatePath("/");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
    revalidatePath('/vendor/dashboard');
    revalidatePath('/vendor/account');
    revalidatePath('/admin');
    revalidatePath('/admin/vendors', 'layout');
}

export async function getParts(): Promise<Part[]> {
    return MOCK_PARTS;
}

export async function getPart(id: string): Promise<Part | undefined> {
    return MOCK_PARTS.find(p => p.id === id);
}

export async function getPartsByVendor(vendorName: string): Promise<Part[]> {
    return MOCK_PARTS.filter(p => p.vendorAddress === vendorName);
}

// --- USER ACTIONS ---

export async function getUserById(userId: string): Promise<User | null> {
    return MOCK_USERS.find(u => u.id === userId) || null;
}

export async function getAllUsers(): Promise<PublicUser[]> {
    return MOCK_USERS.map(user => {
        const { password, ...publicUser } = user;
        return publicUser;
    });
}

export async function updateUser(userId: string, data: Partial<Omit<PublicUser, 'profilePictureUrl' | 'username'>>): Promise<{ success: boolean; message: string }> {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }
    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };
    revalidatePath('/admin/users');
    revalidatePath(`/admin/vendors/${userId}`);
    return { success: true, message: 'User updated successfully.' };
}

export async function updateUserProfile(userId: string, data: { name: string; email: string; phone: string; }): Promise<{ success: boolean; message: string; user?: PublicUser; }> {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }

    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };
    const { password, ...publicUser } = MOCK_USERS[userIndex];
    revalidatePath('/settings');
    return { success: true, message: "Profile updated successfully.", user: publicUser };
}

export async function registerUser(userData: UserRegistration): Promise<{ success: boolean, message: string, user?: PublicUser }> {
    if (MOCK_USERS.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, message: "An account with this email address already exists." };
    }
    if (MOCK_USERS.some(u => u.phone === userData.phone)) {
        return { success: false, message: "An account with this phone number already exists." };
    }
    const baseUsername = userData.name.toLowerCase().replace(/\s+/g, '') || 'user';
    const username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
        ...userData,
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        username,
        isBlocked: false,
        createdAt: new Date(),
    };
    MOCK_USERS.push(newUser);
    const { password, ...publicUser } = newUser;

    revalidatePath('/admin/users');
    revalidatePath('/admin');
    return { success: true, user: publicUser, message: "User registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    const identifier = credentials.identifier.toLowerCase();
    const user = MOCK_USERS.find(u =>
        u.email.toLowerCase() === identifier ||
        u.phone === credentials.identifier ||
        u.username.toLowerCase() === identifier
    );

    if (!user) {
        return { success: false, message: "Invalid credentials." };
    }
    
    if (user.password && user.password !== credentials.password) {
       return { success: false, message: "Invalid credentials." };
    }
    if (!user.password && user.role === 'vendor' && user.phone === credentials.identifier) {
        // This is a passwordless (OTP-based) vendor login, we just approve it for mock.
    } else if (user.password !== credentials.password) {
        return { success: false, message: "Invalid credentials." };
    }


    if (user.isBlocked) {
        return { success: false, message: "This account has been blocked. Please contact support." };
    }

    const { password, ...publicUser } = user;
    return { success: true, user: publicUser };
}


export async function adminLogin(credentials: { username?: string, password?: string }) {
    if (credentials.username !== 'admin' || credentials.password !== 'admin') {
        return { success: false, message: 'Invalid admin credentials.' };
    }
    
    let adminUser = MOCK_USERS.find(u => u.username === 'admin' && u.role === 'admin');

    if (!adminUser) {
        adminUser = {
            id: 'user-admin1',
            name: 'Admin',
            email: 'admin@gulfcarx.com',
            username: 'admin',
            role: 'admin',
            password: 'admin',
            createdAt: new Date(),
            isBlocked: false,
            phone: '+96899999999',
            accountType: 'business'
        };
        MOCK_USERS.push(adminUser);
    }

    const { password, ...publicAdminUser } = adminUser;
    return { success: true, user: publicAdminUser };
}

export async function sendPasswordResetCode(identifier: string): Promise<{ success: boolean; message: string; code?: string; }> {
    const user = MOCK_USERS.find(u => u.email === identifier || u.phone === identifier);
    
    if (!user) {
        return { success: false, message: "No account found with that email or phone number." };
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    return { success: true, message: "Verification code sent.", code: code };
}

export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const user = MOCK_USERS.find(u => u.email === data.email);
    if (!user || user.verificationCode !== data.code) {
        return { success: false, message: "Invalid verification code." };
    }
    user.password = data.newPassword;
    user.verificationCode = undefined;
    return { success: true, message: "Password has been reset successfully." };
}

// --- ORDER & BOOKING ACTIONS ---

export async function placeOrder(orderData: { userId: string; items: CartItem[]; total: number; shippingDetails: CheckoutDetails; aiInteractionId?: string }): Promise<{ success: boolean; message: string; orderId?: string; }> {
    const newOrder: Order = {
        id: `order-${Math.random().toString(36).substr(2, 9)}`,
        userId: orderData.userId,
        items: orderData.items,
        total: orderData.total,
        status: 'Placed',
        orderDate: new Date(),
        cancelable: true,
    };
    MOCK_ORDERS.unshift(newOrder);

    if (orderData.aiInteractionId) {
        const interaction = MOCK_AI_INTERACTIONS.find(i => i.id === orderData.aiInteractionId);
        if(interaction) interaction.ordered = true;
    }

    for (const item of orderData.items) {
        const part = MOCK_PARTS.find(p => p.id === item.id);
        if (part) {
            part.quantity -= item.purchaseQuantity;
        }

        const newBooking: Booking = {
            id: `booking-${Math.random().toString(36).substr(2, 9)}`,
            partId: item.id,
            partName: `Order: ${item.name}`,
            userId: orderData.userId,
            userName: orderData.shippingDetails.name,
            bookingDate: newOrder.orderDate,
            status: 'Order Fulfillment',
            cost: item.price * item.purchaseQuantity,
            vendorName: item.vendorAddress,
            orderId: newOrder.id,
        };
        MOCK_BOOKINGS.unshift(newBooking);
    }
    
    revalidatePath('/my-orders');
    revalidatePath('/vendor/tasks');
    revalidatePath('/admin/ai-analytics');
    
    return { success: true, message: "Order placed successfully!", orderId: newOrder.id };
}

export async function getCustomerOrders(userId: string): Promise<Order[]> {
    if (!userId) return [];
    return MOCK_ORDERS.filter(o => o.userId === userId).sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
}

export async function getOrderById(orderId: string): Promise<Order | null> {
    return MOCK_ORDERS.find(o => o.id === orderId) || null;
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (!order) {
        return { success: false, message: 'Order not found.' };
    }

    for (const item of order.items) {
        const part = MOCK_PARTS.find(p => p.id === item.id);
        if (part) {
            part.quantity += item.purchaseQuantity;
        }
    }
    
    MOCK_BOOKINGS = MOCK_BOOKINGS.filter(b => b.orderId !== orderId);

    order.status = 'Cancelled';
    order.cancelable = false;

    revalidatePath('/my-orders');
    revalidatePath('/vendor/tasks');
    revalidatePath('/vendor/inventory');
    revalidatePath('/');
    return { success: true, message: 'Order has been cancelled and inventory restored.' };
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number, vendorName: string, aiInteractionId?: string) {
    const mockUser = MOCK_USERS.find(u => u.role === 'customer');
    if (!mockUser) {
        return { success: false, message: "No customer user found to create a booking for." };
    }

    if (aiInteractionId) {
        const interaction = MOCK_AI_INTERACTIONS.find(i => i.id === aiInteractionId);
        if (interaction) interaction.clicked = true;
    }
    
    const newBooking: Booking = {
        id: `booking-${Math.random().toString(36).substr(2, 9)}`,
        partId,
        partName,
        bookingDate,
        userId: mockUser.id,
        userName: mockUser.name,
        cost,
        status: 'Pending',
        vendorName: vendorName,
    };

    MOCK_BOOKINGS.unshift(newBooking);

    revalidatePath('/vendor/tasks');
    revalidatePath('/admin/ai-analytics');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(vendorName: string): Promise<Booking[]> {
    if (!vendorName) return [];
    return MOCK_BOOKINGS.filter(b => b.vendorName === vendorName).sort((a,b) => b.bookingDate.getTime() - a.bookingDate.getTime());
}

export async function completeBooking(bookingId: string) {
    const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
    if (!booking) {
        return { success: false };
    }

    if (booking.status === 'Order Fulfillment' && booking.orderId) {
        const order = MOCK_ORDERS.find(o => o.id === booking.orderId);
        if (order) {
            order.status = 'Picked Up';
            order.cancelable = false;
        }
    }
    
    booking.status = 'Completed';
    
    revalidatePath('/vendor/tasks');
    revalidatePath('/vendor/dashboard');
    revalidatePath('/my-orders');
    if (booking.orderId) {
        revalidatePath(`/track/${booking.orderId}`);
    }
    return { success: true };
}

export async function getVendorStats(vendorName: string) {
    if (!vendorName) {
        return { totalRevenue: 0, itemsOnHold: 0, activeListings: 0, totalSales: 0 };
    }

    const vendorBookings = MOCK_BOOKINGS.filter(b => b.vendorName === vendorName);
    const vendorParts = MOCK_PARTS.filter(p => p.vendorAddress === vendorName);

    const totalRevenue = vendorBookings
        .filter(b => b.status === 'Completed')
        .reduce((acc, b) => acc + b.cost, 0);
        
    const itemsOnHold = vendorBookings.filter(b => b.status === 'Pending').length;
    
    const activeListings = vendorParts.length;

    const totalSales = vendorBookings.filter(b => b.status === 'Completed').length;

    return {
        totalRevenue,
        itemsOnHold,
        activeListings,
        totalSales,
    };
}


export async function getMonthlyRevenue(vendorName: string): Promise<{name: string, total: number}[]> {
    if (!vendorName) return [];

    const twelveMonthsAgo = subMonths(new Date(), 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const sales = MOCK_BOOKINGS.filter(b => 
        b.vendorName === vendorName && 
        b.status === 'Completed' && 
        b.bookingDate >= twelveMonthsAgo
    );
    
    const monthlyRevenue: {[key: string]: number} = {};
    const monthLabels: {year: number, month: number, name: string}[] = [];

    for (let i = 11; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const year = getYear(date);
        const month = getMonth(date);
        const monthName = format(date, 'MMM');
        const key = `${year}-${month}`;
        monthlyRevenue[key] = 0;
        monthLabels.push({ year, month, name: monthName });
    }
    
    for (const sale of sales) {
        const year = getYear(sale.bookingDate);
        const month = getMonth(sale.bookingDate);
        const key = `${year}-${month}`;
        if (monthlyRevenue.hasOwnProperty(key)) {
            monthlyRevenue[key] += sale.cost;
        }
    }

    return monthLabels.map(label => {
        const key = `${label.year}-${label.month}`;
        return { name: label.name, total: monthlyRevenue[key] || 0 };
    });
}

// --- ADMIN ACTIONS ---
export async function getAdminDashboardStats() {
    const totalRevenue = MOCK_ORDERS.filter(o => o.status === 'Picked Up').reduce((sum, o) => sum + o.total, 0);
    const totalUsers = MOCK_USERS.length;
    const totalVendors = MOCK_USERS.filter(u => u.role === 'vendor').length;
    const totalParts = MOCK_PARTS.length;

    return {
        totalRevenue,
        totalUsers,
        totalVendors,
        totalParts,
    };
}


export async function getVendorPerformanceSummary() {
    const vendorUsers = MOCK_USERS.filter(u => u.role === 'vendor');
    const thirtyDaysAgo = subDays(new Date(), 30);
    const performanceData = [];

    for (const vendor of vendorUsers) {
        const sales = MOCK_BOOKINGS.filter(b => 
            b.vendorName === vendor.name &&
            b.status === 'Completed' &&
            b.bookingDate >= thirtyDaysAgo
        );
        const monthlySales = sales.reduce((sum, s) => sum + s.cost, 0);

        const recentItems = MOCK_BOOKINGS
            .filter(b => b.vendorName === vendor.name && b.status === 'Completed')
            .sort((a,b) => b.bookingDate.getTime() - a.bookingDate.getTime())
            .slice(0, 3)
            .map(item => ({ partName: item.partName, cost: item.cost }));
        
        performanceData.push({
            id: vendor.id,
            name: vendor.name,
            monthlySales: monthlySales,
            recentItems: recentItems,
        });
    }

    return performanceData;
}


export async function getVendorDetailsForAdmin(vendorId: string) {
    const user = MOCK_USERS.find(u => u.id === vendorId);

    if (!user || user.role !== 'vendor') return null;
    
    const vendorParts = await getPartsByVendor(user.name);
    const stats = await getVendorStats(user.name);
    
    const partsWithSales = vendorParts.map(part => {
        const sales = MOCK_BOOKINGS.filter(b => b.partId === part.id && b.status === 'Completed');
        const unitsSold = sales.length;
        const revenue = sales.reduce((sum, s) => sum + s.cost, 0);
        return { ...part, unitsSold, revenue };
    });


    return { user, parts: partsWithSales, stats };
}

export async function getWeeklyTrafficData(): Promise<{ name: string; visitors: number }[]> {
    const today = new Date();
    const last7DaysData = [];

    for (let i = 6; i >= 0; i--) {
        const day = subDays(today, i);
        const dayStart = startOfDay(day);
        const dayEnd = startOfDay(subDays(today, i - 1));

        const count = MOCK_USERS.filter(u => u.createdAt >= dayStart && u.createdAt < dayEnd).length;

        last7DaysData.push({
            name: format(day, 'E'),
            visitors: count,
        });
    }
    
    return last7DaysData;
}


export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    if (MOCK_ORDERS.some(o => o.userId === userId)) {
        return { success: false, message: "Cannot delete this user as they are associated with existing orders or parts. Please block the user instead." };
    }
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if(userIndex > -1) {
        MOCK_USERS.splice(userIndex, 1);
        revalidatePath('/admin/users');
        return { success: true, message: "User deleted successfully." };
    }
    return { success: false, message: "User not found." };
}

export async function toggleUserBlockStatus(userId: string): Promise<{ success: boolean, message: string }> {
    const user = MOCK_USERS.find(u => u.id === userId);
    if(!user) {
        return { success: false, message: "User not found." };
    }

    user.isBlocked = !user.isBlocked;
    revalidatePath('/admin/users');
    return { success: true, message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}.` };
}

// --- AI INTERACTION ACTIONS ---

export async function logAiInteraction(interaction: Omit<AiInteraction, 'id' | 'timestamp' | 'clicked' | 'ordered'>): Promise<AiInteraction> {
    const newInteraction: AiInteraction = {
        id: `ai-interaction-${Date.now()}`,
        ...interaction,
        timestamp: new Date(),
        clicked: false,
        ordered: false,
    };
    MOCK_AI_INTERACTIONS.push(newInteraction);
    revalidatePath('/admin/ai-analytics');
    return newInteraction;
}

export async function getAiInteractions(): Promise<AiInteraction[]> {
    return MOCK_AI_INTERACTIONS.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getAiInteractionStats(): Promise<{suggestions: number, clicks: number, orders: number}> {
    const suggestions = MOCK_AI_INTERACTIONS.length;
    const clicks = MOCK_AI_INTERACTIONS.filter(i => i.clicked).length;
    const orders = MOCK_AI_INTERACTIONS.filter(i => i.ordered).length;
    return { suggestions, clicks, orders };
}
