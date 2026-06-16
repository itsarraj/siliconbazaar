import asyncHandler from "express-async-handler";
import { findAllOrders } from "../../lib/repositories.js";
import { serializeOrder } from "../../lib/serializers.js";

const getAllOrdersByAdmin = asyncHandler(async (_req, res) => {
  const orders = await findAllOrders();
  res.status(200).json(orders.map(serializeOrder));
});

export default getAllOrdersByAdmin;
