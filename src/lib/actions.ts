
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, CheckoutDetails } from "./types";
import { db } from "./db";
import { bookings, orders, parts, users } from "./schema";
import { eq, and, desc, sql, gte, or } from "drizzle-orm";
import { subMonths, format, getYear, getMonth, subDays } from 'date-fns';


// --- PART ACTIONS ---

export async function createPart(part: Omit<Part, 'id' | 'isVisibleForSale'>): Promise<Part | null> {
    try {
        const newPartData: Part = {
            id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            ...part,
            isVisibleForSale: true,
        };
        
        await db.insert(parts).values(newPartData);
        
        revalidatePath('/');
        revalidatePath('/new-parts');
        revalidatePath('/used-parts');
        revalidatePath('/oem-parts');
        revalidatePath('/vendor/inventory');
        revalidatePath('/vendor/dashboard');
        revalidatePath('/vendor/account');


        return newPartData;
    } catch (error) {
        console.error("Failed to create part in DB:", error);
        return null;
    }
}

export async function updatePart(partId: string, partData: Part) {
    await db.update(parts).set(partData).where(eq(parts.id, partId));

    revalidatePath(`/part/${partId}`);
    revalidatePath("/vendor/inventory");
    revalidatePath("/");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
    revalidatePath('/vendor/dashboard');
    revalidatePath('/vendor/account');
}

export async function getParts(): Promise<Part[]> {
    const allParts = await db.select().from(parts);
    return allParts;
}

export async function getPart(id: string): Promise<Part | undefined> {
    const result = await db.select().from(parts).where(eq(parts.id, id)).limit(1);
    return result[0];
}

export async function getPartsByVendor(vendorName: string): Promise<Part[]> {
    return db.select().from(parts).where(eq(parts.vendorAddress, vendorName));
}

// --- USER ACTIONS ---

export async function getUserById(userId: string): Promise<PublicUser | null> {
    const result = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        role: users.role,
        shopAddress: users.shopAddress,
        zipCode: users.zipCode,
        createdAt: users.createdAt,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!result[0]) {
        return null;
    }
    // In the future, the profilePictureUrl might come from a different source
    return { ...result[0], profilePictureUrl: null };
}

export async function getAllUsers(): Promise<PublicUser[]> {
    const allUsersData = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        role: users.role,
        shopAddress: users.shopAddress,
        zipCode: users.zipCode,
        createdAt: users.createdAt,
    }).from(users);
    
    return allUsersData.map(u => ({...u, profilePictureUrl: null}));
}

export async function updateUser(userId: string, data: Partial<PublicUser>): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(users).set(data).where(eq(users.id, userId));
        revalidatePath('/admin/users');
        revalidatePath(`/admin/vendors/${userId}`);
        return { success: true, message: 'User updated successfully.' };
    } catch (error) {
        console.error("Failed to update user:", error);
        // This could be a more specific error, e.g., if a unique constraint is violated.
        return { success: false, message: 'Failed to update user. The email or username might already be in use.' };
    }
}


export async function registerUser(userData: UserRegistration) {
    const existingUser = await db.select().from(users).where(or(eq(users.email, userData.email), eq(users.username, userData.username)));

    if (existingUser.length > 0) {
        if (existingUser[0].email === userData.email) {
            return { success: false, message: "A user with this email already exists." };
        }
        if (existingUser[0].username === userData.username) {
            return { success: false, message: "This username is already taken." };
        }
    }
    
    const newUserForDb = { 
        id: `user-${Date.now()}`, 
        name: userData.name,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        password: userData.password, // In a real app, this should be hashed
        shopAddress: userData.shopAddress,
        zipCode: userData.zipCode,
        createdAt: new Date(),
    };

    await db.insert(users).values(newUserForDb);
    
    const createdUser: PublicUser = {
        ...newUserForDb,
        profilePictureUrl: null,
    };

    revalidatePath('/admin/users');
    return { success: true, user: createdUser, message: "User registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    const results = await db.select().from(users).where(and(
        or(eq(users.email, credentials.identifier), eq(users.username, credentials.identifier)),
        eq(users.password, credentials.password!)
    )).limit(1);
    
    const user = results[0];

    if (!user) {
        return { success: false, message: "Invalid credentials." };
    }
    
    const publicUser: PublicUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        shopAddress: user.shopAddress,
        zipCode: user.zipCode,
        profilePictureUrl: null,
    }

    return { success: true, user: publicUser };
}


export async function sendPasswordResetCode(email: string, isAdminCheck: boolean = false): Promise<{ success: boolean; message: string; code?: string; username?: string; }> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];
    if (!user) {
        return { success: false, message: "No account found with that email address." };
    }

    if (isAdminCheck && user.role !== 'admin') {
        return { success: false, message: "This email does not belong to an administrator." };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
    await db.update(users).set({ verificationCode: code }).where(eq(users.id, user.id));
    
    // In a real app, you would email this code to the user.
    // For this simulation, we return it.
    return { success: true, message: "Verification code sent.", code: code, username: user.username };
}

export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
   const result = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
   const user = result[0];
   if (!user || user.verificationCode !== data.code) {
        return { success: false, message: "Invalid verification code." };
   }
   
   await db.update(users).set({ password: data.newPassword, verificationCode: null }).where(eq(users.id, user.id));

   return { success: true, message: "Password has been reset successfully." };
}


// --- ORDER & BOOKING ACTIONS ---

export async function placeOrder(orderData: { userId: string; items: Part[]; total: number; shippingDetails: CheckoutDetails }): Promise<{ success: boolean; message: string; orderId?: string; }> {
    const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: orderData.userId,
        items: orderData.items,
        total: orderData.total,
        status: 'Placed',
        orderDate: new Date(),
        cancelable: true,
    };

    await db.insert(orders).values(newOrder);

    for (const item of orderData.items) {
        const partInStock = await getPart(item.id);
        if (partInStock) {
            const newQuantity = partInStock.quantity - 1;
            await db.update(parts).set({ quantity: newQuantity }).where(eq(parts.id, item.id));
        }

        const newBookingTask: Booking = {
            id: `booking-task-${item.id}-${Date.now()}`,
            partId: item.id,
            partName: `Order: ${item.name}`,
            userId: orderData.userId,
            userName: orderData.shippingDetails.name,
            bookingDate: newOrder.orderDate,
            status: 'Order Fulfillment',
            cost: item.price,
            vendorName: item.vendorAddress
        };
        await db.insert(bookings).values(newBookingTask);
    }
    
    revalidatePath('/my-orders');
    revalidatePath('/vendor/tasks');
    
    return { success: true, message: "Order placed successfully!", orderId: newOrder.id };
}


export async function getCustomerOrders(userId: string): Promise<Order[]> {
    if (!userId) return [];
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.orderDate));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
    const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    return result[0] || null;
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    await db.update(orders).set({ status: 'Cancelled', cancelable: false }).where(eq(orders.id, orderId));
    revalidatePath('/my-orders');
    return { success: true, message: 'Order has been cancelled.' };
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number, vendorName: string) {
    // This is a mock: in a real app, you'd get the logged-in user's ID
    const userResult = await db.select({ id: users.id, name: users.name }).from(users).where(eq(users.role, 'customer')).limit(1);
    const mockUser = userResult[0];

    if (!mockUser) {
        return { success: false, message: "No customer user found to create a booking for." };
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

    await db.insert(bookings).values(newBooking);

    revalidatePath('/vendor/tasks');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(vendorName: string): Promise<Booking[]> {
    if (!vendorName) return [];
    return db.select().from(bookings).where(eq(bookings.vendorName, vendorName)).orderBy(desc(bookings.bookingDate));
}

export async function completeBooking(bookingId: string) {
    const result = await db.select({ partId: bookings.partId }).from(bookings).where(eq(bookings.id, bookingId));
    
    if (result.length > 0) {
        const { partId } = result[0];
        // Decrement part quantity
        await db.update(parts).set({
            quantity: sql`${parts.quantity} - 1`
        }).where(eq(parts.id, partId));
    }

    await db.update(bookings).set({ status: 'Completed' }).where(eq(bookings.id, bookingId));
    
    revalidatePath('/vendor/tasks');
    revalidatePath('/vendor/dashboard');
    return { success: true };
}

export async function getVendorStats(vendorName: string) {
    if (!vendorName) {
        return {
            totalRevenue: 0,
            itemsOnHold: 0,
            activeListings: 0,
            totalSales: 0,
        };
    }

    const revenueResult = await db.select({
        total: sql<number>`sum(${bookings.cost})`
    }).from(bookings).where(and(
        eq(bookings.vendorName, vendorName),
        eq(bookings.status, 'Completed')
    ));

    const holdResult = await db.select({
        count: sql<number>`count(*)`
    }).from(bookings).where(and(
        eq(bookings.vendorName, vendorName),
        eq(bookings.status, 'Pending')
    ));
    
    const listingsResult = await db.select({
        count: sql<number>`count(*)`
    }).from(parts).where(eq(parts.vendorAddress, vendorName));

    const salesResult = await db.select({
        count: sql<number>`count(*)`
    }).from(bookings).where(and(
        eq(bookings.vendorName, vendorName),
        eq(bookings.status, 'Completed')
    ));

    return {
        totalRevenue: revenueResult[0]?.total || 0,
        itemsOnHold: holdResult[0]?.count || 0,
        activeListings: listingsResult[0]?.count || 0,
        totalSales: salesResult[0]?.count || 0,
    };
}


export async function getMonthlyRevenue(vendorName: string): Promise<{name: string, total: number}[]> {
    if (!vendorName) return [];

    const twelveMonthsAgo = subMonths(new Date(), 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const sales = await db.select({
        cost: bookings.cost,
        date: bookings.bookingDate,
    }).from(bookings).where(and(
        eq(bookings.vendorName, vendorName),
        eq(bookings.status, 'Completed'),
        gte(bookings.bookingDate, twelveMonthsAgo)
    ));

    // Initialize an object to hold revenue for each of the last 12 months
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
    
    // Aggregate sales data
    for (const sale of sales) {
        const year = getYear(sale.date);
        const month = getMonth(sale.date);
        const key = `${year}-${month}`;
        if (monthlyRevenue.hasOwnProperty(key)) {
            monthlyRevenue[key] += sale.cost;
        }
    }

    // Format for the chart
    const chartData = monthLabels.map(label => {
        const key = `${label.year}-${label.month}`;
        return {
            name: label.name,
            total: monthlyRevenue[key],
        }
    });

    return chartData;
}


// --- ADMIN ACTIONS ---
export async function getAdminDashboardStats() {
    const revenueResult = db.select({
        total: sql<number>`sum(${orders.total})`.mapWith(Number),
    }).from(orders).where(eq(orders.status, 'Picked Up'));

    const usersResult = db.select({
        count: sql<number>`count(*)`.mapWith(Number),
    }).from(users);

    const vendorsResult = db.select({
        count: sql<number>`count(*)`.mapWith(Number),
    }).from(users).where(eq(users.role, 'vendor'));

    const partsResult = db.select({
        count: sql<number>`count(*)`.mapWith(Number),
    }).from(parts);

    const [revenue, userCount, vendorCount, partCount] = await Promise.all([
        revenueResult,
        usersResult,
        vendorsResult,
        partsResult,
    ]);

    return {
        totalRevenue: revenue[0]?.total || 0,
        totalUsers: userCount[0]?.count || 0,
        totalVendors: vendorCount[0]?.count || 0,
        totalParts: partCount[0]?.count || 0,
    };
}


export async function getVendorPerformanceSummary() {
    const vendorUsers = await db.select().from(users).where(eq(users.role, 'vendor'));
    const thirtyDaysAgo = subDays(new Date(), 30);

    const performanceData = [];

    for (const vendor of vendorUsers) {
        const monthlySales = await db
            .select({
                total: sql<number>`sum(${bookings.cost})`.mapWith(Number),
            })
            .from(bookings)
            .where(
                and(
                    eq(bookings.vendorName, vendor.name),
                    eq(bookings.status, 'Completed'),
                    gte(bookings.bookingDate, thirtyDaysAgo)
                )
            );

        const recentItems = await db
            .select({
                partName: bookings.partName,
                cost: bookings.cost,
            })
            .from(bookings)
            .where(
                and(
                    eq(bookings.vendorName, vendor.name),
                    eq(bookings.status, 'Completed')
                )
            )
            .orderBy(desc(bookings.bookingDate))
            .limit(3);
        
        performanceData.push({
            id: vendor.id,
            name: vendor.name,
            monthlySales: monthlySales[0]?.total || 0,
            recentItems: recentItems,
        });
    }

    return performanceData;
}

export async function getVendorDetailsForAdmin(vendorId: string) {
    const user = await getUserById(vendorId);
    if (!user || user.role !== 'vendor') {
        return null;
    }

    const vendorParts = await getPartsByVendor(user.name);
    const stats = await getVendorStats(user.name);

    const partsWithSales = await Promise.all(vendorParts.map(async (part) => {
        const salesData = await db
            .select({
                unitsSold: sql<number>`count(${bookings.id})`.mapWith(Number),
                revenue: sql<number>`sum(${bookings.cost})`.mapWith(Number),
            })
            .from(bookings)
            .where(and(
                eq(bookings.partId, part.id),
                eq(bookings.status, 'Completed')
            ));
        
        return {
            ...part,
            unitsSold: salesData[0]?.unitsSold || 0,
            revenue: salesData[0]?.revenue || 0,
        };
    }));

    return {
        user,
        parts: partsWithSales,
        stats,
    };
}
