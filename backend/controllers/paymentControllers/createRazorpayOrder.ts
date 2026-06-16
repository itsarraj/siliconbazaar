import asyncHandler from "express-async-handler";
import { findOrderById, updateOrder } from "../../lib/repositories.js";
import { getRazorpayClient, isRazorpayConfigured } from "../../util/razorpay.js";

const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    res.status(503);
    throw new Error("Razorpay is not configured on this server");
  }

  const { orderId } = req.body as { orderId?: string };

  if (!orderId) {
    res.status(400);
    throw new Error("Order ID is required");
  }

  const order = await findOrderById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order unavailable");
  }

  if (order.isPaymentDone) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  if (order.userId !== req.user?.id) {
    res.status(403);
    throw new Error("Not authorized to pay for this order");
  }

  const amountInPaise = Math.round(order.totalPrice * 100);

  const razorpayOrder = await getRazorpayClient().orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: order.id,
    notes: {
      orderId: order.id,
      userId: req.user.id,
    },
  });

  await updateOrder(order.id, { razorpayOrderId: razorpayOrder.id });

  res.status(200).json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

export default createRazorpayOrder;
