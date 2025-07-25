// Edited

export type Part = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[]; // Changed from imageUrl to imageUrls
  quantity: number; // Represents available stock
  vendorAddress: string;
  manufacturer: string;
  isVisibleForSale: boolean;
  category: ('new' | 'used' | 'oem')[];
};

export interface CartItem extends Part {
  purchaseQuantity: number; // Quantity user wants to buy
}

export type FontSize = 'sm' | 'md' | 'lg';
export type Language = 'en' | 'ar';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string; // This is the usernametag
  role: UserRole;
  createdAt: Date;
  isBlocked: boolean;
  shopAddress?: string | null; // For vendors
  zipCode?: string | null; // For vendors
  profilePictureUrl?: string | null;
  // In a real app, you would never store the password in plain text.
  // It would be hashed and salted.
  password?: string; 
  verificationCode?: string | null;
  verificationCodeExpires?: Date;
}

// A version of the User type that is safe to send to the client
export type PublicUser = Omit<User, 'password' | 'verificationCode' | 'verificationCodeExpires'>;


export type UserRegistration = Omit<User, 'id' | 'createdAt' | 'isBlocked'>;

export type UserLogin = {
  identifier: string; // Can be email or username
  password?: string;
}


export type OrderStatus = 'Placed' | 'Processing' | 'Ready for Pickup' | 'Picked Up' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  orderDate: Date;
  completionDate?: Date;
  cancelable: boolean;
}

export type BookingStatus = 'Pending' | 'Completed' | 'Order Fulfillment';

export interface Booking {
  id: string;
  partId: string;
  partName: string;
  userId: string;
  userName: string;
  bookingDate: Date;
  status: BookingStatus;
  cost: number;
  vendorName: string;
  orderId?: string;
}

export interface CheckoutDetails {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethod: "card" | "cod" | "upi" | "netbanking";
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
}
