
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, CheckoutDetails, CartItem, AiInteraction } from "./types";
import { subMonths, format, getYear, getMonth, subDays, startOfDay } from 'date-fns';
import { MOCK_USERS, MOCK_PARTS, MOCK_ORDERS, MOCK_BOOKINGS, MOCK_AI_INTERACTIONS } from "./mock-data";


// --- In-Memory Data Store ---
let users: User[] = [...MOCK_USERS];
let parts: Part[] = [...MOCK_PARTS];
let orders: Order[] = [...MOCK_ORDERS];
let bookings: Booking[] = [...MOCK_BOOKINGS];
let aiInteractions: AiInteraction[] = [...MOCK_AI_INTERACTIONS];


// --- PART ACTIONS ---

export async function createPart(partData: Omit<Part, 'id' | 'isVisibleForSale'>): Promise<Part | null> {
    const newPart: Part = {
        ...partData,
        id: `part-${Math.random().toString(36).substr(2, 9)}`,
        isVisibleForSale: true,
    };
    parts.unshift(newPart); // Add to the beginning of the array
    
    revalidatePath('/');
    revalidatePath('/new-parts');
    revalidatePath('/used-parts');
    revalidatePath('/oem-parts');
    revalidatePath('/vendor/inventory');
    revalidatePath('/vendor/dashboard');

    return newPart;
}


export async function updatePart(partId: string, partData: Part) {
    const index = parts.findIndex(p => p.id === partId);
    if (index !== -1) {
        parts[index] = { ...parts[index], ...partData };
    }
    revalidatePath(`/part/${partId}`);
    revalidatePath("/vendor/inventory");
    revalidatePath("/");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
}

export async function getParts(): Promise<Part[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));
    return parts;
}

export async function getPart(id: string): Promise<Part | undefined> {
    return parts.find((part) => part.id === id);
}

export async function getPartsByVendor(vendorName: string): Promise<Part[]> {
    return parts.filter(part => part.vendorAddress === vendorName);
}


// --- USER ACTIONS ---
export async function getUserById(userId: string): Promise<User | null> {
    const user = users.find(u => u.id === userId);
    return user || null;
}

export async function getAllUsers(): Promise<PublicUser[]> {
    return users.map(user => {
        const { password, ...publicUser } = user;
        return publicUser;
    });
}

export async function updateUser(userId: string, data: Partial<Omit<User, 'id'>>): Promise<{ success: boolean, message: string }> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }
    users[userIndex] = { ...users[userIndex], ...data };
    revalidatePath('/admin/users');
    revalidatePath(`/admin/vendors/${userId}`);
    return { success: true, message: "User updated successfully." };
}

export async function updateUserProfile(userId: string, data: { name: string; email: string; phone: string; }): Promise<{ success: boolean; message: string; user?: PublicUser; }> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }
    users[userIndex] = { ...users[userIndex], ...data };
    const { password, ...publicUser } = users[userIndex];
    revalidatePath('/settings');
    return { success: true, message: "Profile updated successfully.", user: publicUser };
}


export async function registerUser(userData: UserRegistration) {
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase() || u.phone === userData.phone);
    if (existingUser) {
        return { success: false, message: "A user with this email or phone number already exists." };
    }

    const baseUsername = userData.name.toLowerCase().replace(/\s+/g, '') || 'user';
    const username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        username,
        createdAt: new Date(),
        isBlocked: false,
    };

    users.push(newUser);
    const { password, ...publicUser } = newUser;

    revalidatePath('/admin/users');
    revalidatePath('/admin');
    return { success: true, user: publicUser, message: "User registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    const identifier = credentials.identifier.toLowerCase();
    
    const user = users.find(u => 
        u.email.toLowerCase() === identifier || 
        u.phone === credentials.identifier ||
        u.username.toLowerCase() === identifier
    );

    if (!user) {
        return { success: false, message: "Invalid credentials." };
    }

    if (user.role === 'vendor' && !user.password) {
        // This is a passwordless (OTP-based) vendor login
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
    
    let adminUser = users.find(u => u.username === 'admin' && u.role === 'admin');

    if (!adminUser) {
        return { success: false, message: 'Admin account not found. Please ensure it exists in mock data.' };
    }

    const { password, ...publicAdminUser } = adminUser;
    return { success: true, user: publicAdminUser };
}


export async function sendPasswordResetCode(identifier: string): Promise<{ success: boolean; message: string; code?: string; }> {
    const user = users.find(u => u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier);
    if (!user) {
        return { success: false, message: "No account found with that email or phone number." };
    }
    // Simulate sending a code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    return { success: true, message: "Verification code generated (simulation).", code: code };
}


export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const user = users.find(u => u.email === data.email);
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
    orders.unshift(newOrder);

    if (orderData.aiInteractionId) {
        const interaction = aiInteractions.find(i => i.id === orderData.aiInteractionId);
        if (interaction) {
            interaction.ordered = true;
        }
    }

    for (const item of orderData.items) {
        const part = parts.find(p => p.id === item.id);
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
        bookings.unshift(newBooking);
    }
    
    revalidatePath('/my-orders');
    revalidatePath('/vendor/tasks');
    revalidatePath('/admin/ai-analytics');
    
    return { success: true, message: "Order placed successfully!", orderId: newOrder.id };
}


export async function getCustomerOrders(userId: string): Promise<Order[]> {
    if (!userId) return [];
    const userOrders = orders.filter(o => o.userId === userId);
    return userOrders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
}

export async function getOrderById(orderId: string): Promise<Order | null> {
    const order = orders.find(o => o.id === orderId);
    return order || null;
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        return { success: false, message: 'Order not found.' };
    }

    const order = orders[orderIndex];
    order.status = 'Cancelled';
    order.cancelable = false;

    // Restore inventory
    for (const item of order.items) {
        const part = parts.find(p => p.id === item.id);
        if (part) {
            part.quantity += item.purchaseQuantity;
        }
    }

    // Remove associated booking
    const bookingIndex = bookings.findIndex(b => b.orderId === orderId);
    if (bookingIndex !== -1) {
        bookings.splice(bookingIndex, 1);
    }
    
    revalidatePath('/my-orders');
    revalidatePath('/vendor/tasks');
    revalidatePath('/vendor/inventory');
    revalidatePath('/');
    return { success: true, message: 'Order has been cancelled and inventory restored.' };
}


export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number, vendorName: string, aiInteractionId?: string) {
    const mockUser = users.find(u => u.role === 'customer');
    if (!mockUser) {
        return { success: false, message: "No customer user found to create a booking for." };
    }

     if (aiInteractionId) {
        const interaction = aiInteractions.find(i => i.id === aiInteractionId);
        if (interaction) {
            interaction.clicked = true;
        }
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
    bookings.unshift(newBooking);

    revalidatePath('/vendor/tasks');
    revalidatePath('/admin/ai-analytics');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(vendorName: string): Promise<Booking[]> {
    if (!vendorName) return [];
    return bookings
        .filter(b => b.vendorName === vendorName)
        .sort((a,b) => b.bookingDate.getTime() - a.bookingDate.getTime());
}

export async function completeBooking(bookingId: string) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false };

    if (booking.status === 'Order Fulfillment' && booking.orderId) {
        const order = orders.find(o => o.id === booking.orderId);
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

    const vendorBookings = bookings.filter(b => b.vendorName === vendorName);
    const vendorParts = parts.filter(p => p.vendorAddress === vendorName);

    const totalRevenue = vendorBookings
        .filter(b => b.status === 'Completed')
        .reduce((acc, b) => acc + b.cost, 0);
        
    const itemsOnHold = vendorBookings.filter(b => b.status === 'Pending').length;

    const totalSales = vendorBookings.filter(b => b.status === 'Completed').length;
    
    const activeListings = vendorParts.length;

    return { totalRevenue, itemsOnHold, activeListings, totalSales };
}


export async function getMonthlyRevenue(vendorName: string): Promise<{name: string, total: number}[]> {
    if (!vendorName) return [];

    const twelveMonthsAgo = subMonths(new Date(), 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);
    
    const vendorBookings = bookings.filter(b => 
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
    
    for (const sale of vendorBookings) {
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
    const totalRevenue = orders
        .filter(o => o.status === 'Picked Up')
        .reduce((acc, o) => acc + o.total, 0);
        
    const totalUsers = users.length;
    const totalVendors = users.filter(u => u.role === 'vendor').length;
    const totalParts = parts.length;

    return { totalRevenue, totalUsers, totalVendors, totalParts };
}


export async function getVendorPerformanceSummary() {
    const vendorUsers = users.filter(u => u.role === 'vendor');
    const thirtyDaysAgo = subDays(new Date(), 30);
    const performanceData = [];

    for (const vendor of vendorUsers) {
        const vendorBookings = bookings.filter(b => b.vendorName === vendor.name);

        const monthlySales = vendorBookings
            .filter(b => b.status === 'Completed' && b.bookingDate >= thirtyDaysAgo)
            .reduce((acc, b) => acc + b.cost, 0);

        const recentItems = vendorBookings
            .filter(b => b.status === 'Completed')
            .sort((a,b) => b.bookingDate.getTime() - a.bookingDate.getTime())
            .slice(0, 3)
            .map(item => ({ partName: item.partName, cost: item.cost }));
        
        performanceData.push({
            id: vendor.id,
            name: vendor.name,
            monthlySales,
            recentItems,
        });
    }

    return performanceData;
}


export async function getVendorDetailsForAdmin(vendorId: string) {
    const user = users.find(u => u.id === vendorId);

    if (!user || user.role !== 'vendor' || !user.name) return null;
    
    const vendorParts = await getPartsByVendor(user.name);
    const stats = await getVendorStats(user.name);
    
    const partsWithSales = vendorParts.map(part => {
        const partBookings = bookings.filter(b => b.partId === part.id && b.status === 'Completed');
        const unitsSold = partBookings.length;
        const revenue = partBookings.reduce((sum, b) => sum + b.cost, 0);
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

        const count = users.filter(u => 
            u.createdAt >= dayStart && u.createdAt < dayEnd
        ).length;
        
        last7DaysData.push({
            name: format(day, 'E'),
            visitors: count,
        });
    }
    
    return last7DaysData;
}


export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        // Check if user is associated with any orders/parts - simple check for mock
        const hasDependencies = orders.some(o => o.userId === userId) || parts.some(p => p.vendorAddress === users[userIndex].name);
        if (hasDependencies) {
            return { success: false, message: "Cannot delete this user as they are associated with existing orders or parts. Please block the user instead." };
        }
        users.splice(userIndex, 1);
        revalidatePath('/admin/users');
        return { success: true, message: "User deleted successfully." };
    }
    return { success: false, message: "User not found." };
}

export async function toggleUserBlockStatus(userId: string): Promise<{ success: boolean, message: string }> {
    const user = users.find(u => u.id === userId);
    if (!user) {
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
    aiInteractions.unshift(newInteraction);
    revalidatePath('/admin/ai-analytics');
    return newInteraction;
}

export async function getAiInteractions(): Promise<AiInteraction[]> {
    return aiInteractions.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getAiInteractionStats(): Promise<{suggestions: number, clicks: number, orders: number}> {
    const suggestions = aiInteractions.length;
    const clicks = aiInteractions.filter(i => i.clicked).length;
    const orders = aiInteractions.filter(i => i.ordered).length;
    return { suggestions, clicks, orders };
}
