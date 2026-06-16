import type {
  AuthProvider,
  Order,
  OrderItem,
  Product,
  User,
} from "./types.js";

type DbRow = Record<string, unknown>;

export const mapUser = (row: DbRow): User => ({
  id: row.id as string,
  name: row.name as string,
  email: row.email as string,
  password: (row.password as string | null) ?? null,
  googleId: (row.google_id as string | null) ?? null,
  authProvider: row.auth_provider as AuthProvider,
  isAdmin: row.is_admin as boolean,
  createdAt: row.created_at as Date,
  updatedAt: row.updated_at as Date,
});

export const mapProduct = (row: DbRow): Product => ({
  id: row.id as string,
  userId: row.user_id as string,
  name: row.name as string,
  image: row.image as string,
  price: Number(row.price),
  qtyInStock: row.qty_in_stock as number,
  isAvailable: row.is_available as boolean,
  createdAt: row.created_at as Date,
  updatedAt: row.updated_at as Date,
});

export const mapOrder = (row: DbRow): Order => ({
  id: row.id as string,
  userId: row.user_id as string,
  totalPrice: Number(row.total_price),
  isPaymentDone: row.is_payment_done as boolean,
  razorpayOrderId: (row.razorpay_order_id as string | null) ?? null,
  paymentId: (row.payment_id as string | null) ?? null,
  createdAt: row.created_at as Date,
  updatedAt: row.updated_at as Date,
});

export const mapOrderItem = (row: DbRow): OrderItem => ({
  id: row.id as string,
  orderId: row.order_id as string,
  productId: row.product_id as string,
  name: row.name as string,
  qty: row.qty as number,
  price: Number(row.price),
});
