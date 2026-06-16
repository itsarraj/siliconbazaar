export const inputClass =
  "flex h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50";

export const cardClass =
  "rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm";

export const formatInr = (amount: number) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;
