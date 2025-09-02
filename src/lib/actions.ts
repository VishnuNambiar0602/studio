
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, CheckoutDetails, CartItem, AiInteraction } from "./types";
import { MOCK_PARTS, MOCK_USERS, MOCK_ORDERS, MOCK_BOOKINGS } from "./mock-data";
import { MOCK_AI_INTERACTIONS } from "./mock-ai-data";
import { subMonths, format, getYear, getMonth, subDays, startOfDay } from 'date-fns';
import axios from 'axios';
import { config } from 'dotenv';

config();

async function sendSms(apiKey: string | undefined, phone: string, message: string): Promise<{ success: boolean; message?: string }> {
    if (!apiKey) {
        const simulatedMessage = `SMS simulation (no API key): To: ${phone}, Message: "${message}"`;
        console.log(simulatedMessage);
        // To make the flow testable without an API key, we will treat this as a success.
        // In a real production environment, you might want this to be an error.
        return { success: true };
    }
    
    try {
        const response = await axios.post('https://app.textbee.dev/api/v1/messaging/sms', {
            message: message,
            recipient: phone,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.success) {
            console.log("SMS sent successfully via Textbee:", response.data);
            return { success: true };
        } else {
            // Textbee API returned a non-success response
            const errorMessage = `Textbee API Error: ${JSON.stringify(response.data)}`;
            console.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    } catch (error: any) {
        // Axios or network error
        let detailedError = "An unknown error occurred while sending SMS.";
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          detailedError = `Textbee API Request Failed: ${error.message} - Response: ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
          // The request was made but no response was received
          detailedError = `Textbee API No Response: ${error.message}`;
        } else {
          // Something happened in setting up the request that triggered an Error
          detailedError = `SMS Client Error: ${error.message}`;
        }
        console.error("Detailed SMS Error:", detailedError);
        return { success: false, message: detailedError };
    }
}

// --- PART ACTIONS ---

export async function createPart(part: Omit<Part, 'id' | 'isVisibleForSale'>): Promise<Part | null> {
    try {
        const newPartData: Part = {
            id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            ...part,
            isVisibleForSale: true,
        };
        
        MOCK_PARTS.unshift(newPartData);
        
        revalidatePath('/');
        revalidatePath('/new-parts');
        revalidatePath('/used-parts');
        revalidatePath('/oem-parts');
        revalidatePath('/vendor/inventory');
        revalidatePath('/vendor/dashboard');
        revalidatePath('/vendor/account');
        revalidatePath('/admin');
        revalidatePath('/admin/vendors', 'layout');

        return newPartData;
    } catch (error) {
        console.error("Failed to create part in mock DB:", error);
        return null;
    }
}

export async function updatePart(partId: string, partData: Part) {
    const partIndex = MOCK_PARTS.findIndex(p => p.id === partId);
    if (partIndex !== -1) {
        MOCK_PARTS[partIndex] = partData;
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
    return JSON.parse(JSON.stringify(MOCK_PARTS));
}

export async function getPart(id: string): Promise<Part | undefined> {
    return MOCK_PARTS.find(p => p.id === id);
}

export async function getPartsByVendor(vendorName: string): Promise<Part[]> {
    return MOCK_PARTS.filter(p => p.vendorAddress === vendorName);
}

// --- USER ACTIONS ---

export async function getUserById(userId: string): Promise<User | null> {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
}

export async function getAllUsers(): Promise<PublicUser[]> {
    const users = MOCK_USERS.map(user => {
        const { password, verificationCode, verificationCodeExpires, ...publicUser } = user;
        return publicUser;
    });
    return JSON.parse(JSON.stringify(users));
}

export async function updateUser(userId: string, data: Partial<Omit<PublicUser, 'profilePictureUrl' | 'username'>>): Promise<{ success: boolean; message: string }> {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found.' };
    }

    // Check for email/username collision
    const otherUsers = MOCK_USERS.filter(u => u.id !== userId);
    if (data.email && otherUsers.some(u => u.email === data.email)) {
        return { success: false, message: 'Email is already in use by another account.' };
    }

    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };
    
    revalidatePath('/admin/users');
    revalidatePath(`/admin/vendors/${userId}`);
    return { success: true, message: 'User updated successfully.' };
}

export async function registerUser(userData: UserRegistration) {
    const existingUser = MOCK_USERS.find(
        u => u.email === userData.email || (userData.phone && u.phone === userData.phone)
    );

    if (existingUser) {
        if (existingUser.email === userData.email) {
            return { success: false, message: "A user with this email already exists." };
        }
        if (userData.phone && existingUser.phone === userData.phone) {
            return { success: false, message: "This phone number is already registered." };
        }
    }
    
    const baseUsername = userData.name.toLowerCase().replace(/\s+/g, '') || 'user';
    const username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = { 
        id: `user-${Date.now()}`, 
        createdAt: new Date(),
        isBlocked: false,
        ...userData,
        username: username,
    };

    MOCK_USERS.push(newUser);
    
    const { password, ...createdUser } = newUser;

    // Send welcome SMS
    if(createdUser.phone) {
      await sendSms(process.env.TEXTBEE_API_KEY, createdUser.phone, `Welcome to GulfCarX, ${createdUser.name}! Your account has been created successfully.`);
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin');
    return { success: true, user: createdUser, message: "User registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    const identifier = credentials.identifier.toLowerCase();
        
    const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === identifier || 
        u.phone === credentials.identifier // Phone numbers can have '+' and should not be lowercased
    );

    if (!user) {
        return { success: false, message: "Invalid credentials." };
    }
    
    if (user.password && user.password !== credentials.password) {
       return { success: false, message: "Invalid credentials." };
    }
     if (!user.password && user.role === 'vendor' && user.phone === credentials.identifier) {
        // This is a passwordless (OTP-based) vendor login, which we'll simulate as successful for now.
        // In a real app, you'd check an OTP here.
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
        // Create admin user if it doesn't exist
        const newAdminData: User = {
            id: `user-admin-${Date.now()}`,
            name: 'Admin',
            email: 'admin@gulfcarx.com',
            username: 'admin',
            role: 'admin',
            password: 'admin',
            phone: '+1000000000',
            accountType: 'business',
            createdAt: new Date(),
            isBlocked: false,
        };
        MOCK_USERS.push(newAdminData);
        adminUser = newAdminData;
    }

    const { password, ...publicAdminUser } = adminUser;
    return { success: true, user: publicAdminUser };
}

export async function sendPasswordResetCode(identifier: string, isAdminCheck: boolean = false): Promise<{ success: boolean; message: string; email?: string; }> {
    const userIndex = MOCK_USERS.findIndex(u => u.email === identifier || u.phone === identifier);
    if (userIndex === -1) {
        return { success: false, message: "No account found with that email or phone number." };
    }
    const user = MOCK_USERS[userIndex];

    if (isAdminCheck && user.role !== 'admin') {
        return { success: false, message: "This identifier does not belong to an administrator." };
    }

    if (!user.phone) {
        return { success: false, message: "No phone number is associated with this account for password reset." };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    MOCK_USERS[userIndex].verificationCode = code;
    
    // Send the code via SMS
    const smsResult = await sendSms(process.env.TEXTBEE_API_KEY, user.phone, `Your GulfCarX password reset code is: ${code}`);

    if (smsResult.success) {
      return { success: true, message: "Verification code sent.", email: user.email };
    } else {
      return { success: false, message: smsResult.message || "Failed to send verification code. Please try again later." };
    }
}

export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
   const userIndex = MOCK_USERS.findIndex(u => u.email === data.email);
   if (userIndex === -1) {
       return { success: false, message: "Invalid verification code." };
   }
   const user = MOCK_USERS[userIndex];

   if (!user || user.verificationCode !== data.code) {
        return { success: false, message: "Invalid verification code." };
   }
   
   MOCK_USERS[userIndex].password = data.newPassword;
   MOCK_USERS[userIndex].verificationCode = undefined;

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

    MOCK_ORDERS.unshift(newOrder);

    // If an AI interaction led to this order, update the log
    if (orderData.aiInteractionId) {
        const interactionIndex = MOCK_AI_INTERACTIONS.findIndex(i => i.id === orderData.aiInteractionId);
        if (interactionIndex !== -1) {
            MOCK_AI_INTERACTIONS[interactionIndex].ordered = true;
        }
    }

    for (const item of orderData.items) {
        const partIndex = MOCK_PARTS.findIndex(p => p.id === item.id);
        if (partIndex !== -1) {
            const newQuantity = MOCK_PARTS[partIndex].quantity - item.purchaseQuantity;
            MOCK_PARTS[partIndex].quantity = newQuantity;
        }

        const newBookingTask: Booking = {
            id: `booking-task-${item.id}-${Date.now()}`,
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
        MOCK_BOOKINGS.unshift(newBookingTask);
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
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    return order || null;
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        MOCK_ORDERS[orderIndex].status = 'Cancelled';
        MOCK_ORDERS[orderIndex].cancelable = false;
    }
    revalidatePath('/my-orders');
    return { success: true, message: 'Order has been cancelled.' };
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number, vendorName: string, aiInteractionId?: string) {
    const mockUser = MOCK_USERS.find(u => u.role === 'customer');

    if (!mockUser) {
        return { success: false, message: "No customer user found to create a booking for." };
    }
    
    // If an AI interaction led to this booking, update the log
    if (aiInteractionId) {
        const interactionIndex = MOCK_AI_INTERACTIONS.findIndex(i => i.id === aiInteractionId);
        if (interactionIndex !== -1) {
            MOCK_AI_INTERACTIONS[interactionIndex].clicked = true; // A booking counts as a click
        }
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

    MOCK_BOOKINGS.unshift(newBooking);

    revalidatePath('/vendor/tasks');
    revalidatePath('/admin/ai-analytics');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(vendorName: string): Promise<Booking[]> {
    if (!vendorName) return [];
    return MOCK_BOOKINGS.filter(b => b.vendorName === vendorName).sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime());
}

export async function completeBooking(bookingId: string) {
    const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
        return { success: false };
    }

    const booking = MOCK_BOOKINGS[bookingIndex];
    if (booking.status === 'Order Fulfillment' && booking.orderId) {
        const orderIndex = MOCK_ORDERS.findIndex(o => o.id === booking.orderId);
        if (orderIndex !== -1) {
            MOCK_ORDERS[orderIndex].status = 'Picked Up';
            MOCK_ORDERS[orderIndex].cancelable = false;
        }
    }
    
    MOCK_BOOKINGS[bookingIndex].status = 'Completed';
    
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

    const totalRevenue = MOCK_BOOKINGS
        .filter(b => b.vendorName === vendorName && b.status === 'Completed')
        .reduce((sum, b) => sum + b.cost, 0);

    const itemsOnHold = MOCK_BOOKINGS
        .filter(b => b.vendorName === vendorName && b.status === 'Pending')
        .length;

    const activeListings = MOCK_PARTS
        .filter(p => p.vendorAddress === vendorName)
        .length;
        
    const totalSales = MOCK_BOOKINGS
        .filter(b => b.vendorName === vendorName && b.status === 'Completed')
        .length;


    return { totalRevenue, itemsOnHold, activeListings, totalSales };
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
        if (!monthlyRevenue.hasOwnProperty(key)) {
            monthlyRevenue[key] = 0;
            monthLabels.push({ year, month, name: monthName });
        }
    }
    
    for (const sale of sales) {
        const year = getYear(sale.bookingDate);
        const month = getMonth(sale.bookingDate);
        const key = `${year}-${month}`;
        if (monthlyRevenue.hasOwnProperty(key)) {
            monthlyRevenue[key] += sale.cost;
        }
    }

    const chartData = monthLabels.map(label => {
        const key = `${label.year}-${label.month}`;
        return { name: label.name, total: monthlyRevenue[key] || 0 };
    });

    return chartData;
}

// --- ADMIN ACTIONS ---
export async function getAdminDashboardStats() {
    const totalRevenue = MOCK_ORDERS
        .filter(o => o.status === 'Picked Up')
        .reduce((sum, o) => sum + o.total, 0);
    
    const totalUsers = MOCK_USERS.length;
    const totalVendors = MOCK_USERS.filter(u => u.role === 'vendor').length;
    const totalParts = MOCK_PARTS.length;

    return { totalRevenue, totalUsers, totalVendors, totalParts };
}

export async function getVendorPerformanceSummary() {
    const vendorUsers = MOCK_USERS.filter(u => u.role === 'vendor');
    const thirtyDaysAgo = subDays(new Date(), 30);
    const performanceData = [];

    for (const vendor of vendorUsers) {
        const monthlySalesTotal = MOCK_BOOKINGS
            .filter(b => 
                b.vendorName === vendor.name &&
                b.status === 'Completed' &&
                b.bookingDate >= thirtyDaysAgo
            )
            .reduce((sum, b) => sum + b.cost, 0);

        const recentItems = MOCK_BOOKINGS
            .filter(b => b.vendorName === vendor.name && b.status === 'Completed')
            .sort((a,b) => b.bookingDate.getTime() - a.bookingDate.getTime())
            .slice(0, 3)
            .map(b => ({ partName: b.partName, cost: b.cost }));
        
        performanceData.push({
            id: vendor.id,
            name: vendor.name,
            monthlySales: monthlySalesTotal,
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
        const salesForPart = MOCK_BOOKINGS.filter(b => b.partId === part.id && b.status === 'Completed');
        const unitsSold = salesForPart.length;
        const revenue = salesForPart.reduce((sum, b) => sum + b.cost, 0);
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

        const newUsers = MOCK_USERS.filter(u => 
            u.createdAt >= dayStart && u.createdAt < dayEnd
        ).length;

        last7DaysData.push({
            name: format(day, 'E'),
            visitors: newUsers,
        });
    }
    
    return last7DaysData;
}

export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }
    
    const hasDependencies = MOCK_ORDERS.some(o => o.userId === userId) || MOCK_BOOKINGS.some(b => b.userId === userId);
    if (hasDependencies) {
        return { success: false, message: "Cannot delete this user. They are associated with existing orders or parts. Please block the user instead." };
    }

    MOCK_USERS.splice(userIndex, 1);
    revalidatePath('/admin/users');
    return { success: true, message: "User deleted successfully." };
}

export async function toggleUserBlockStatus(userId: string): Promise<{ success: boolean, message: string }> {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "User not found." };
    }
    
    const newStatus = !MOCK_USERS[userIndex].isBlocked;
    MOCK_USERS[userIndex].isBlocked = newStatus;
    
    revalidatePath('/admin/users');
    return { success: true, message: `User has been ${newStatus ? 'blocked' : 'unblocked'}.` };
}

// --- AI INTERACTION ACTIONS ---

export async function logAiInteraction(interaction: Omit<AiInteraction, 'id' | 'timestamp' | 'clicked' | 'ordered'>): Promise<AiInteraction> {
    const newInteraction: AiInteraction = {
        id: `interaction-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date(),
        clicked: false,
        ordered: false,
        ...interaction,
    };
    MOCK_AI_INTERACTIONS.unshift(newInteraction);
    revalidatePath('/admin/ai-analytics');
    return newInteraction;
}

export async function getAiInteractions(): Promise<AiInteraction[]> {
    return JSON.parse(JSON.stringify(MOCK_AI_INTERACTIONS.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())));
}

export async function getAiInteractionStats(): Promise<{suggestions: number, clicks: number, orders: number}> {
    const suggestions = MOCK_AI_INTERACTIONS.length;
    const clicks = MOCK_AI_INTERACTIONS.filter(i => i.clicked).length;
    const orders = MOCK_AI_INTERACTIONS.filter(i => i.ordered).length;
    return { suggestions, clicks, orders };
}
