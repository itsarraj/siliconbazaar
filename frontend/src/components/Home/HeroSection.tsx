import { selectUser } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks";
import { BoltIcon, CpuChipIcon, TruckIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { LinkButton } from "@/components/UI/Button";

const HeroSection = () => {
  const user = useAppSelector(selectUser);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/40 p-8 md:p-12 mb-12">
      <div className="absolute inset-0 bg-circuit-grid bg-grid opacity-40 pointer-events-none" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-circuit-500/10 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-400">
          <BoltIcon className="h-3.5 w-3.5" />
          Now with Razorpay checkout
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          Build smarter with{" "}
          <span className="brand-gradient-text">SiliconBazaar</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-relaxed">
          Premium motherboards, microcontrollers, sensors, and maker essentials —
          curated for hobbyists, students, and engineers across India.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#products"
            className="inline-flex items-center rounded-lg bg-brand-500 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-brand-400"
          >
            Shop components
          </a>
          {user == null ? (
            <LinkButton to="/register" variant="transparent">
              Create account
            </LinkButton>
          ) : (
            <LinkButton to="/orders" variant="transparent">
              View my orders
            </LinkButton>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: CpuChipIcon, label: "500+ components", sub: "Boards, chips & modules" },
          { icon: TruckIcon, label: "Fast dispatch", sub: "Pan-India shipping" },
          { icon: BoltIcon, label: "Secure payments", sub: "UPI, cards & netbanking" },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-4"
          >
            <div className="rounded-lg bg-brand-500/10 p-2">
              <Icon className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">{label}</p>
              <p className="text-sm text-slate-500">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
