"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TiltCardProps {
  children: ReactNode;
  /** Extra classes applied to the tilt wrapper. */
  className?: string;
  /**
   * Maximum tilt angle in degrees. Default: 7.
   * Keep this low (≤10) for subtle, premium feel.
   */
  maxTilt?: number;
  /**
   * Scale applied on hover for a subtle lift. Default: 1.02.
   * Set to 1 to disable scale.
   */
  scale?: number;
}

/**
 * Wraps a card with a subtle 3D perspective tilt that follows the cursor.
 *
 * Uses `transform: perspective() rotateX() rotateY() scale3d()` only
 * (compositor layer, zero layout thrash). The `transformStyle: preserve-3d`
 * lets inner elements participate in the 3D scene.
 *
 * Automatically disabled for reduced-motion users (renders children as-is).
 *
 * @example
 * <TiltCard className="rounded-2xl">
 *   <FeatureCard {...props} />
 * </TiltCard>
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // Normalise cursor position within card to range [-0.5, 0.5]
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    // Positive rotateX tilts top toward viewer when cursor is above center
    const rx = -ny * maxTilt * 2;
    const ry = nx * maxTilt * 2;

    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${scale},${scale},${scale})`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
