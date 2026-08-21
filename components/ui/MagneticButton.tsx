"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  /** Extra classes on the magnetic wrapper div. */
  className?: string;
  /**
   * Pull strength — fraction of the distance from center to pull.
   * 0 = no pull, 1 = cursor snaps to edge. Default: 0.28.
   */
  strength?: number;
}

/**
 * Wraps any element (typically a `<Button>`) with a subtle magnetic hover
 * effect: the wrapped element gently follows the cursor when hovered.
 *
 * Uses CSS `transform: translate()` only (compositor layer, no layout).
 * Automatically disabled for reduced-motion users.
 *
 * @example
 * <MagneticButton>
 *   <Button variant="primary" href="/learn">Start Learning</Button>
 * </MagneticButton>
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.28,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;

    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleMouseLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={wrapRef}
      className={`magnetic-btn ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
