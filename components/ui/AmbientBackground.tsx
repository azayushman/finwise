import { type ReactNode } from "react";

type AmbientVariant = "dark" | "light" | "subtle-dark" | "subtle-light";

interface OrbConfig {
  size: string;
  color: string;
  opacity: number;
  blur: string;
  position: string;
  animationClass: string;
  animationDelay?: string;
}

const variantOrbs: Record<AmbientVariant, OrbConfig[]> = {
  dark: [
    {
      size: "520px",
      color: "#6D5DFB",
      opacity: 0.16,
      blur: "95px",
      position: "top: -80px; right: -40px;",
      animationClass: "animate-float",
    },
    {
      size: "440px",
      color: "#4F46E5",
      opacity: 0.14,
      blur: "110px",
      position: "bottom: -60px; left: -60px;",
      animationClass: "animate-float",
      animationDelay: "2.4s",
    },
    {
      size: "240px",
      color: "#8B5CF6",
      opacity: 0.09,
      blur: "65px",
      position: "top: 40%; left: 45%;",
      animationClass: "animate-float",
      animationDelay: "1.1s",
    },
  ],
  light: [
    {
      size: "480px",
      color: "#6D5DFB",
      opacity: 0.08,
      blur: "100px",
      position: "top: -60px; right: -60px;",
      animationClass: "animate-float",
    },
    {
      size: "360px",
      color: "#4F46E5",
      opacity: 0.06,
      blur: "80px",
      position: "bottom: -40px; left: -40px;",
      animationClass: "animate-float",
      animationDelay: "2s",
    },
  ],
  "subtle-dark": [
    {
      size: "600px",
      color: "#6D5DFB",
      opacity: 0.10,
      blur: "120px",
      position: "top: 50%; right: -80px; transform: translateY(-50%);",
      animationClass: "",
    },
    {
      size: "500px",
      color: "#102A4C",
      opacity: 0.25,
      blur: "100px",
      position: "top: 50%; left: -60px; transform: translateY(-50%);",
      animationClass: "",
    },
  ],
  "subtle-light": [
    {
      size: "500px",
      color: "#8B5CF6",
      opacity: 0.07,
      blur: "100px",
      position: "top: -40px; right: -40px;",
      animationClass: "",
    },
  ],
};

interface AmbientBackgroundProps {
  variant?: AmbientVariant;
  showGrid?: boolean;
  children?: ReactNode;
  className?: string;
}

export function AmbientBackground({
  variant = "dark",
  showGrid = false,
  children,
  className = "",
}: AmbientBackgroundProps) {
  const orbs = variantOrbs[variant];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Animated radial orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={orb.animationClass}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: `blur(${orb.blur})`,
            opacity: orb.opacity,
            ...(orb.animationDelay ? { animationDelay: orb.animationDelay } : {}),
            ...parsePosition(orb.position),
          }}
        />
      ))}

      {/* Subtle dot-grid overlay */}
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
      )}

      {children}
    </div>
  );
}

function parsePosition(pos: string): React.CSSProperties {
  const result: Record<string, string> = {};
  pos.split(";").forEach((rule) => {
    const [prop, val] = rule.split(":").map((s) => s.trim());
    if (prop && val) {
      const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      result[camel] = val;
    }
  });
  return result as React.CSSProperties;
}
