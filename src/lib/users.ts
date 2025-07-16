
import type { User } from './types';

// This is a mock user database. In a real-world scenario, you would use a proper
// database like Firestore, PostgreSQL, etc. The data is stored in a global variable
// to simulate persistence across requests during a single server session. It will
// reset when the server restarts.

const usersData: User[] = [
    {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@deserdrivedepot.com',
        username: 'admin',
        role: 'admin',
        password: 'password123',
    },
    {
        id: 'vendor-1',
        name: 'AutoParts Inc.',
        email: 'contact@autopartsinc.com',
        username: 'autopartsinc',
        role: 'vendor',
        password: 'password123',
        googleMapsUrl: 'https://maps.app.goo.gl/example1'
    },
    {
        id: 'vendor-2',
        name: 'Global Auto Spares',
        email: 'sales@globalauto.com',
        username: 'globalauto',
        role: 'vendor',
        password: 'password123',
        googleMapsUrl: 'https://maps.app.goo.gl/example2'
    },
    {
        id: 'vendor-3',
        name: 'Desert Off-Road Supply',
        email: 'info@desertoffroad.com',
        username: 'desertoffroad',
        role: 'vendor',
        password: 'password123',
        googleMapsUrl: 'https://maps.app.goo.gl/example3'
    },
];

if (!(global as any).users) {
  (global as any).users = usersData;
}

const db: { users: User[] } = global as any;
export const users: User[] = db.users; // Export for access in other mock data files

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

/**
 * Generates and stores a verification code for a user.
 */
export async function storeVerificationCode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000); // Expires in 10 minutes

    const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
        db.users[userIndex].verificationCode = code;
        db.users[userIndex].verificationCodeExpires = expires;
    }
    await new Promise(resolve => setTimeout(resolve, 150));
    return code;
}

/**
 * Verifies the code and resets the password if valid.
 */
export async function verifyAndResetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
        return { success: false, message: "Invalid request." };
    }

    const user = db.users[userIndex];

    if (user.verificationCode !== code) {
        return { success: false, message: "Invalid verification code." };
    }

    if (!user.verificationCodeExpires || new Date() > user.verificationCodeExpires) {
        return { success: false, message: "Verification code has expired. Please request a new one." };
    }

    // In a real app, hash the new password before saving
    db.users[userIndex].password = newPassword;
    db.users[userIndex].verificationCode = undefined;
    db.users[userIndex].verificationCodeExpires = undefined;

    return { success: true, message: "Password has been reset successfully." };
}
