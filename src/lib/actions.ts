
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, CheckoutDetails, CartItem, AiInteraction } from "./types";
import { subMonths, format, getYear, getMonth, subDays, startOfDay } from 'date-fns';
import { config } from 'dotenv';
import twilio from 'twilio';
import { db } from './db';
import { users, parts, orders as ordersTable, bookings, aiInteractions } from './schema';
import { eq, and, desc, sql, gte, lte, gt, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { seed } from './seed';

config();

export async function seedDatabase() {
  await seed();
}

async function sendSms(phone: string, message: string): Promise<{ success: boolean; message?: string }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
        const missingVars = [
            !accountSid && "TWILIO_ACCOUNT_SID",
            !authToken && "TWILIO_AUTH_TOKEN",
            !fromNumber && "TWILIO_PHONE_NUMBER"
        ].filter(Boolean).join(', ');
        
        const errorMsg = `Server configuration error: The following environment variables are not set: ${missingVars}. Please check your .env file.`;
        console.error(errorMsg);
        return { success: false, message: errorMsg };
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
    try {
        const newPart: Omit<Part, 'id'> = {
            ...partData,
            isVisibleForSale: true,
        };

        const [createdPart] = await db.insert(parts).values({
          ...newPart,
          id: `part-${Math.random().toString(36).substr(2, 9)}`,
        }).returning();
        
        revalidatePath('/');
        revalidatePath('/new-parts');
        revalidatePath('/used-parts');
        revalidatePath('/oem-parts');
        revalidatePath('/vendor/inventory');
        revalidatePath('/vendor/dashboard');
        revalidatePath('/vendor/account');
        revalidatePath('/admin');
        revalidatePath('/admin/vendors', 'layout');

        return createdPart;
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
    revalidatePath('/admin');
    revalidatePath('/admin/vendors', 'layout');
}

export async function getParts(): Promise<Part[]> {
    try {
        return await db.select().from(parts);
    } catch (error: any) {
        // If the table doesn't exist, seed the database and try again.
        if (error.message.includes('relation "parts" does not exist')) {
            console.log("Parts table not found, attempting to seed database...");
            await seedDatabase();
            console.log("Database seeding complete, retrying getParts...");
            return await db.select().from(parts);
        }
        // If it's a different error, re-throw it.
        throw error;
    }
}

export async function getPart(id: string): Promise<Part | undefined> {
    const [part] = await db.select().from(parts).where(eq(parts.id, id));
    return part;
}

export async function getPartsByVendor(vendorName: string): Promise<Part[]> {
    return await db.select().from(parts).where(eq(parts.vendorAddress, vendorName));
}

// --- USER ACTIONS ---

export async function getUserById(userId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return null;
    return user;
}

export async function getAllUsers(): Promise<PublicUser[]> {
    return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt,
        isBlocked: users.isBlocked,
        phone: users.phone,
        accountType: users.accountType,
        shopAddress: users.shopAddress,
        zipCode: users.zipCode,
        profilePictureUrl: users.profilePictureUrl
    }).from(users);
}

export async function updateUser(userId: string, data: Partial<Omit<PublicUser, 'profilePictureUrl' | 'username'>>): Promise<{ success: boolean; message: string }> {
    try {
        await db.update(users).set(data).where(eq(users.id, userId));
        revalidatePath('/admin/users');
        revalidatePath(`/admin/vendors/${userId}`);
        return { success: true, message: 'User updated successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Database error: ' + error.message };
    }
}

export async function updateUserProfile(userId: string, data: { name: string; email: string; phone: string; }): Promise<{ success: boolean; message: string; user?: PublicUser; }> {
    try {
        const [updatedUser] = await db.update(users)
          .set(data)
          .where(eq(users.id, userId))
          .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            username: users.username,
            role: users.role,
            createdAt: users.createdAt,
            isBlocked: users.isBlocked,
            phone: users.phone,
            accountType: users.accountType,
            shopAddress: users.shopAddress,
            zipCode: users.zipCode,
            profilePictureUrl: users.profilePictureUrl
          });

        revalidatePath('/settings');
        return { success: true, message: "Profile updated successfully.", user: updatedUser };
    } catch (error: any) {
        return { success: false, message: "Database error: " + error.message };
    }
}

export async function registerUser(userData: UserRegistration): Promise<{ success: boolean, message: string, user?: PublicUser }> {
    try {
        const baseUsername = userData.name.toLowerCase().replace(/\s+/g, '') || 'user';
        const username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;

        const [createdUser] = await db.insert(users).values({
            ...userData,
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            shopAddress: userData.shopAddress || null,
            zipCode: userData.zipCode || null,
            username,
            isBlocked: false,
            createdAt: new Date(),
        }).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            username: users.username,
            role: users.role,
            createdAt: users.createdAt,
            isBlocked: users.isBlocked,
            phone: users.phone,
            accountType: users.accountType,
            shopAddress: users.shopAddress,
            zipCode: users.zipCode,
            profilePictureUrl: users.profilePictureUrl
        });

        if(createdUser.phone) {
          await sendSms(createdUser.phone, `Welcome to GulfCarX, ${createdUser.name}! Your account has been created successfully.`);
        }

        revalidatePath('/admin/users');
        revalidatePath('/admin');
        return { success: true, user: createdUser, message: "User registered successfully." };
    } catch (error: any) {
        if (error.code === '23505') { // Unique constraint violation
            if (error.detail?.includes('email')) {
                 return { success: false, message: "An account with this email address already exists." };
            }
             if (error.detail?.includes('phone')) {
                 return { success: false, message: "An account with this phone number already exists." };
            }
            return { success: false, message: "A user with these details already exists." };
        }
        console.error("Registration error:", error);
        return { success: false, message: `An unexpected server error occurred: ${error.message}` };
    }
}

export async function loginUser(credentials: UserLogin) {
    const identifier = credentials.identifier.toLowerCase();
        
    const [user] = await db.select().from(users).where(sql`lower(${users.email}) = ${identifier} or ${users.phone} = ${credentials.identifier} or lower(${users.username}) = ${identifier}`);

    if (!user) {
        return { success: false, message: "Invalid credentials." };
    }
    
    if (user.password && user.password !== credentials.password) {
       return { success: false, message: "Invalid credentials." };
    }
     if (!user.password && user.role === 'vendor' && user.phone === credentials.identifier) {
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
    
    let [adminUser] = await db.select().from(users).where(and(eq(users.username, 'admin'), eq(users.role, 'admin')));

    if (!adminUser) {
        // Create admin user if it doesn't exist
        const newAdminData: Omit<User, 'id'> = {
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
        [adminUser] = await db.insert(users).values({
          ...newAdminData,
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
        }).returning();
    }

    const { password, ...publicAdminUser } = adminUser;
    return { success: true, user: publicAdminUser };
}

export async function sendPasswordResetCode(identifier: string): Promise<{ success: boolean; message: string; code?: string; }> {
    const [user] = await db.select().from(users).where(sql`lower(${users.email}) = ${identifier.toLowerCase()} or ${users.phone} = ${identifier}`);
    
    if (!user) {
        return { success: false, message: "No account found with that email or phone number." };
    }

    if (!user.phone) {
        return { success: false, message: "No phone number is associated with this account for password reset." };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await db.update(users).set({ verificationCode: code }).where(eq(users.id, user.id));
    
    const smsResult = await sendSms(user.phone, `Your GulfCarX password reset code is: ${code}`);

    if (smsResult.success) {
      return { success: true, message: "Verification code sent.", code: code };
    } else {
      return { success: false, message: smsResult.message || "Failed to send verification code. Please try again later." };
    }
}

export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const [user] = await db.select().from(users).where(eq(users.email, data.email));
    
    if (!user || user.verificationCode !== data.code) {
        return { success: false, message: "Invalid verification code." };
    }
   
    await db.update(users).set({ password: data.newPassword, verificationCode: null }).where(eq(users.id, user.id));

    return { success: true, message: "Password has been reset successfully." };
}

// --- ORDER & BOOKING ACTIONS ---

export async function placeOrder(orderData: { userId: string; items: CartItem[]; total: number; shippingDetails: CheckoutDetails; aiInteractionId?: string }): Promise<{ success: boolean; message: string; orderId?: string; }> {
    try {
        const [newOrder] = await db.insert(ordersTable).values({
            id: `order-${Math.random().toString(36).substr(2, 9)}`,
            userId: orderData.userId,
            items: orderData.items,
            total: orderData.total,
            status: 'Placed',
            orderDate: new Date(),
            cancelable: true,
        }).returning();

        if (orderData.aiInteractionId) {
            await db.update(aiInteractions)
              .set({ ordered: true })
              .where(eq(aiInteractions.id, orderData.aiInteractionId));
        }

        for (const item of orderData.items) {
            await db.update(parts)
              .set({ quantity: sql`${parts.quantity} - ${item.purchaseQuantity}` })
              .where(eq(parts.id, item.id));

            await db.insert(bookings).values({
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
            });
        }
        
        revalidatePath('/my-orders');
        revalidatePath('/vendor/tasks');
        revalidatePath('/admin/ai-analytics');
        
        return { success: true, message: "Order placed successfully!", orderId: newOrder.id };
    } catch(e: any) {
        return { success: false, message: 'Database error: ' + e.message };
    }
}

export async function getCustomerOrders(userId: string): Promise<Order[]> {
    if (!userId) return [];
    return await db.select().from(ordersTable).where(eq(ordersTable.userId, userId)).orderBy(desc(ordersTable.orderDate));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
    return order || null;
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

    if (!order) {
        return { success: false, message: 'Order not found.' };
    }

    // Begin transaction
    await db.transaction(async (tx) => {
        // Update order status
        await tx.update(ordersTable).set({ status: 'Cancelled', cancelable: false }).where(eq(ordersTable.id, orderId));
        
        // Restore inventory for each item in the order
        for (const item of order.items) {
            await tx.update(parts)
              .set({ quantity: sql`${parts.quantity} + ${item.purchaseQuantity}` })
              .where(eq(parts.id, item.id));
        }
        
        // Find and remove associated "Order Fulfillment" booking
        await tx.delete(bookings).where(eq(bookings.orderId, orderId));
    });

    revalidatePath('/my-orders');
    revalidatePath('/vendor/tasks');
    revalidatePath('/vendor/inventory');
    revalidatePath('/');
    return { success: true, message: 'Order has been cancelled and inventory restored.' };
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number, vendorName: string, aiInteractionId?: string) {
    const [mockUser] = await db.select().from(users).where(eq(users.role, 'customer')).limit(1);

    if (!mockUser) {
        return { success: false, message: "No customer user found to create a booking for." };
    }
    
    if (aiInteractionId) {
        await db.update(aiInteractions)
            .set({ clicked: true })
            .where(eq(aiInteractions.id, aiInteractionId));
    }

    await db.insert(bookings).values({
        id: `booking-${Math.random().toString(36).substr(2, 9)}`,
        partId,
        partName,
        bookingDate,
        userId: mockUser.id,
        userName: mockUser.name,
        cost,
        status: 'Pending',
        vendorName: vendorName,
    });

    revalidatePath('/vendor/tasks');
    revalidatePath('/admin/ai-analytics');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(vendorName: string): Promise<Booking[]> {
    if (!vendorName) return [];
    return await db.select().from(bookings).where(eq(bookings.vendorName, vendorName)).orderBy(desc(bookings.bookingDate));
}

export async function completeBooking(bookingId: string) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
    
    if (!booking) {
        return { success: false };
    }

    if (booking.status === 'Order Fulfillment' && booking.orderId) {
        await db.update(ordersTable).set({ status: 'Picked Up', cancelable: false }).where(eq(ordersTable.id, booking.orderId));
    }
    
    await db.update(bookings).set({ status: 'Completed' }).where(eq(bookings.id, bookingId));
    
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

    const stats = await db.select({
        totalRevenue: sql<number>`sum(case when ${bookings.status} = 'Completed' then ${bookings.cost} else 0 end)`.mapWith(Number),
        itemsOnHold: sql<number>`count(case when ${bookings.status} = 'Pending' then 1 end)`.mapWith(Number),
        totalSales: sql<number>`count(case when ${bookings.status} = 'Completed' then 1 end)`.mapWith(Number),
    }).from(bookings).where(eq(bookings.vendorName, vendorName));

    const [listings] = await db.select({
        count: sql<number>`count(*)`
    }).from(parts).where(eq(parts.vendorAddress, vendorName));

    return {
        totalRevenue: stats[0].totalRevenue || 0,
        itemsOnHold: stats[0].itemsOnHold || 0,
        activeListings: Number(listings.count) || 0,
        totalSales: stats[0].totalSales || 0,
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
        const year = getYear(sale.date);
        const month = getMonth(sale.date);
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
    const [revenue] = await db.select({
        total: sql<number>`sum(${ordersTable.total})`
    }).from(ordersTable).where(eq(ordersTable.status, 'Picked Up'));

    const [userCount] = await db.select({count: sql`count(*)`}).from(users);
    const [vendorCount] = await db.select({count: sql`count(*)`}).from(users).where(eq(users.role, 'vendor'));
    const [partCount] = await db.select({count: sql`count(*)`}).from(parts);

    return {
        totalRevenue: Number(revenue?.total) || 0,
        totalUsers: Number(userCount.count) || 0,
        totalVendors: Number(vendorCount.count) || 0,
        totalParts: Number(partCount.count) || 0,
    };
}


export async function getVendorPerformanceSummary() {
    const vendorUsers = await db.select().from(users).where(eq(users.role, 'vendor'));
    const thirtyDaysAgo = subDays(new Date(), 30);
    const performanceData = [];

    for (const vendor of vendorUsers) {
        const [salesData] = await db.select({
            total: sql<number>`sum(${bookings.cost})`
        }).from(bookings).where(and(
            eq(bookings.vendorName, vendor.name),
            eq(bookings.status, 'Completed'),
            gte(bookings.bookingDate, thirtyDaysAgo)
        ));

        const recentItems = await db.select({
            partName: bookings.partName,
            cost: bookings.cost,
        }).from(bookings).where(and(
            eq(bookings.vendorName, vendor.name),
            eq(bookings.status, 'Completed')
        )).orderBy(desc(bookings.bookingDate)).limit(3);
        
        performanceData.push({
            id: vendor.id,
            name: vendor.name,
            monthlySales: Number(salesData?.total) || 0,
            recentItems: recentItems,
        });
    }

    return performanceData;
}


export async function getVendorDetailsForAdmin(vendorId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, vendorId));

    if (!user || user.role !== 'vendor') return null;
    
    const vendorParts = await getPartsByVendor(user.name);
    const stats = await getVendorStats(user.name);
    
    const b = alias(bookings, 'b');
    const partsWithSales = await db.select({
        id: parts.id,
        name: parts.name,
        price: parts.price,
        quantity: parts.quantity,
        isVisibleForSale: parts.isVisibleForSale,
        description: parts.description,
        imageUrls: parts.imageUrls,
        vendorAddress: parts.vendorAddress,
        manufacturer: parts.manufacturer,
        category: parts.category,
        unitsSold: sql<number>`count(${b.id})`.mapWith(Number),
        revenue: sql<number>`sum(${b.cost})`.mapWith(Number),
    })
    .from(parts)
    .leftJoin(b, and(eq(b.partId, parts.id), eq(b.status, 'Completed')))
    .where(eq(parts.vendorAddress, user.name))
    .groupBy(parts.id);


    return { user, parts: partsWithSales, stats };
}

export async function getWeeklyTrafficData(): Promise<{ name: string; visitors: number }[]> {
    const today = new Date();
    const last7DaysData = [];

    for (let i = 6; i >= 0; i--) {
        const day = subDays(today, i);
        const dayStart = startOfDay(day);
        const dayEnd = startOfDay(subDays(today, i - 1));

        const [result] = await db.select({
            count: sql<number>`count(*)`
        }).from(users).where(and(
            gte(users.createdAt, dayStart),
            lt(users.createdAt, dayEnd)
        ));

        last7DaysData.push({
            name: format(day, 'E'),
            visitors: Number(result.count),
        });
    }
    
    return last7DaysData;
}


export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.delete(users).where(eq(users.id, userId));
        revalidatePath('/admin/users');
        return { success: true, message: "User deleted successfully." };
    } catch(e: any) {
         if (e.code === '23503') { // Foreign key violation
            return { success: false, message: "Cannot delete this user as they are associated with existing orders or parts. Please block the user instead." };
        }
        return { success: false, message: "An unexpected database error occurred." };
    }
}

export async function toggleUserBlockStatus(userId: string): Promise<{ success: boolean, message: string }> {
    const [user] = await db.select({isBlocked: users.isBlocked}).from(users).where(eq(users.id, userId));
    
    if(!user) {
        return { success: false, message: "User not found." };
    }

    const newStatus = !user.isBlocked;
    await db.update(users).set({isBlocked: newStatus}).where(eq(users.id, userId));
    
    revalidatePath('/admin/users');
    return { success: true, message: `User has been ${newStatus ? 'blocked' : 'unblocked'}.` };
}

// --- AI INTERACTION ACTIONS ---

export async function logAiInteraction(interaction: Omit<AiInteraction, 'id' | 'timestamp' | 'clicked' | 'ordered'>): Promise<AiInteraction> {
    const [newInteraction] = await db.insert(aiInteractions).values({
        id: `ai-interaction-${Math.random().toString(36).substr(2, 9)}`,
        ...interaction,
        timestamp: new Date(),
        clicked: false,
        ordered: false,
    }).returning();
    revalidatePath('/admin/ai-analytics');
    return newInteraction;
}

export async function getAiInteractions(): Promise<AiInteraction[]> {
    return await db.select().from(aiInteractions).orderBy(desc(aiInteractions.timestamp));
}

export async function getAiInteractionStats(): Promise<{suggestions: number, clicks: number, orders: number}> {
    const stats = await db.select({
        suggestions: sql<number>`count(*)`.mapWith(Number),
        clicks: sql<number>`count(case when ${aiInteractions.clicked} = true then 1 end)`.mapWith(Number),
        orders: sql<number>`count(case when ${aiInteractions.ordered} = true then 1 end)`.mapWith(Number),
    }).from(aiInteractions);

    return stats[0] || { suggestions: 0, clicks: 0, orders: 0 };
}
