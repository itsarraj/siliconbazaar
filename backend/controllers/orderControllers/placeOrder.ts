import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { serializeOrder } from "../../lib/serializers.js";

interface OrderProductInput {
  name: string;
  qty: number;
  price: number;
  product: string;
}

const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { products } = req.body as { products?: OrderProductInput[] };

  if (!products || products.length === 0) {
    const message = "Ordered products unavailable";
    res.status(400).json({ message });
    throw new Error(message);
  }

  const productIds = [...new Set(products.map((item) => item.product))];
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds }, isAvailable: true },
  });

  if (dbProducts.length !== productIds.length) {
    const message = "One or more products are unavailable";
    res.status(400).json({ message });
    throw new Error(message);
  }

  const productMap = new Map(dbProducts.map((product) => [product.id, product]));
  const orderItems: Array<{
    productId: string;
    name: string;
    qty: number;
    price: number;
  }> = [];
  let totalPrice = 0;

  for (const item of products) {
    const dbProduct = productMap.get(item.product);
    if (!dbProduct) {
      continue;
    }

    if (item.qty < 1) {
      const message = "Invalid quantity for one or more products";
      res.status(400).json({ message });
      throw new Error(message);
    }

    if (item.qty > dbProduct.qtyInStock) {
      const message = `${dbProduct.name} has insufficient stock`;
      res.status(400).json({ message });
      throw new Error(message);
    }

    const price = Number(dbProduct.price);
    totalPrice += item.qty * price;
    orderItems.push({
      productId: dbProduct.id,
      name: dbProduct.name,
      qty: item.qty,
      price,
    });
  }

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { qtyInStock: { decrement: item.qty } },
      });
    }

    return tx.order.create({
      data: {
        userId,
        totalPrice,
        items: { create: orderItems },
      },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  });

  res.status(201).json(serializeOrder(order));
});

export default placeOrder;
