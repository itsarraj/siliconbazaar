import type { Order, OrderItem, Product } from "@prisma/client";

type OrderWithRelations = Order & {
  items: OrderItem[];
  user: { id: string; name: string; email: string };
};

export const serializeProduct = (product: Product) => ({
  _id: product.id,
  __v: 0,
  name: product.name,
  image: product.image,
  price: Number(product.price),
  qtyInStock: product.qtyInStock,
  isAvailable: product.isAvailable,
  user: product.userId,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

export const serializeUser = (user: {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
});

export const serializeOrder = (order: OrderWithRelations) => ({
  _id: order.id,
  __v: 0,
  totalPrice: Number(order.totalPrice),
  isPaymentDone: order.isPaymentDone,
  razorpayOrderId: order.razorpayOrderId,
  paymentId: order.paymentId,
  user: {
    _id: order.user.id,
    name: order.user.name,
    email: order.user.email,
  },
  products: order.items.map((item) => ({
    _id: item.id,
    name: item.name,
    price: Number(item.price),
    product: item.productId,
    qty: item.qty,
  })),
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});
