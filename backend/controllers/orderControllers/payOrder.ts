import asyncHandler from "express-async-handler";
import { findOrderById, updateOrder } from "../../lib/repositories.js";
import { serializeOrder } from "../../lib/serializers.js";

const payOrder = asyncHandler(async (req, res) => {
  const order = await findOrderById(req.params.id);

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

  const updatedOrder = await updateOrder(order.id, { isPaymentDone: true });

  res.status(200).json(serializeOrder(updatedOrder));
});

export default payOrder;
