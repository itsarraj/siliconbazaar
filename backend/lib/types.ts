export type AuthProvider = "local" | "google";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string | null;
  googleId: string | null;
  authProvider: AuthProvider;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  image: string;
  price: number;
  qtyInStock: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  isPaymentDone: boolean;
  razorpayOrderId: string | null;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface OrderWithRelations extends Order {
  items: OrderItem[];
  user: { id: string; name: string; email: string };
}

export type SafeUser = Omit<User, "password">;
