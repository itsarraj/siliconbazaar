import { isDevelopment } from "@/lib/utils";
import { getUserFromStorage, clearUserFromStorage } from "@/lib/authStorage";
import axios, { InternalAxiosRequestConfig } from "axios";

const BASE_API_URL = isDevelopment
  ? import.meta.env.VITE_DEVELOPMENT_API
  : import.meta.env.VITE_PRODUCTION_API;

export const serverAPI = axios.create({
  baseURL: BASE_API_URL + "/api",
});

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

const authInterceptor = (req: InternalAxiosRequestConfig) => {
  const user = getUserFromStorage();
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
};

const isAuthEndpoint = (url?: string, method?: string) => {
  if (!url) {
    return false;
  }
  if (url.includes("/users/login")) {
    return true;
  }
  return url === "/users" && method?.toUpperCase() === "POST";
};

serverAPI.interceptors.request.use(authInterceptor);

serverAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isAuthEndpoint(error.config?.url, error.config?.method)
    ) {
      clearUserFromStorage();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (
  error: unknown,
  defaultMessage = "A Unknown Error has occurred!"
) => {
  if (axios.isAxiosError(error)) {
    const errorMessage =
      error?.response?.data?.message || error?.message || defaultMessage;
    return errorMessage;
  } else {
    return defaultMessage;
  }
};
