import { fetchAllOrders } from "@/api/order";
import { updateUser } from "@/api/users";
import InventoryCard from "@/components/ProfileScreen/InventoryCard";
import OrderRevenueCard from "@/components/ProfileScreen/OrderRevenueCard";
import AddProductCard from "@/components/ProfileScreen/AddProductCard";
import Button from "@/components/UI/Button";
import { getErrorMessage } from "@/config";
import { selectUser, setUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cardClass, inputClass } from "@/lib/ui";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type TProfileDetail = {
  name: string;
  email: string;
  password: string;
};

const ProfileWrapper = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [profileDetail, setProfileDetail] = useState<TProfileDetail>(() => ({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
  }));

  const { mutate: update, isLoading } = useMutation({
    mutationFn: async () =>
      updateUser(
        profileDetail.name,
        profileDetail.email,
        profileDetail.password.trim() || undefined
      ),
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Error occurred while we were trying to update your details!")
      );
    },
    onSuccess: (data) => {
      if (!data || !user) {
        return;
      }
      dispatch(
        setUser({
          user: {
            ...user,
            ...data,
          },
        })
      );
      setProfileDetail((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated successfully");
    },
  });

  const {
    data: allOrderDetails,
    isLoading: areOrderDataLoading,
    error: orderDataError,
  } = useQuery({
    queryKey: ["all-orders"],
    queryFn: () => {
      if (!user?.isAdmin) {
        return [];
      }
      return fetchAllOrders();
    },
    enabled: Boolean(user?.isAdmin),
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      profileDetail.name.trim().length === 0 ||
      profileDetail.email.trim().length === 0
    ) {
      return;
    }
    await update();
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-100">Profile</h1>
        <p className="mt-2 text-slate-400">Manage your account details and admin tools.</p>
      </div>

      <div className="mb-12 flex flex-col items-start gap-12 md:flex-row">
        <form onSubmit={onSubmit} className={`w-full md:w-1/2 ${cardClass} flex flex-col gap-6 p-8`}>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">Full name</label>
            <input
              name="name"
              value={profileDetail.name}
              onChange={(e) =>
                setProfileDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }))
              }
              type="text"
              placeholder="Your name"
              className={inputClass}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">Email address</label>
            <input
              name="email"
              value={profileDetail.email}
              onChange={(e) =>
                setProfileDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }))
              }
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">New password</label>
            <input
              name="password"
              value={profileDetail.password}
              onChange={(e) =>
                setProfileDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }))
              }
              type="password"
              placeholder="Leave blank to keep current password"
              className={inputClass}
            />
          </div>
          <Button
            variant="brand"
            disabled={
              profileDetail.email.trim() === "" || profileDetail.name.trim() === ""
            }
            loading={isLoading}
          >
            Update profile
          </Button>
        </form>

        {user?.isAdmin && (
          <div className="flex w-full flex-col gap-6 md:w-1/2">
            <InventoryCard />
            {areOrderDataLoading ? (
              <ArrowPathIcon className="h-6 w-6 animate-spin text-brand-400" />
            ) : orderDataError ? null : (
              <OrderRevenueCard orders={allOrderDetails || []} />
            )}
          </div>
        )}
      </div>

      {user?.isAdmin && <AddProductCard />}
    </div>
  );
};

export default ProfileWrapper;
