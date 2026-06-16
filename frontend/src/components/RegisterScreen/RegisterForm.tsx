import { signUp } from "@/api/users";
import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";
import Button from "@/components/UI/Button";
import { getErrorMessage } from "@/config";
import { selectUser, setUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

type TRegisterForm = {
  name: string;
  email: string;
  password: string;
};

const inputClass =
  "flex h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [registerForm, setRegisterForm] = useState<TRegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const { mutate: register, isLoading } = useMutation({
    mutationFn: async () => {
      return await signUp(registerForm.name, registerForm.email, registerForm.password);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(
        error,
        "Error occurred while we were trying to sign you up!"
      );
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      if (!data) return;
      dispatch(setUser({ user: data }));
      navigate("/");
      toast.success("Account created successfully!");
    },
  });

  if (user != null) {
    return <Navigate to={"/"} />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      registerForm.name?.trim().length === 0 ||
      registerForm.email?.trim().length === 0 ||
      registerForm.password?.trim().length === 0
    ) {
      return;
    }
    await register();
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-slate-100">Join SiliconBazaar</h1>
        <p className="mt-2 text-sm text-slate-400">Create your account to start shopping</p>
      </div>

      <GoogleSignInButton />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs uppercase tracking-wider text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Full name</label>
          <input
            name="name"
            value={registerForm.name}
            onChange={(e) =>
              setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            type="password"
            placeholder="Choose a password"
            className={inputClass}
            required
            minLength={6}
          />
        </div>
        <Button variant="brand" loading={isLoading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-400 hover:text-brand-300">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
