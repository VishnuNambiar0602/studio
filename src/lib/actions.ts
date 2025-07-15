
"use server";

import { revalidatePath } from "next/cache";
import type { Part, UserRegistration } from "./types";
import { addPart as dbAddPart, togglePartVisibility as dbTogglePartVisibility, getParts as dbGetParts } from "./data";
import { addUser, findUserByEmail, findUserByUsername } from "./users";

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
        id: `part-${Date.now()}`,
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

    return { success: true, user: newUser, message: "User registered successfully." };
}
