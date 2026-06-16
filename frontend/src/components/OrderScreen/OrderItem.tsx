import Button from '@/components/UI/Button';
import { IOrder } from '@/types';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';

interface IOrderItemProps {
  order: IOrder;
  goToPayment: (order: IOrder) => void;
}

const OrderItem = ({ order, goToPayment }: IOrderItemProps) => {
  return (
    <article className="circuit-card overflow-hidden">
      <div
        className={`flex items-center gap-4 p-6 font-display text-xl font-semibold ${
          order.isPaymentDone
            ? 'bg-green-900/30 text-green-400'
            : 'bg-slate-800/50 text-slate-200'
        }`}
      >
        <span>Order Overview</span>
        {order.isPaymentDone && <CheckBadgeIcon className="h-5 w-5 flex-shrink-0" />}
      </div>

      <div className="flex flex-col gap-3 p-6">
        <p className="text-xs text-slate-500">Order #{order._id}</p>
        <p className="text-lg font-medium text-slate-300">
          Total Items — {order.products.length}
        </p>
        <p className="font-display text-2xl font-bold text-brand-400">
          ₹{Number(order.totalPrice).toLocaleString('en-IN')}
        </p>
        <div className="grid grid-cols-5 gap-3 text-sm text-slate-500">
          {order.products.map((prod, index) => (
            <div key={prod._id} className="col-span-5 grid grid-cols-5 gap-2 border-t border-slate-800 pt-3">
              <span className="col-span-5 font-medium text-slate-400 md:col-span-1">
                Item {index + 1}
              </span>
              <span className="col-span-5 md:col-span-1">{prod.name}</span>
              <span className="col-span-5 md:col-span-1">Qty: {prod.qty}</span>
              <span className="col-span-5 md:col-span-1">₹{prod.price}</span>
              <span className="col-span-5 font-medium text-slate-300 md:col-span-1">
                ₹{(prod.qty * prod.price).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!order.isPaymentDone ? (
        <div className="px-6 pb-6">
          <Button variant="brand" onClick={() => goToPayment(order)}>
            Pay with Razorpay
          </Button>
        </div>
      ) : (
        <div className="border-t border-slate-800 px-6 py-4">
          <div className="text-sm font-medium capitalize text-green-400">Payment Successful</div>
          <span className="text-xs text-slate-500">
            {order.user.name} — {order.user.email}
          </span>
        </div>
      )}
    </article>
  );
};

export default OrderItem;
