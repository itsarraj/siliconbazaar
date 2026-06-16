import asyncHandler from "express-async-handler";
import { findOrdersByUserId } from "../../lib/repositories.js";
import { serializeOrder } from "../../lib/serializers.js";

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await findOrdersByUserId(req.user!.id);
  res.status(200).json(orders.map(serializeOrder));
});

export default getAllOrders;
