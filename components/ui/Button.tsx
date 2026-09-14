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
  primary:   "text-white font-semibold shadow-[0_4px_14px_rgba(109,93,251,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(109,93,251,0.5)] active:translate-y-0",
  secondary: "bg-[#102A4C] text-[#F5F7FF] hover:bg-[#1A365D] border border-[#8B5CF6]/20 font-semibold",
  ghost:     "text-white font-semibold border border-[#8B5CF6]/30 bg-[#0B1F3A]/70 hover:bg-[#6D5DFB]/20 hover:border-[#8B5CF6]/60 shadow-sm",
  navy:      "text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(109,93,251,0.25)] border border-[#8B5CF6]/25",
  outline:   "bg-transparent text-[#F5F7FF] border border-[#8B5CF6]/30 font-semibold hover:border-[#8B5CF6] hover:bg-[#6D5DFB]/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-full",
  md: "px-5 py-2.5 text-sm rounded-full",
  lg: "px-7 py-3.5 text-base rounded-full",
  xl: "px-9 py-4 text-lg rounded-full",
};

function getInlineStyle(variant: ButtonVariant): React.CSSProperties {
  if (variant === "primary") return { background: "linear-gradient(135deg, #6D5DFB 0%, #4F46E5 100%)" };
  if (variant === "navy")    return { background: "linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)" };
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
    "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none";

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
