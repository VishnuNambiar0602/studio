

"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, CheckoutDetails, CartItem, AiInteraction } from "./types";
import { MOCK_USERS, MOCK_PARTS, MOCK_ORDERS, MOCK_BOOKINGS, MOCK_AI_INTERACTIONS } from "./mock-data";
import { subMonths, format, getYear, getMonth, subDays, startOfDay } from 'date-fns';
import { config } from 'dotenv';
import twilio from 'twilio';


config();

// --- In-memory data stores ---
let users: User[] = [...MOCK_USERS];
let parts: Part[] = [...MOCK_PARTS];
let orders: Order[] = [...MOCK_ORDERS];
let bookings: Booking[] = [...MOCK_BOOKINGS];
let aiInteractions: AiInteraction[] = [...MOCK_AI_INTERACTIONS];


async function sendSms(phone: string, message: string): Promise<{ success: boolean; message?: string }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    // Simulate success if Twilio credentials are not set
    if (!accountSid || !authToken || !fromNumber) {
        console.warn("Twilio environment variables not set. Simulating SMS success.");
        return { success: true, message: "SMS sending is simulated." };
    }

    try {
        const client = twilio(accountSid, authToken);
        const response = await client.messages.create({
            body: message,
            from: fromNumber,
            to: phone,
        });

        console.log("SMS sent successfully with SID:", response.sid);
        return { success: true };
    } catch (error: any) {
        console.error("Twilio error sending SMS:", error);
        return { success: false, message: `Twilio Error: ${error.message}` };
    }
}


// --- PART ACTIONS ---

export async function createPart(partData: Omit<Part, 'id' | 'isVisibleForSale'>): Promise<Part | null> {
    const newPart: Part = {
        ...partData,
        id: `part-${Date.now()}-${Math.random()}`,
        isVisibleForSale: true,
    };
    parts.unshift(newPart);

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
    revalidatePath('/vendor/dashboard');
}

export async function getParts(): Promise<Part[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return parts;
}

export async function getPart(id: string): Promise<Part | undefined> {
    return parts.find(p => p.id === id);
}

export async function getPartsByVendor(vendorName: string): Promise<Part[]> {
    return parts.filter(p => p.vendorAddress === vendorName);
}

export async function getPopularParts(): Promise<Part[]> {
    const interactionCounts: { [partId: string]: number } = {};

    // Count clicks and orders for each part
    for (const interaction of aiInteractions) {
        if (!interactionCounts[interaction.partId]) {
            interactionCounts[interaction.partId] = 0;
        }
        if (interaction.clicked) interactionCounts[interaction.partId]++;
        if (interaction.ordered) interactionCounts[interaction.partId] += 2; // Weight orders more
    }
    
    const sortedPartIds = Object.keys(interactionCounts).sort((a, b) => interactionCounts[b] - interactionCounts[a]);
    
    // Get the full part objects in sorted order
    const popularParts = sortedPartIds.map(partId => parts.find(p => p.id === partId)).filter(p => p) as Part[];
    
    // Get the remaining parts that are not in the popular list
    const otherParts = parts.filter(p => !sortedPartIds.includes(p.id));
    
    // Concatenate popular parts with the rest
    return [...popularParts, ...otherParts];
}


// --- USER ACTIONS ---

export async function getUserById(userId: string): Promise<User | null> {
    const user = users.find(u => u.id === userId);
    return user || null;
}

export async function getAllUsers(): Promise<PublicUser[]> {
    return users.map(({ password, ...publicUser }) => publicUser);
}

export async function updateUser(userId: string, data: Partial<Omit<PublicUser, 'profilePictureUrl' | 'username'>>): Promise<{ success: boolean; message: string }> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }
    users[userIndex] = { ...users[userIndex], ...data };
    revalidatePath('/admin/users');
    revalidatePath(`/admin/vendors/${userId}`);
    return { success: true, message: 'User updated successfully.' };
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
        ...userData,
        id: `user-${Date.now()}-${Math.random()}`,
        username,
        isBlocked: false,
        createdAt: new Date(),
    };

    users.unshift(newUser);

    if (newUser.phone) {
        await sendSms(newUser.phone, `Welcome to GulfCarX, ${newUser.name}! Your account has been created successfully.`);
    }

    revalidatePath('/admin/users');
    const { password, ...publicUser } = newUser;
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

    if (user.password && user.password !== credentials.password) {
        return { success: false, message: "Invalid credentials." };
    }

    if (!user.password && user.role === 'vendor' && user.phone === credentials.identifier) {
        // This is a passwordless (OTP-based) vendor login, we'll allow it for mock.
    } else if (user.password && user.password !== credentials.password) {
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
        // Create admin user if it doesn't exist
        adminUser = {
            id: 'user-admin1',
            name: 'Admin',
            email: 'admin@gulfcarx.com',
            username: 'admin',
            role: 'admin',
            password: 'admin',
            phone: '+96899999999',
            accountType: 'business',
            createdAt: new Date('2024-01-01'),
            isBlocked: false
        };
        users.unshift(adminUser);
    }

    const { password, ...publicAdminUser } = adminUser;
    return { success: true, user: publicAdminUser };
}

export async function sendPasswordResetCode(identifier: string): Promise<{ success: boolean; message: string; code?: string; }> {
    const user = users.find(u => u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier);
    
    if (!user) {
        return { success: false, message: "No account found with that email or phone number." };
    }

    if (!user.phone) {
        return { success: false, message: "No phone number is associated with this account for password reset." };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    
    const smsResult = await sendSms(user.phone, `Your GulfCarX password reset code is: ${code}`);

    if (smsResult.success) {
      return { success: true, message: "Verification code sent to your phone (simulation).", code };
    } else {
      // Still return success and the code for simulation, but include the underlying error message
      return { success: true, message: smsResult.message || "Failed to send verification code, but proceeding with simulation.", code };
    }
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
        id: `order-${Date.now()}`,
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
        if (interaction) interaction.ordered = true;
    }

    for (const item of orderData.items) {
        const part = parts.find(p => p.id === item.id);
        if (part) {
            part.quantity -= item.purchaseQuantity;
        }

        const newBooking: Booking = {
            id: `booking-${Date.now()}-${Math.random()}`,
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
    return orders.filter(o => o.userId === userId).sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
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
    if (!order.cancelable) {
        return { success: false, message: 'This order cannot be cancelled.' };
    }
    
    order.status = 'Cancelled';
    order.cancelable = false;

    for (const item of order.items) {
        const part = parts.find(p => p.id === item.id);
        if (part) {
            part.quantity += item.purchaseQuantity;
        }
    }
    
    bookings = bookings.filter(b => b.orderId !== orderId);

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
        if (interaction) interaction.clicked = true;
    }

    const newBooking: Booking = {
        id: `booking-${Date.now()}`,
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
    return bookings.filter(b => b.vendorName === vendorName).sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime());
}

export async function completeBooking(bookingId: string) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        return { success: false };
    }

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
        .reduce((sum, b) => sum + b.cost, 0);

    const itemsOnHold = vendorBookings.filter(b => b.status === 'Pending').length;
    
    const totalSales = vendorBookings.filter(b => b.status === 'Completed').length;
    
    const activeListings = vendorParts.length;

    return {
        totalRevenue,
        itemsOnHold,
        activeListings,
        totalSales,
    };
}


export async function getMonthlyRevenue(vendorName: string): Promise<{name: string, total: number}[]> {
    if (!vendorName) return [];

    const vendorBookings = bookings.filter(b => b.vendorName === vendorName && b.status === 'Completed');
    
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
    
    for (const booking of vendorBookings) {
        const year = getYear(booking.bookingDate);
        const month = getMonth(booking.bookingDate);
        const key = `${year}-${month}`;
        if (monthlyRevenue.hasOwnProperty(key)) {
            monthlyRevenue[key] += booking.cost;
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
        .reduce((sum, o) => sum + o.total, 0);

    const totalUsers = users.length;
    const totalVendors = users.filter(u => u.role === 'vendor').length;
    const totalParts = parts.length;

    return {
        totalRevenue,
        totalUsers,
        totalVendors,
        totalParts,
    };
}

export async function getVendorPerformanceSummary() {
    const vendorUsers = users.filter(u => u.role === 'vendor');
    const thirtyDaysAgo = subDays(new Date(), 30);
    const performanceData = [];

    for (const vendor of vendorUsers) {
        const monthlySales = bookings
            .filter(b => b.vendorName === vendor.name && b.status === 'Completed' && b.bookingDate >= thirtyDaysAgo)
            .reduce((sum, b) => sum + b.cost, 0);

        const recentItems = bookings
            .filter(b => b.vendorName === vendor.name && b.status === 'Completed')
            .sort((a,b) => b.bookingDate.getTime() - a.bookingDate.getTime())
            .slice(0, 3)
            .map(b => ({ partName: b.partName.replace('Order: ', ''), cost: b.cost }));
        
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
        const sales = bookings.filter(b => b.partId === part.id && b.status === 'Completed');
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

        const newUsers = users.filter(u => u.createdAt >= dayStart && u.createdAt < dayEnd).length;

        last7DaysData.push({
            name: format(day, 'E'),
            visitors: newUsers,
        });
    }
    
    return last7DaysData;
}


export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }
    
    // Check for dependencies
    const hasOrders = orders.some(o => o.userId === userId);
    const hasParts = parts.some(p => p.vendorAddress === users[userIndex].name);

    if (hasOrders || hasParts) {
        return { success: false, message: "Cannot delete this user as they are associated with existing orders or parts. Please block the user instead." };
    }
    
    users.splice(userIndex, 1);
    revalidatePath('/admin/users');
    return { success: true, message: "User deleted successfully." };
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
        ...interaction,
        id: `ai-${Date.now()}`,
        timestamp: new Date(),
        clicked: false,
        ordered: false,
    };
    aiInteractions.unshift(newInteraction);
    revalidatePath('/admin/ai-analytics');
    return newInteraction;
}

export async function getAiInteractions(): Promise<AiInteraction[]> {
    return aiInteractions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getAiInteractionStats(): Promise<{suggestions: number, clicks: number, orders: number}> {
    return {
        suggestions: aiInteractions.length,
        clicks: aiInteractions.filter(i => i.clicked).length,
        orders: aiInteractions.filter(i => i.ordered).length,
    };
}
