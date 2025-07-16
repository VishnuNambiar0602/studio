
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration, UserLogin, Order, Booking } from "./types";
import { addPart as dbAddPart, updatePart as dbUpdatePart, togglePartVisibility as dbTogglePartVisibility, getParts as dbGetParts, getPartById as dbGetPartById, getOrdersByUserId, createBooking, getBookings, updateBookingStatus, getVendorByAddress, getAllUsers } from "./data";
import { addUser, findUserByEmail, findUserByUsername, storeVerificationCode, verifyAndResetPassword } from "./users";

export async function holdPart(partId: string) {
  // In a real app, you'd update the database and send an email.
  // Here, we'll just simulate the action.
  console.log(`Part ${partId} has been put on hold for 12 hours.`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
  
  // This is where you would integrate with an email service
  // like SendGrid, Resend, etc.
  console.log(`Simulating email notification to vendor for part ${partId}.`);
  
  return { success: true, message: "Part has been successfully put on hold for 12 hours." };
}

export async function createPart(part: Omit<Part, 'id' | 'isVisibleForSale'>) {
    const newPartData = {
        id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        ...part,
        isVisibleForSale: true,
    };
    await dbAddPart(newPartData);
    
    // Revalidate paths to show the new part immediately
    revalidatePath("/");
    revalidatePath("/vendor/inventory");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");

    return newPartData;
}

export async function updatePart(partId: string, partData: Part) {
    await dbUpdatePart(partId, partData);

    // Revalidate all relevant paths
    revalidatePath(`/part/${partId}`);
    revalidatePath("/vendor/inventory");
    revalidatePath("/");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
}


export async function togglePartVisibility(partId: string) {
    await dbTogglePartVisibility(partId);

    // Revalidate paths to update visibility immediately
    revalidatePath("/");
    revalidatePath("/vendor/inventory");
    revalidatePath("/new-parts");
    revalidatePath("/used-parts");
    revalidatePath("/oem-parts");
}

export async function getParts() {
    return await dbGetParts();
}

export async function getUsers() {
    return await getAllUsers();
}

export async function getPart(id: string) {
    return await dbGetPartById(id);
}

export async function registerUser(userData: UserRegistration) {
    const { email, username, name } = userData;

    // Check if email is already in use
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
        return { success: false, message: "An account with this email already exists." };
    }

    let finalUsername = username;
    // Generate a username if not provided
    if (!finalUsername) {
        let isUnique = false;
        let attempt = 0;
        let baseUsername = name.replace(/\s+/g, '').toLowerCase();
        
        while(!isUnique) {
            const potentialUsername = attempt === 0 ? baseUsername : `${baseUsername}${Math.floor(Math.random() * 1000)}`;
            const existingUsername = await findUserByUsername(potentialUsername);
            if (!existingUsername) {
                finalUsername = potentialUsername;
                isUnique = true;
            }
            attempt++;
        }
    } else {
        // Check if custom username is already taken
        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return { success: false, message: "This usernametag is already taken. Please choose another." };
        }
    }

    const newUser = await addUser({
        ...userData,
        username: finalUsername!,
        id: `user-${Date.now()}`
    });

    // Simulate sending a welcome email
    console.log(`
      --- SIMULATING WELCOME EMAIL ---
      To: ${newUser.email}
      Subject: Welcome to GulfCarX!
      
      Hi ${newUser.name},
      
      Thanks for registering! Your unique username is: ${newUser.username}
      You can use this to log in to your account.
      
      Best,
      The GulfCarX Team
      ---------------------------------
    `);


    return { success: true, user: newUser, message: "User registered successfully." };
}

export async function loginUser(credentials: UserLogin) {
    const { username, password } = credentials;

    const user = await findUserByUsername(username);

    if (!user) {
        return { success: false, message: "Invalid username or password." };
    }

    // In a real app, you would use a secure password hashing and comparison library like bcrypt.
    const isPasswordCorrect = user.password === password;

    if (!isPasswordCorrect) {
        return { success: false, message: "Invalid username or password." };
    }

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = user;

    return { success: true, user: userWithoutPassword };
}


export async function sendPasswordResetCode(email: string): Promise<{ success: boolean; message: string; code?: string; username?: string; }> {
    const user = await findUserByEmail(email);
    if (!user) {
        return { success: false, message: "No account found with that email address." };
    }

    const code = await storeVerificationCode(email);

    // In a real app, this is where you'd use an email service (e.g., SendGrid, Resend)
    // For now, we return the code to be displayed in a popup for simulation.
    console.log(`
        --- SIMULATING PASSWORD RESET EMAIL ---
        To: ${email}
        Subject: Your Password Reset Code
        
        Your verification code is: ${code}
        It will expire in 10 minutes.

        Your username is: ${user.username}
        
        Best,
        The GulfCarX Team
        ---------------------------------
    `);

    return { success: true, message: "Verification code sent.", code, username: user.username };
}


export async function resetPasswordWithCode(data: { email: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const result = await verifyAndResetPassword(data.email, data.code, data.newPassword);
    return result;
}

export async function getCustomerOrders(userId: string): Promise<Order[]> {
    return getOrdersByUserId(userId);
}

export async function submitBooking(partId: string, partName: string, bookingDate: Date, cost: number) {
    // In a real app, you'd get the logged-in user's ID and name
    const MOCK_USER = { id: 'user-123', name: 'John Doe' };
    
    const newBooking: Omit<Booking, 'id' | 'status'> = {
        partId,
        partName,
        bookingDate,
        userId: MOCK_USER.id,
        userName: MOCK_USER.name,
        cost,
    };
    await createBooking(newBooking);

    revalidatePath('/vendor/tasks');
    return { success: true, message: "Viewing booked successfully!" };
}

export async function getVendorBookings(): Promise<Booking[]> {
    // In a real app, you'd filter bookings by the logged-in vendor's ID
    return getBookings();
}

export async function completeBooking(bookingId: string) {
    await updateBookingStatus(bookingId, 'Completed');
    revalidatePath('/vendor/tasks');
    return { success: true };
}

export async function getVendorMapUrl(vendorAddress: string): Promise<string | null> {
    const vendor = await getVendorByAddress(vendorAddress);
    return vendor?.googleMapsUrl || null;
}
