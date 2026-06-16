import { createRazorpayOrder, verifyRazorpayPayment } from '@/api/payment';
import Button from '@/components/UI/Button';
import { selectUser } from '@/features/auth/authSlice';
import { useAppSelector } from '@/hooks';
import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: () => void) => void;
}

interface RazorpayProviderProps {
  orderId: string;
  amount: number;
  onPaymentSuccess: () => Promise<void>;
  onPaymentError: () => Promise<void>;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayProvider = ({
  orderId,
  amount,
  onPaymentSuccess,
  onPaymentError,
}: RazorpayProviderProps) => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setLoading(false);
      await onPaymentError();
      return;
    }

    try {
      const razorpayOrder = await createRazorpayOrder(orderId);

      const options: RazorpayCheckoutOptions = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'SiliconBazaar',
        description: `Order #${orderId.slice(-6)}`,
        order_id: razorpayOrder.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#f59e0b' },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await onPaymentSuccess();
          } catch {
            await onPaymentError();
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: async () => {
            setLoading(false);
            await onPaymentError();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async () => {
        setLoading(false);
        await onPaymentError();
      });
      razorpay.open();
    } catch {
      setLoading(false);
      await onPaymentError();
    }
  };

  return (
    <div className='w-full max-w-sm'>
      <div className='rounded-xl border border-brand-500/30 bg-brand-950/40 p-6'>
        <p className='text-sm text-slate-400 mb-1'>Amount due</p>
        <p className='text-3xl font-bold text-brand-400 mb-6'>
          ₹{amount.toLocaleString('en-IN')}
        </p>
        <Button
          variant="brand"
          loading={loading}
          onClick={handlePayment}
          className="w-full"
        >
          Pay with Razorpay
        </Button>
        <p className='mt-4 text-xs text-slate-500 text-center'>
          Secured by Razorpay · UPI, cards &amp; netbanking
        </p>
      </div>
    </div>
  );
};

export default RazorpayProvider;
