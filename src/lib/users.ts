
import type { User } from './types';

// This is a mock user database. In a real-world scenario, you would use a proper
// database like Firestore, PostgreSQL, etc. The data is stored in a global variable
// to simulate persistence across requests during a single server session. It will
// reset when the server restarts.

const usersData: User[] = [];

if (!(global as any).users) {
  (global as any).users = usersData;
}

const db: { users: User[] } = global as any;

/**
 * Simulates adding a new user to the database.
 */
export async function addUser(user: User): Promise<User> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 250));
  db.users.push(user);
  return user;
}

/**
 * Simulates finding a user by their email.
 */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Simulates finding a user by their username.
 */
export async function findUserByUsername(username: string): Promise<User | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return db.users.find((user) => user.username.toLowerCase() === username.toLowerCase());
}
