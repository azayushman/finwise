import { type ReactNode } from "react";

type BadgeVariant = "green" | "navy" | "amber" | "purple";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const styles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  green:  { bg: "rgba(109, 93, 251, 0.15)", color: "#C4B5FD", border: "rgba(139, 92, 246, 0.3)" },
  navy:   { bg: "rgba(16, 42, 76, 0.6)", color: "#93C5FD", border: "rgba(59, 130, 246, 0.3)" },
  amber:  { bg: "rgba(245, 158, 11, 0.15)", color: "#FCD34D", border: "rgba(245, 158, 11, 0.3)" },
  purple: { bg: "rgba(139, 92, 246, 0.2)", color: "#DDD6FE", border: "rgba(139, 92, 246, 0.4)" },
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
