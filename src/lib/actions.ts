"use server";

import { revalidatePath } from "next/cache";
import type { Part } from "./types";
import { addPart as dbAddPart, togglePartVisibility as dbTogglePartVisibility } from "./data";

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
    const newPart = {
        id: `part-${Date.now()}`,
        ...part,
    };
    dbAddPart(newPart);
    revalidatePath("/");
    revalidatePath("/vendor/inventory");
    return newPart;
}

export async function togglePartVisibility(partId: string) {
    dbTogglePartVisibility(partId);
    revalidatePath("/");
    revalidatePath("/vendor/inventory");
}
