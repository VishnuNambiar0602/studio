
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, OrderStatus } from "./types";
import { db } from "./db";
import { users as usersSchema, parts as partsSchema, orders as ordersSchema, bookings as bookingsSchema } from "./schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { MOCK_PARTS, MOCK_USERS, MOCK_ORDERS, MOCK_BOOKINGS } from "./mock-data";

const isDbConnected = !!process.env.POSTGRES_URL && !process.env.POSTGRES_URL.includes("your_postgres_url_here");


// --- PART ACTIONS ---

export async function createPart(part: Omit<Part, 'id' | 'isVisibleForSale'>) {
    if (!isDbConnected) {
        console.log("Mock Mode: Pretending to create part:", part.name);
        return;
    }
    const newPartData: Part = {
        id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        ...part,
        isVisibleForSale: true,
    };
    await db.insert(partsSchema).values(newPartData);
    
    revalidatePath("/");
    revalidatePath("/vendor/inventory");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");

    return newPartData;
}

export async function updatePart(partId: string, partData: Part) {
    if (!isDbConnected) {
        console.log("Mock Mode: Pretending to update part:", partId);
        return;
    }
    await db.update(partsSchema).set(partData).where(eq(partsSchema.id, partId));

    revalidatePath(`/part/${partId}`);
    revalidatePath("/vendor/inventory");
    revalidatePath("/");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
}


export async function togglePartVisibility(partId: string) {
    if (!isDbConnected) {
        console.log("Mock Mode: Pretending to toggle visibility for part:", partId);
        return;
    }
    const part = await db.query.parts.findFirst({ where: eq(partsSchema.id, partId), columns: { isVisibleForSale: true } });
    if (!part) return;
    
    await db.update(partsSchema)
        .set({ isVisibleForSale: !part.isVisibleForSale })
        .where(eq(partsSchema.id, partId));

    revalidatePath("/");
    revalidatePath("/vendor/inventory");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
}

export async function getParts(): Promise<Part[]> {
    if (!isDbConnected) {
        return MOCK_PARTS;
    }
    return await db.query.parts.findMany();
}

export async function getPart(id: string): Promise<Part | undefined> {
    if (!isDbConnected) {
        return MOCK_PARTS.find(p => p.id === id);
    }
    return await db.query.parts.findFirst({ where: eq(partsSchema.id, id) });
}


// --- USER ACTIONS ---

export async function getAllUsers(): Promise<PublicUser[]> {
    if (!isDbConnected) {
        return MOCK_USERS.map(({ password, ...publicUser }) => publicUser);
    }
    const users = await db.query.users.findMany();
    return users.map(({ password, verificationCode, verificationCodeExpires, ...publicUser }) => publicUser);
}

export async function registerUser(userData: UserRegistration) {
    if (!isDbConnected) {
        const existingUser = MOCK_USERS.find(u => u.email === userData.email || u.username === userData.username);
        if (existingUser) {
            return { success: false, message: "Email or username already exists in mock data." };
        }
        const newUser: User = { id: `user-${Date.now()}`, ...userData };
        console.log("Mock Mode: Pretending to register user:", newUser.username);
        const { password, ...publicUser } = newUser;
        return { success: true, user: publicUser, message: "Mock user registered successfully." };
    }

    const { email, username } = userData;

    const existingEmail = await db.query.users.findFirst({ where: eq(usersSchema.email, email) });
    if (existingEmail) {
        return { success: false, message: "An account with this email already exists." };
    }

    const existingUsername = await db.query.users.findFirst({ where: eq(usersSchema.username, username) });
    if (existingUsername) {
        return { success: false, message: "This usernametag is already taken. Please choose another." };
    }
    
    const newUserPayload: User = {
        ...userData,
        id: `user-${Date.now()}`,
    };

    const [newUser] = await db.insert(usersSchema).values(newUserPayload).returning();
    
    const { password: _, verificationCode, verificationCodeExpires, ...publicUser } = newUser;

    console.log(`
      --- SIMULATING WELCOME EMAIL ---
      To: ${newUser.email}
      Subject: Welcome to Desert Drive Depot!
      
      Hi ${newUser.name},
      
      Thanks for registering! Your unique usernametag is: ${newUser.username}
      You can use this to log in to your account.
      
      Best,
      The Desert Drive Depot Team
      ---------------------------------
    `);

    return { success: true, user: publicUser, message: "User registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    if (!isDbConnected) {
        const user = MOCK_USERS.find(u => (u.email === credentials.identifier || u.username === credentials.identifier) && u.password === credentials.password);
        if (!user) {
            return { success: false, message: "Invalid credentials in mock data." };
        }
        const { password, ...publicUser } = user;
        return { success: true, user: publicUser };
    }

    const { identifier, password } = credentials;
    const isEmail = z.string().email().safeParse(identifier).success;

    const user = isEmail
        ? await db.query.users.findFirst({ where: eq(usersSchema.email, identifier) })
        : await db.query.users.findFirst({ where: eq(usersSchema.username, identifier) });

    if (!user) {
        return { success: false, message: "Invalid credentials." };
    }

    if (user.password !== password) {
        return { success: false, message: "Invalid credentials." };
    }

    const { password: _, verificationCode, verificationCodeExpires, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
}

export async function sendPasswordResetCode(email: string): Promise<{ success: boolean; message: string; code?: string; username?: string; }> {
    if (!isDbConnected) {
        const user = MOCK_USERS.find(u => u.email === email);
        if (!user) {
            return { success: false, message: "No account found with that email address." };
        }
        console.log(`Mock Mode: Password reset for ${email}. Code: 123456`);
        return { success: true, message: "Verification code sent.", code: "123456", username: user.username };
    }

    const user = await db.query.users.findFirst({ where: eq(usersSchema.email, email) });
    if (!user) {
        return { success: false, message: "No account found with that email address." };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    await db.update(usersSchema)
        .set({ verificationCode: code, verificationCodeExpires: expires })
        .where(eq(usersSchema.email, email));
    
    console.log(`Password reset code for ${email} is ${code}`);

    return { success: true, message: "Verification code sent.", code, username: user.username };
}

export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
     if (!isDbConnected) {
        const user = MOCK_USERS.find(u => u.email === data.email);
        if (!user || data.code !== '123456') {
             return { success: false, message: "Invalid verification code." };
        }
        console.log(`Mock Mode: Password for ${data.email} has been reset.`);
        return { success: true, message: "Password has been reset successfully." };
    }

    const user = await db.query.users.findFirst({ where: eq(usersSchema.email, data.email) });
    if (!user) {
        return { success: false, message: "Invalid request." };
    }

    if (user.verificationCode !== data.code) {
        return { success: false, message: "Invalid verification code." };
    }

    if (!user.verificationCodeExpires || new Date() > user.verificationCodeExpires) {
        return { success: false, message: "Verification code has expired. Please request a new one." };
    }

    await db.update(usersSchema)
        .set({ 
            password: data.newPassword, 
            verificationCode: null, 
            verificationCodeExpires: null 
        })
        .where(eq(usersSchema.email, data.email));

    return { success: true, message: "Password has been reset successfully." };
}


// --- ORDER & BOOKING ACTIONS ---

export async function getCustomerOrders(userId: string): Promise<Order[]> {
    if (!isDbConnected) {
        return MOCK_ORDERS.filter(o => o.userId === userId);
    }
    return await db.query.orders.findMany({ where: eq(ordersSchema.userId, userId) });
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    if (!isDbConnected) {
        console.log(`Mock Mode: Pretending to cancel order ${orderId}`);
        return { success: true, message: 'Order has been cancelled.' };
    }
    try {
        await db.update(ordersSchema)
            .set({ status: 'Cancelled', cancelable: false })
            .where(eq(ordersSchema.id, orderId));
        revalidatePath('/my-orders');
        return { success: true, message: 'Order has been cancelled.' };
    } catch (e) {
        return { success: false, message: 'Could not cancel the order.' };
    }
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number) {
     if (!isDbConnected) {
        console.log(`Mock Mode: Pretending to book viewing for ${partName}`);
        return { success: true, message: "Viewing booked successfully!" };
    }
    const MOCK_USER = { id: 'user-123', name: 'John Doe' };
    
    const newBooking = {
        id: `booking-${Date.now()}`,
        partId,
        partName,
        bookingDate,
        userId: MOCK_USER.id,
        userName: MOCK_USER.name,
        cost,
        status: 'Pending' as 'Pending' | 'Completed'
    };

    await db.insert(bookingsSchema).values(newBooking);

    revalidatePath('/vendor/tasks');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(): Promise<Booking[]> {
     if (!isDbConnected) {
        return MOCK_BOOKINGS;
    }
    return db.query.bookings.findMany();
}

export async function completeBooking(bookingId: string) {
    if (!isDbConnected) {
        console.log(`Mock Mode: Pretending to complete booking ${bookingId}`);
        return { success: true };
    }
    await db.update(bookingsSchema)
        .set({ status: 'Completed' })
        .where(eq(bookingsSchema.id, bookingId));
        
    revalidatePath('/vendor/tasks');
    return { success: true };
}
