import type { OrderWithRelations, Product } from "./types.js";

export const serializeProduct = (product: Product) => ({
  _id: product.id,
  __v: 0,
  name: product.name,
  image: product.image,
  price: product.price,
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
  totalPrice: order.totalPrice,
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
    price: item.price,
    product: item.productId,
    qty: item.qty,
  })),
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});
