import { addToCart } from "@/features/cart/cartSlice";
import { useAppDispatch } from "@/hooks";
import { formatInr } from "@/lib/ui";
import { ICartProduct, IProduct } from "@/types";
import {
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import Button from "../UI/Button";
import QuantityChips from "./QuantityChips";

type Props = {
  product: IProduct;
};

const Product = ({ product }: Props) => {
  const [cartProduct, setCartProduct] = useState<ICartProduct>({
    ...product,
    qty: 1,
  });
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const addProductToCart = (item: ICartProduct) => {
    setIsAddedToCart(true);
    dispatch(addToCart({ product: item }));
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="flex flex-col gap-12 md:flex-row">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12">
        <img
          className="h-60 w-60 rounded-xl object-cover object-center"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="font-display text-3xl font-semibold text-slate-100">{product.name}</h3>
        <div className="text-xl font-extralight">
          {product.isAvailable ? (
            <span className="flex items-center gap-3 text-green-400">
              <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0" />
              In stock
            </span>
          ) : (
            <span className="flex items-center gap-3 text-red-400">
              <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
              Sold out
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg text-slate-500 line-through">
            {formatInr(product.price * 1.15)}
          </span>
          <span className="font-display text-5xl font-bold text-brand-400">
            {formatInr(product.price)}
          </span>
        </div>
        <QuantityChips product={cartProduct} onQuantityChange={setCartProduct} />
        <Button
          variant="brand"
          disabled={!product.isAvailable}
          onClick={() => addProductToCart(cartProduct)}
        >
          {isAddedToCart ? (
            <span className="flex items-center gap-3 text-green-400">
              <CheckBadgeIcon className="h-5 w-5 flex-shrink-0" />
              Added to cart
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <ShoppingCartIcon className="h-5 w-5 flex-shrink-0" />
              Add to cart
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Product;
