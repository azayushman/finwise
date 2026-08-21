import { type ReactNode } from "react";

type CardVariant = "default" | "dark" | "glass" | "highlight";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  hover?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default:   "bg-white border border-slate-200",
  dark:      "border border-white/10 text-white",
  glass:     "border border-white/10 text-white glass-card",
  highlight: "bg-white border-2 border-[#00C896]/30 shadow-[0_0_0_4px_rgba(0,200,150,0.06)]",
};

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default:   {},
  dark:      { background: "#122040" },
  glass:     {},
  highlight: {},
};

export function Card({
  children,
  variant = "default",
  className = "",
  hover = true,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl p-6
        ${variantClasses[variant]}
        ${hover ? "transition-all duration-250 hover:-translate-y-1.5 hover:shadow-xl" : ""}
        ${className}
      `}
      style={variantStyles[variant]}
    >
      {children}
    </div>
  );
}
