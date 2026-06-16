import { serverAPI } from '@/config';

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface RazorpayVerifyPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const getRazorpayKey = async () => {
  const response = await serverAPI.get<{ keyId: string }>(`/payment/razorpay/key`);
  return response.data.keyId;
};

export const createRazorpayOrder = async (orderId: string) => {
  const response = await serverAPI.post<RazorpayOrderResponse>(`/payment/razorpay/order`, {
    orderId,
  });
  return response.data;
};

export const verifyRazorpayPayment = async (payload: RazorpayVerifyPayload) => {
  const response = await serverAPI.post(`/payment/razorpay/verify`, payload);
  return response.data;
};
