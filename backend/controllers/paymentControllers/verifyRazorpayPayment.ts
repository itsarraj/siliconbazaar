import asyncHandler from "express-async-handler";
import { findOrderById, updateOrder } from "../../lib/repositories.js";
import { verifyRazorpaySignature } from "../../util/verifyPayment.js";
import { serializeOrder } from "../../lib/serializers.js";

interface VerifyPaymentBody {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    req.body as VerifyPaymentBody;

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400);
    throw new Error("Missing payment verification fields");
  }

  const isValid = verifyRazorpaySignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  if (!isValid) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  const order = await findOrderById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order unavailable");
  }

  if (order.userId !== req.user?.id) {
    res.status(403);
    throw new Error("Not authorized to verify this order");
  }

  if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
    res.status(400);
    throw new Error("Razorpay order mismatch");
  }

  const updatedOrder = await updateOrder(order.id, {
    isPaymentDone: true,
    paymentId: razorpayPaymentId,
    razorpayOrderId,
  });

  res.status(200).json(serializeOrder(updatedOrder));
});

export default verifyRazorpayPayment;
