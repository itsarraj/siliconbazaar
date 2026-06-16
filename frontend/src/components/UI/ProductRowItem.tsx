import Button from "@/components/UI/Button";
import { formatInr } from "@/lib/ui";
import { ICartProduct } from "@/types";
import {
  ArrowPathIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

interface ProductRowItemProps {
  product: ICartProduct;
  deleteSingleItem: (product: ICartProduct) => void;
  redirectToProduct: (product: ICartProduct) => void;
  shouldAddRoundedBorders?: boolean;
  showProductStock?: boolean;
  isProductActionOngoing?: boolean;
}

const ProductRowItem = ({
  product,
  deleteSingleItem,
  redirectToProduct,
  shouldAddRoundedBorders,
  showProductStock,
  isProductActionOngoing,
}: ProductRowItemProps) => {
  return (
    <div
      className={`flex w-full items-center justify-between gap-6 border-b border-slate-800 px-6 py-6 ${
        shouldAddRoundedBorders ? "circuit-card mb-4 border" : ""
      }`}
    >
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
          <img
            className="h-24 w-24 flex-shrink-0 rounded-lg object-cover object-center"
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => redirectToProduct(product)}
            className="line-clamp-2 text-left text-xl font-medium text-slate-100 transition-colors hover:text-brand-400"
          >
            {product.name}
          </button>
          <p className="font-semibold text-brand-400">{formatInr(product.price)}</p>
          {showProductStock ? (
            <p className="text-sm text-slate-400">
              {product.qtyInStock || 0} in stock
              {!product.isAvailable && " · Unavailable"}
            </p>
          ) : (
            <p className="text-sm text-slate-400">Qty: {product.qty || 1}</p>
          )}
        </div>
      </div>

      <Button
        variant="transparent"
        disabled={isProductActionOngoing}
        onClick={() => {
          if (!isProductActionOngoing) {
            deleteSingleItem(product);
          }
        }}
      >
        {isProductActionOngoing ? (
          <ArrowPathIcon className="h-5 w-5 flex-shrink-0 animate-spin" />
        ) : showProductStock ? (
          product.isAvailable ? (
            <MinusCircleIcon className="h-5 w-5 flex-shrink-0" />
          ) : (
            <span className="flex items-center gap-2">
              Undo
              <PlusCircleIcon className="h-5 w-5 flex-shrink-0" />
            </span>
          )
        ) : (
          <TrashIcon className="h-5 w-5 flex-shrink-0" />
        )}
      </Button>
    </div>
  );
};

export default ProductRowItem;
