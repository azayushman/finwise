import { type ReactNode } from "react";

type CardVariant = "default" | "dark" | "glass" | "highlight";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  hover?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default:   "bg-[#0B1F3A]/80 border border-[#8B5CF6]/20 text-[#F5F7FF] backdrop-blur-md",
  dark:      "bg-[#07111F] border border-[#8B5CF6]/25 text-[#F5F7FF]",
  glass:     "bg-[#0B1F3A]/60 border border-[#8B5CF6]/20 text-[#F5F7FF] backdrop-blur-lg",
  highlight: "bg-[#0B1F3A] border-2 border-[#8B5CF6] shadow-[0_0_20px_rgba(109,93,251,0.25)] text-[#F5F7FF]",
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
        ${hover ? "transition-all duration-250 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#8B5CF6]/40" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
