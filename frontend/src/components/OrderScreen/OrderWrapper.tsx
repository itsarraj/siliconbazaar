import { getUserOrders } from "@/api/order";
import OrderItem from "@/components/OrderScreen/OrderItem";
import { getErrorMessage } from "@/config";
import { IOrder } from "@/types";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OrderWrapper = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["user-orders"],
    queryFn: getUserOrders,
    onError: (queryError) => {
      toast.error(getErrorMessage(queryError, "Error occurred while fetching orders!"));
    },
  });

  const goToPayment = (order: IOrder) => {
    navigate(`/payment/${order._id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
        Could not load your orders. Please try again.
      </p>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-slate-100">No orders yet</h2>
        <p className="mt-2 text-slate-400">Add components to your cart and place your first order.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-100">Your orders</h1>
        <p className="mt-2 text-slate-400">Track payments and order history.</p>
      </div>
      {orders.map((order) => (
        <OrderItem key={order._id} order={order} goToPayment={goToPayment} />
      ))}
    </div>
  );
};

export default OrderWrapper;
