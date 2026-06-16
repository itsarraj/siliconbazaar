import { createOrder } from "@/api/order";
import Button, { LinkButton } from "@/components/UI/Button";
import ProductRowItem from "@/components/UI/ProductRowItem";
import { getErrorMessage } from "@/config";
import { selectUser } from "@/features/auth/authSlice";
import {
  clearCart,
  closeDrawer,
  openDrawer,
  removeFromCart,
  selectCart,
  selectShowDrawer,
} from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { formatInr } from "@/lib/ui";
import { ICartProduct } from "@/types";
import { ForwardIcon, LockClosedIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const showDrawer = useAppSelector(selectShowDrawer);
  const cart = useAppSelector(selectCart);

  useEffect(() => {
    document.body.style.overflow = showDrawer ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDrawer]);

  const total = useMemo(() => {
    if (cart.length === 0) {
      return 0;
    }
    return cart.reduce((acc, curr) => acc + curr.price * (curr.qty || 1), 0);
  }, [cart]);

  const { mutate: placeOrder, isLoading } = useMutation({
    mutationFn: async () => createOrder(cart),
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Error occurred while we were trying to place your order!")
      );
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      dispatch(clearCart());
      onToggle();
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      navigate(`/payment/${data._id}`);
      toast.success("Order placed! Complete payment to confirm.");
    },
  });

  const onToggle = () => {
    dispatch(showDrawer ? closeDrawer() : openDrawer());
  };

  const deleteSingleItem = (product: ICartProduct) => {
    dispatch(removeFromCart({ product }));
  };

  const navigateToProductPage = (product: ICartProduct) => {
    navigate(`/products/${product._id}`);
    onToggle();
  };

  return (
    <>
      {showDrawer && (
        <div onClick={onToggle} className="fixed inset-0 z-10 bg-slate-950/60" />
      )}

      <div
        className={`fixed inset-0 z-20 flex max-h-screen min-h-screen w-full transform flex-col border-l border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 md:inset-y-0 md:left-auto md:right-0 md:w-1/2 md:rounded-l-2xl ${
          showDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h3 className="font-display text-xl font-semibold text-slate-100">
            Cart
            {cart.length > 0 && (
              <span className="ml-2 text-brand-400">({cart.length})</span>
            )}
          </h3>
          <Button variant="transparent" onClick={onToggle}>
            <span className="flex items-center gap-3">
              <XMarkIcon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden md:block">Close</span>
            </span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="px-6 py-12 text-center text-slate-500">
              Your cart is empty. Browse components and add items to checkout.
            </p>
          ) : (
            cart.map((product) => (
              <ProductRowItem
                key={product._id}
                product={product}
                deleteSingleItem={deleteSingleItem}
                redirectToProduct={navigateToProductPage}
              />
            ))
          )}
        </div>

        <div className="border-t border-slate-800 px-6 py-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            {cart.length > 0 ? (
              <Button variant="transparent" onClick={() => dispatch(clearCart())}>
                <span className="flex items-center gap-3">
                  <TrashIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="hidden md:block">Clear cart</span>
                </span>
              </Button>
            ) : (
              <span className="text-sm text-slate-500">No items yet</span>
            )}

            {cart.length > 0 && (
              <span className="font-display text-xl font-bold text-brand-400">
                {formatInr(total)}
              </span>
            )}
          </div>

          {user == null ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton to="/login" variant="brand" className="w-full">
                <span className="flex items-center gap-3">
                  <LockClosedIcon className="h-5 w-5 flex-shrink-0" />
                  Sign in to checkout
                </span>
              </LinkButton>
              <LinkButton to="/register" variant="transparent" className="w-full">
                Create account
              </LinkButton>
            </div>
          ) : (
            <Button
              variant="brand"
              className="w-full"
              disabled={cart.length === 0}
              onClick={() => placeOrder()}
              loading={isLoading}
            >
              <span className="flex items-center gap-3">
                <ForwardIcon className="h-5 w-5 flex-shrink-0" />
                Place order
              </span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
