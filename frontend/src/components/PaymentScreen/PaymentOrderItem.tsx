import { IOrder } from "@/types";
import { cardClass, formatInr } from "@/lib/ui";

interface PaymentOrderItemProps {
  order: IOrder;
}

const PaymentOrderItem = ({ order }: PaymentOrderItemProps) => {
  return (
    <article className={`${cardClass} flex w-full flex-col gap-6`}>
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-100">Order summary</h1>
        <p className="mt-1 text-sm text-slate-500">#{order._id}</p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Items</h3>
        <ul className="divide-y divide-slate-800">
          {order.products.map((prod) => (
            <li
              key={prod._id}
              className="flex flex-wrap items-center justify-between gap-4 py-3"
            >
              <h4 className="font-medium text-slate-200">{prod.name}</h4>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span>{formatInr(prod.price)}</span>
                <span>x {prod.qty}</span>
                <span className="font-medium text-brand-400">
                  {formatInr(prod.qty * prod.price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Total</p>
          <p className="font-display text-2xl font-bold text-brand-400">
            {formatInr(order.totalPrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Payment status</p>
          <p className="font-medium text-slate-200">
            {order.isPaymentDone ? "Paid" : "Pending"}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 text-sm text-slate-400">
        <p>{order.user.name}</p>
        <p>{order.user.email}</p>
      </div>
    </article>
  );
};

export default PaymentOrderItem;
