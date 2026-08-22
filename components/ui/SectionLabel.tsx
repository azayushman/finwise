import { type ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div className={`inline-flex items-center gap-2 mb-4 ${className}`}>
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: "#8B5CF6", boxShadow: "0 0 8px rgba(139, 92, 246, 0.6)" }}
        aria-hidden="true"
      />
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#C4B5FD" }}
      >
        {children}
      </span>
    </div>
  );
}
