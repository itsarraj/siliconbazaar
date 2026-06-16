import { IOrder } from "@/types";
import { cardClass, formatInr } from "@/lib/ui";

interface OrderRevenueCardProps {
  orders: IOrder[];
}

const OrderRevenueCard = ({ orders }: OrderRevenueCardProps) => {
  if (orders.length === 0) {
    return (
      <div className={`${cardClass} text-slate-400`}>
        No paid orders yet. Revenue stats will appear here.
      </div>
    );
  }

  const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div className={`${cardClass} flex flex-col gap-4`}>
      <div>
        <p className="text-sm uppercase tracking-wider text-slate-500">Total orders</p>
        <p className="font-display text-3xl font-semibold text-slate-100">{orders.length}</p>
      </div>
      <div>
        <p className="text-sm uppercase tracking-wider text-slate-500">Total revenue</p>
        <p className="font-display text-3xl font-semibold text-brand-400">{formatInr(revenue)}</p>
      </div>
    </div>
  );
};

export default OrderRevenueCard;
