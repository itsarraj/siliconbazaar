import express from "express";
import createRazorpayOrder from "../controllers/paymentControllers/createRazorpayOrder.js";
import verifyRazorpayPayment from "../controllers/paymentControllers/verifyRazorpayPayment.js";
import { userAuth } from "../middlewares/auth.js";
import { isRazorpayConfigured } from "../util/razorpay.js";

const Router = express.Router();

Router.route("/razorpay/order").post(userAuth, createRazorpayOrder);
Router.route("/razorpay/verify").post(userAuth, verifyRazorpayPayment);

Router.get("/razorpay/key", (_req, res) => {
  if (!isRazorpayConfigured()) {
    res.status(503).json({ message: "Razorpay is not configured on this server" });
    return;
  }
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

export default Router;
