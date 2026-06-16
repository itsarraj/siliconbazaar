import Button from "@/components/UI/Button";
import { ICartProduct } from "@/types";
import { ShoppingCartIcon } from "@heroicons/react/20/solid";

interface ICartButtonProps {
  openCart: () => void;
  cart: ICartProduct[];
}

const CartButton = ({ openCart, cart }: ICartButtonProps) => {
  return (
    <Button variant="transparent" onClick={openCart}>
      <span className="flex items-center gap-2">
        <ShoppingCartIcon className="h-5 w-5 flex-shrink-0" />
        <span className="hidden md:block">Cart</span>
        {cart.length > 0 && (
          <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-300">
            {cart.length}
          </span>
        )}
      </span>
    </Button>
  );
};

export default CartButton;
