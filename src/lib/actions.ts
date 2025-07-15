"use server";

import { revalidatePath } from "next/cache";
import type { Part } from "./types";
import { addPart as dbAddPart, togglePartVisibility as dbTogglePartVisibility, getParts as dbGetParts } from "./data";

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