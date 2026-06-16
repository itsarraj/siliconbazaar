import asyncHandler from "express-async-handler";
import { findOrderById } from "../../lib/repositories.js";
import { serializeOrder } from "../../lib/serializers.js";

const getOrder = asyncHandler(async (req, res) => {
  const order = await findOrderById(req.params.id);

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
