import { selectUser } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const user = useAppSelector(selectUser);
  return user == null ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute;
