
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking, PublicUser, User, OrderStatus } from "./types";
import { MOCK_PARTS, MOCK_USERS, MOCK_ORDERS, MOCK_BOOKINGS } from "./mock-data";


// --- PART ACTIONS ---

export async function createPart(part: Omit<Part, 'id' | 'isVisibleForSale'>) {
    console.log("Mock Mode: Creating part:", part.name);
    const newPartData: Part = {
        id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        ...part,
        isVisibleForSale: true,
    };
    MOCK_PARTS.unshift(newPartData); // Add to the beginning of the array
    
    revalidatePath("/");
    revalidatePath("/vendor/inventory");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");

    return newPartData;
}

export async function updatePart(partId: string, partData: Part) {
    console.log("Mock Mode: Updating part:", partId);
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
}


export async function togglePartVisibility(partId: string) {
    console.log("Mock Mode: Toggling visibility for part:", partId);
    const part = MOCK_PARTS.find(p => p.id === partId);
    if (part) {
        part.isVisibleForSale = !part.isVisibleForSale;
    }

    revalidatePath("/");
    revalidatePath("/vendor/inventory");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
}

export async function getParts(): Promise<Part[]> {
    return MOCK_PARTS;
}

export async function getPart(id: string): Promise<Part | undefined> {
    return MOCK_PARTS.find(p => p.id === id);
}


// --- USER ACTIONS ---

export async function getAllUsers(): Promise<PublicUser[]> {
    return MOCK_USERS.map(({ password, ...publicUser }) => publicUser);
}

export async function registerUser(userData: UserRegistration) {
    const existingUser = MOCK_USERS.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
        return { success: false, message: "Email or username already exists in mock data." };
    }
    const newUser: User = { 
        id: `user-${Date.now()}`, 
        ...userData 
    };

    // Add the new user to the mock array
    MOCK_USERS.push(newUser);

    console.log("Mock Mode: Registered user and added to mock array:", newUser.username);
    const { password, ...publicUser } = newUser;
    return { success: true, user: publicUser, message: "Mock user registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    const user = MOCK_USERS.find(u => (u.email === credentials.identifier || u.username === credentials.identifier) && u.password === credentials.password);
    if (!user) {
        return { success: false, message: "Invalid credentials in mock data. Check `mock-data.ts` or register a new account." };
    }
    const { password, ...publicUser } = user;
    return { success: true, user: publicUser };
}

export async function sendPasswordResetCode(email: string): Promise<{ success: boolean; message: string; code?: string; username?: string; }> {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
        return { success: false, message: "No account found with that email address." };
    }
    console.log(`Mock Mode: Password reset for ${email}. Code: 123456`);
    return { success: true, message: "Verification code sent.", code: "123456", username: user.username };
}

export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
   const user = MOCK_USERS.find(u => u.email === data.email);
   if (!user || data.code !== '123456') {
        return { success: false, message: "Invalid verification code." };
   }
   user.password = data.newPassword;
   console.log(`Mock Mode: Password for ${data.email} has been reset.`);
   return { success: true, message: "Password has been reset successfully." };
}


// --- ORDER & BOOKING ACTIONS ---

export async function getCustomerOrders(userId: string): Promise<Order[]> {
    return MOCK_ORDERS.filter(o => o.userId === userId);
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    console.log(`Mock Mode: Cancelling order ${orderId}`);
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (order) {
        order.status = 'Cancelled';
        order.cancelable = false;
        revalidatePath('/my-orders');
        return { success: true, message: 'Order has been cancelled.' };
    }
    return { success: false, message: 'Could not find the order to cancel.' };
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number) {
    console.log(`Mock Mode: Booking viewing for ${partName}`);
    const MOCK_USER = { id: 'user-123', name: 'John Doe' };
    
    const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        partId,
        partName,
        bookingDate,
        userId: MOCK_USER.id,
        userName: MOCK_USER.name,
        cost,
        status: 'Pending'
    };

    MOCK_BOOKINGS.push(newBooking);

    revalidatePath('/vendor/tasks');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(): Promise<Booking[]> {
    return MOCK_BOOKINGS;
}

export async function completeBooking(bookingId: string) {
    console.log(`Mock Mode: Completing booking ${bookingId}`);
    const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'Completed';
    }
    revalidatePath('/vendor/tasks');
    return { success: true };
}
