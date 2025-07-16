

export type Part = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[]; // Changed from imageUrl to imageUrls
  quantity: number; // Changed from inStock boolean
  vendorAddress: string;
  isVisibleForSale?: boolean;
  category: ('new' | 'used' | 'oem')[];
};

export type FontSize = 'sm' | 'md' | 'lg';
export type Language = 'en' | 'ar';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string; // This is the usernametag
  role: UserRole;
  shopAddress?: string; // For vendors
  zipCode?: string; // For vendors
  // In a real app, you would never store the password in plain text.
  // It would be hashed and salted.
  password?: string; 
  verificationCode?: string;
  verificationCodeExpires?: Date;
}

// A version of the User type that is safe to send to the client
export type PublicUser = Omit<User, 'password' | 'verificationCode' | 'verificationCodeExpires'>;


export type UserRegistration = Omit<User, 'id'>;

export type UserLogin = {
  identifier: string; // Can be email or username
  password?: string;
}


export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  items: Part[];
  total: number;
  status: OrderStatus;
  orderDate: Date;
}

export interface Booking {
  id: string;
  partId: string;
  partName: string;
  userId: string;
  userName: string;
  bookingDate: Date;
  status: 'Pending' | 'Completed';
  cost: number;
}
