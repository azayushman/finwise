import { type ReactNode } from "react";

type BadgeVariant = "green" | "navy" | "amber" | "purple";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const styles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  green:  { bg: "#E8FFF8", color: "#007A5C", border: "#CFFAEE" },
  navy:   { bg: "#EEF5FC", color: "#1E3A5F", border: "#D6E8F7" },
  amber:  { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
  purple: { bg: "#EDE9FE", color: "#5B21B6", border: "#DDD6FE" },
};

export function Badge({ children, variant = "green", className = "" }: BadgeProps) {
  const s = styles[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border ${className}`}
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {children}
    </span>
  );
}
