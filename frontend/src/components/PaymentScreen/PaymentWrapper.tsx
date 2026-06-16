import { fetchOrderDetail } from '@/api/order';
import PaymentOrderItem from '@/components/PaymentScreen/PaymentOrderItem';
import RazorpayProvider from '@/components/PaymentScreen/RazorpayProvider';
import { getErrorMessage } from '@/config';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const PaymentWrapper = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const {
    data: order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: [`user-orders-${orderId}`],
    queryFn: async () => {
      if (!orderId) return;
      return await fetchOrderDetail(orderId);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching order details!');
      toast.error(errorMessage);
    },
  });

  const onPaymentSuccess = async () => {
    await new Promise((res) => setTimeout(res, 1500));
    toast.success('Payment successful! Your order is confirmed.');
    queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    navigate('/orders');
  };

  const onPaymentError = async () => {
    queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    toast.error('Payment was cancelled or failed. You can retry from your orders.');
  };

  if (isOrderLoading) {
    return (
      <div className='flex justify-center my-12'>
        <ArrowPathIcon className='h-8 w-8 animate-spin text-brand-400' />
      </div>
    );
  }

  if (orderError) {
    return <Navigate to='/orders' />;
  }

  if ((orderId || '').trim().length === 0 || !order || order.isPaymentDone) {
    return <Navigate to='/orders' />;
  }

  return (
    <div className='flex flex-col gap-12'>
      <div>
        <h1 className='text-2xl font-bold text-slate-100 mb-2'>Checkout</h1>
        <p className='text-slate-400'>Complete your payment securely with Razorpay</p>
      </div>
      <div className='flex flex-col gap-12 md:flex-row items-start md:justify-between'>
        <PaymentOrderItem order={order} />
        <RazorpayProvider
          orderId={orderId!}
          amount={order.totalPrice}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      </div>
    </div>
  );
};

export default PaymentWrapper;
