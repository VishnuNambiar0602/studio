
export type Part = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  vendorAddress: string;
  isVisibleForSale?: boolean;
  category: 'new' | 'used' | 'oem';
};

export type FontSize = 'sm' | 'md' | 'lg';
export type Language = 'en' | 'ar';

export type UserRole = 'customer' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string; // This is the usernametag
  role: UserRole;
  // In a real app, you would never store the password in plain text.
  // It would be hashed and salted.
  password?: string; 
}

export type UserRegistration = Omit<User, 'id'>;

export type UserLogin = Pick<User, 'username' | 'password'>;
