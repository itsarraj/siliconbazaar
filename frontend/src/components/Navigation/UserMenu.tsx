import UserMenuItem from "@/components/Navigation/UserMenuItem";
import { logOutUser, selectUser } from "@/features/auth/authSlice";
import { clearCart } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  ArrowLeftOnRectangleIcon,
  InboxStackIcon,
  PlusIcon,
  QueueListIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserMenuList from "./UserMenuList";

const UserMenu = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(false);

  if (user == null) {
    return null;
  }

  const nameParts = user.name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0])
    .join("");

  const onToggle = () => setShow((prevShow) => !prevShow);

  const signOut = () => {
    dispatch(clearCart());
    dispatch(logOutUser());
    onToggle();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const onNavigate = (route: string) => {
    navigate(`/${route}`);
    onToggle();
  };

  return (
    <div className="relative z-20 flex items-center justify-center">
      <button
        onClick={onToggle}
        type="button"
        aria-label="Open account menu"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-500/30 bg-brand-500/10 font-semibold text-brand-300 transition-colors hover:border-brand-500/50 hover:bg-brand-500/20"
      >
        {nameParts}
      </button>
      {show && (
        <UserMenuList onToggle={onToggle}>
          <UserMenuItem
            label="Profile"
            icon={<UserCircleIcon className="h-5 w-5 flex-shrink-0" />}
            onClick={() => onNavigate("profile")}
          />
          <UserMenuItem
            label="Orders"
            icon={<QueueListIcon className="h-5 w-5 flex-shrink-0" />}
            onClick={() => onNavigate("orders")}
          />
          {user.isAdmin && (
            <>
              <UserMenuItem
                label="Inventory"
                icon={<InboxStackIcon className="h-5 w-5 flex-shrink-0" />}
                onClick={() => onNavigate("inventory")}
              />
              <UserMenuItem
                label="Add product"
                icon={<PlusIcon className="h-5 w-5 flex-shrink-0" />}
                onClick={() => onNavigate("createproduct")}
              />
            </>
          )}
          <UserMenuItem
            label="Logout"
            icon={<ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />}
            onClick={signOut}
          />
        </UserMenuList>
      )}
    </div>
  );
};

export default UserMenu;
