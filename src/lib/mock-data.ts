// Edited
// This file is now obsolete. Data is managed by a real database via `src/lib/db.ts` and `src/lib/actions.ts`.
// Keeping the file to prevent breaking imports if any, but it should be considered for deletion.
import type { Part, User, Order, Booking } from './types';
export const MOCK_PARTS: Part[] = [];
export const MOCK_USERS: User[] = [];
export const MOCK_ORDERS: Order[] = [];
export const MOCK_BOOKINGS: Booking[] = [];
