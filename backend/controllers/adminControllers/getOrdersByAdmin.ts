import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { serializeOrder } from "../../lib/serializers.js";

const getAllOrdersByAdmin = asyncHandler(async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(orders.map(serializeOrder));
});

export default getAllOrdersByAdmin;
