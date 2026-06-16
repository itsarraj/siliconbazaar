import { IUser } from "@/types";

export const getUserFromStorage = (): IUser | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "null") {
      return null;
    }

    const user = JSON.parse(raw) as IUser;
    if (!user?._id || !user?.token) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

export const setUserInStorage = (user: IUser | null) => {
  if (!user) {
    localStorage.removeItem("user");
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUserFromStorage = () => {
  localStorage.removeItem("user");
};
