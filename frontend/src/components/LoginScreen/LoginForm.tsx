import { signIn } from "@/api/users";
import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";
import Button from "@/components/UI/Button";
import { getErrorMessage } from "@/config";
import { selectUser, setUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

type TLoginForm = {
  email: string;
  password: string;
};

const inputClass =
  "flex h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [loginForm, setLoginForm] = useState<TLoginForm>({
    email: "",
    password: "",
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async () => {
      return await signIn(loginForm.email, loginForm.password);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(
        error,
        "Error occurred while we were trying to log you in!"
      );
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      if (!data) return;
      dispatch(setUser({ user: data }));
      navigate("/");
      toast.success("Welcome back!");
    },
  });

  if (user != null) {
    return <Navigate to={"/"} />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginForm.email?.trim().length === 0 || loginForm.password?.trim().length === 0) {
      return;
    }
    await login();
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-slate-100">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to your SiliconBazaar account</p>
      </div>

      <GoogleSignInButton />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs uppercase tracking-wider text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Email address</label>
          <input
            name="email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Password</label>
          <input
            name="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            type="password"
            placeholder="Your password"
            className={inputClass}
            required
          />
        </div>
        <Button variant="brand" loading={isLoading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link to="/register" className="text-brand-400 hover:text-brand-300">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
