import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "navy" | "outline";
type ButtonSize    = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   "text-white font-semibold shadow-[0_4px_14px_rgba(0,200,150,0.28)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,200,150,0.38)] active:translate-y-0",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold",
  ghost:     "text-white font-semibold border border-white/25 bg-white/10 hover:bg-white/20 hover:border-white/40",
  navy:      "text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,22,40,0.2)]",
  outline:   "bg-transparent text-slate-700 border border-slate-300 font-semibold hover:border-navy-400 hover:text-navy-800 hover:bg-slate-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-full",
  md: "px-5 py-2.5 text-sm rounded-full",
  lg: "px-7 py-3.5 text-base rounded-full",
  xl: "px-9 py-4 text-lg rounded-full",
};

function getInlineStyle(variant: ButtonVariant): React.CSSProperties {
  if (variant === "primary") return { background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" };
  if (variant === "navy")    return { background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" };
  return {};
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  className = "",
  id,
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00C896] disabled:opacity-50 disabled:pointer-events-none";

  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  const style   = getInlineStyle(variant);

  if (href) {
    return (
      <Link href={href} className={classes} style={style} id={id} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={style}
      id={id}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
