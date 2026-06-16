import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

type Props = {
  variant?: "primary" | "transparent" | "brand";
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "px-4 py-3 font-semibold rounded-lg inline-flex justify-center items-center duration-300 transition-all disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary: "bg-slate-100 text-slate-900 hover:bg-white",
  brand: "bg-brand-500 text-slate-950 hover:bg-brand-400",
  transparent:
    "text-slate-300 border border-slate-700 hover:border-brand-500/50 hover:text-brand-400",
};

const PrimaryButton = ({
  children,
  className = "",
  loading,
  variant: _variant,
  disabled,
  ...rest
}: Props) => (
  <button
    className={`${baseStyles} ${variantClasses.primary} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <ArrowPathIcon className="h-5 w-5 flex-shrink-0 animate-spin" />
    ) : (
      children
    )}
  </button>
);

const BrandButton = ({
  children,
  className = "",
  loading,
  variant: _variant,
  disabled,
  ...rest
}: Props) => (
  <button
    className={`${baseStyles} ${variantClasses.brand} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <ArrowPathIcon className="h-5 w-5 flex-shrink-0 animate-spin" />
    ) : (
      children
    )}
  </button>
);

const TransparentButton = ({
  children,
  className = "",
  loading,
  variant: _variant,
  disabled,
  ...rest
}: Props) => (
  <button
    className={`${baseStyles} ${variantClasses.transparent} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <ArrowPathIcon className="h-5 w-5 flex-shrink-0 animate-spin" />
    ) : (
      children
    )}
  </button>
);

const Button = (props: Props) => {
  const {
    variant: propVariant = "primary",
    loading,
    children,
    className,
    ...rest
  } = props;

  const buttonVariants = {
    primary: PrimaryButton,
    brand: BrandButton,
    transparent: TransparentButton,
  };

  const Component = buttonVariants[propVariant];

  return (
    <Component loading={loading} className={className} {...rest}>
      {children}
    </Component>
  );
};

type LinkButtonProps = {
  to: string;
  variant?: "primary" | "transparent" | "brand";
  children: React.ReactNode;
  className?: string;
};

export const LinkButton = ({
  to,
  variant = "brand",
  children,
  className = "",
}: LinkButtonProps) => (
  <Link
    to={to}
    className={`${baseStyles} ${variantClasses[variant]} ${className}`}
  >
    {children}
  </Link>
);

export default Button;
