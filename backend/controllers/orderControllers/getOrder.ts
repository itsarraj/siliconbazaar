import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { serializeOrder } from "../../lib/serializers.js";

const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) {
    const message = "Order unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }

  const isOwner = order.userId === req.user!.id;
  const isAdmin = req.user!.isAdmin;

  if (!isOwner && !isAdmin) {
    const message = "Unauthorized User Access";
    res.status(403).json({ message });
    throw new Error(message);
  }

  res.status(200).json(serializeOrder(order));
});

export default getOrder;
