import GuestNavActions from "@/components/Navigation/GuestNavActions";
import UserNavActions from "@/components/Navigation/UserNavActions";
import { selectUser } from "@/features/auth/authSlice";
import { openDrawer, selectCart } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Link } from "react-router-dom";
import CartButton from "./CartButton";

const Header = () => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(selectCart);
  const dispatch = useAppDispatch();

  return (
    <header className="fixed z-20 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <nav className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/favicon.svg"
            alt="SiliconBazaar"
            className="h-9 w-9 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight brand-gradient-text">
              SiliconBazaar
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest text-slate-500 sm:block">
              Electronics &amp; Maker Gear
            </span>
          </div>
        </Link>

        <ul className="flex items-center justify-end gap-2 text-sm font-medium text-slate-400">
          {user == null && <GuestNavActions />}
          <CartButton cart={cart} openCart={() => dispatch(openDrawer())} />
          {user != null && <UserNavActions />}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
