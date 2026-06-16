import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { serializeOrder } from "../../lib/serializers.js";

const payOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });

  if (!order) {
    const message = "Order unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }

  if (order.userId !== req.user!.id && !req.user!.isAdmin) {
    const message = "Unauthorized User Access";
    res.status(403).json({ message });
    throw new Error(message);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { isPaymentDone: true },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(200).json(serializeOrder(updatedOrder));
});

export default payOrder;
