
import type { User } from './types';

// This file is now a reference for mock user data structure and can be used for seeding the database.
// The live application will now use the functions in `actions.ts` which query the PostgreSQL database.

export const MOCK_USERS: User[] = [
    {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
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
        shopAddress: '123 Industrial Way, Muscat',
        zipCode: '111',
    },
    {
        id: 'vendor-2',
        name: 'Global Auto Spares',
        email: 'sales@globalauto.com',
        username: 'globalauto',
        role: 'vendor',
        password: 'password123',
        shopAddress: '456 Al-Khaleej St, Salalah',
        zipCode: '211',
    },
];
