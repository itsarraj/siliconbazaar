import { ICartProduct } from "@/types";

interface QuantityChipsProps {
  product: ICartProduct;
  onQuantityChange: (product: ICartProduct) => void;
}

const QuantityChips = ({ product, onQuantityChange }: QuantityChipsProps) => {
  const options = [1, 5, 10].filter((qty) => product.qtyInStock >= qty);

  if (options.length === 0) {
    return <p className="text-sm text-slate-500">Out of stock</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-medium text-slate-400">Quantity</span>
      {options.map((qty) => (
        <button
          key={`${qty}-qty`}
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
            product.qty === qty
              ? "border-brand-500 bg-brand-500/20 text-brand-300"
              : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-brand-500/50"
          }`}
          onClick={() => onQuantityChange({ ...product, qty })}
        >
          {qty}
        </button>
      ))}
    </div>
  );
};

export default QuantityChips;
