
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, CheckoutDetails } from "./types";
import { db } from "./db";
import { bookings, orders, parts, users } from "./schema";
import { eq, and, desc } from "drizzle-orm";


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
}

export async function getParts(): Promise<Part[]> {
    const allParts = await db.select().from(parts);
    return allParts;
}

export async function getPart(id: string): Promise<Part | undefined> {
    const result = await db.select().from(parts).where(eq(parts.id, id)).limit(1);
    return result[0];
}


// --- USER ACTIONS ---

export async function getAllUsers(): Promise<PublicUser[]> {
    const allUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        role: users.role,
        shopAddress: users.shopAddress,
        zipCode: users.zipCode,
    }).from(users);
    return allUsers;
}

export async function registerUser(userData: UserRegistration) {
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email));
    if (existingUser.length > 0) {
        return { success: false, message: "A user with this email already exists." };
    }
    
    const newUser: User = { 
        id: `user-${Date.now()}`, 
        ...userData 
    };

    await db.insert(users).values(newUser);

    const { password, ...publicUser } = newUser;
    return { success: true, user: publicUser, message: "User registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    const result = await db.select().from(users).where(
        and(
            eq(users.email, credentials.identifier),
            eq(users.password, credentials.password!)
        )
    ).limit(1);

    const user = result[0];

    if (!user) {
        return { success: false, message: "Invalid credentials." };
    }
    const { password, ...publicUser } = user;
    return { success: true, user: publicUser };
}

export async function sendPasswordResetCode(email: string): Promise<{ success: boolean; message: string; code?: string; username?: string; }> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];
    if (!user) {
        return { success: false, message: "No account found with that email address." };
    }

    const code = "123456"; // In a real app, generate a secure random code
    await db.update(users).set({ verificationCode: code }).where(eq(users.id, user.id));
    
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
            cost: item.price
        };
        await db.insert(bookings).values(newBookingTask);
    }
    
    revalidatePath('/my-orders');
    revalidatePath('/vendor/tasks');
    
    return { success: true, message: "Order placed successfully!", orderId: newOrder.id };
}


export async function getCustomerOrders(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.orderDate));
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    await db.update(orders).set({ status: 'Cancelled', cancelable: false }).where(eq(orders.id, orderId));
    revalidatePath('/my-orders');
    return { success: true, message: 'Order has been cancelled.' };
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number) {
    // In a real app, you'd get the logged in user's ID.
    // For now, we'll find a seeded customer user to make the booking.
    const userResult = await db.select().from(users).where(eq(users.role, 'customer')).limit(1);
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
        status: 'Pending'
    };

    await db.insert(bookings).values(newBooking);

    revalidatePath('/vendor/tasks');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(): Promise<Booking[]> {
    return db.select().from(bookings).orderBy(desc(bookings.bookingDate));
}

export async function completeBooking(bookingId: string) {
    await db.update(bookings).set({ status: 'Completed' }).where(eq(bookings.id, bookingId));
    revalidatePath('/vendor/tasks');
    return { success: true };
}
