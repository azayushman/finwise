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
        style={{ background: "#00C896" }}
        aria-hidden="true"
      />
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#00A87E" }}
      >
        {children}
      </span>
    </div>
  );
}
