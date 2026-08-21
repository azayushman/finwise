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
      size: "500px",
      color: "#00C896",
      opacity: 0.18,
      blur: "90px",
      position: "top: -80px; right: -40px;",
      animationClass: "animate-float",
    },
    {
      size: "420px",
      color: "#2E5F9A",
      opacity: 0.14,
      blur: "110px",
      position: "bottom: -60px; left: -60px;",
      animationClass: "animate-float",
      animationDelay: "2.4s",
    },
    {
      size: "220px",
      color: "#00C896",
      opacity: 0.08,
      blur: "60px",
      position: "top: 40%; left: 45%;",
      animationClass: "animate-float",
      animationDelay: "1.1s",
    },
  ],
  light: [
    {
      size: "480px",
      color: "#00C896",
      opacity: 0.07,
      blur: "100px",
      position: "top: -60px; right: -60px;",
      animationClass: "animate-float",
    },
    {
      size: "360px",
      color: "#2E5F9A",
      opacity: 0.05,
      blur: "80px",
      position: "bottom: -40px; left: -40px;",
      animationClass: "animate-float",
      animationDelay: "2s",
    },
  ],
  "subtle-dark": [
    {
      size: "600px",
      color: "#00C896",
      opacity: 0.10,
      blur: "120px",
      position: "top: 50%; right: -80px; transform: translateY(-50%);",
      animationClass: "",
    },
    {
      size: "500px",
      color: "#1E3A5F",
      opacity: 0.20,
      blur: "100px",
      position: "top: 50%; left: -60px; transform: translateY(-50%);",
      animationClass: "",
    },
  ],
  "subtle-light": [
    {
      size: "500px",
      color: "#00C896",
      opacity: 0.06,
      blur: "100px",
      position: "top: -40px; right: -40px;",
      animationClass: "",
    },
  ],
};

interface AmbientBackgroundProps {
  /**
   * Visual variant — chooses the pre-configured orb layout.
   * - `dark`        : Rich orbs for dark navy hero/CTA sections.
   * - `light`       : Very subtle green/navy orbs for white sections.
   * - `subtle-dark` : Static side-glow for stats/dark sections.
   * - `subtle-light`: Minimal accent for light content sections.
   * Default: "dark".
   */
  variant?: AmbientVariant;
  /** Whether to include the subtle dot-grid overlay. Default: false. */
  showGrid?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Renders layered animated radial-gradient orbs as an absolute-inset
 * background decoration layer.
 *
 * This is a **server component** — zero client JS. All animation is CSS
 * (`animate-float` keyframes). Mount it inside a `position: relative`
 * container and give it `pointer-events-none`.
 *
 * @example
 * <section className="relative overflow-hidden" style={{ background: "#0A1628" }}>
 *   <AmbientBackground variant="dark" showGrid />
 *   <div className="relative z-10">…content…</div>
 * </section>
 */
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
            // Parse inline position styles for each orb
            ...parsePosition(orb.position),
          }}
        />
      ))}

      {/* Optional subtle dot-grid overlay */}
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
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

/**
 * Converts a simple inline CSS string like "top: -80px; right: -40px;"
 * into a React style object.
 */
function parsePosition(pos: string): React.CSSProperties {
  const result: Record<string, string> = {};
  pos.split(";").forEach((rule) => {
    const [prop, val] = rule.split(":").map((s) => s.trim());
    if (prop && val) {
      // Convert kebab-case to camelCase
      const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      result[camel] = val;
    }
  });
  return result as React.CSSProperties;
}
