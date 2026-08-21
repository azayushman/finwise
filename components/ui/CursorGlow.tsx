"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Global cursor-following ambient spotlight/glow overlay.
 *
 * Renders a fixed, pointer-events-none overlay that tracks the cursor with a
 * soft radial gradient. Automatically disabled when the user prefers reduced
 * motion. Does not store, log, or transmit cursor position data anywhere.
 *
 * Mount once in the root layout. Works on dark AND light sections.
 *
 * @example
 * // app/layout.tsx
 * <CursorGlow />
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rafId = useRef<number>(0);
  // Store latest cursor position between animation frames
  const pos = useRef({ x: -9999, y: -9999 });
  const pending = useRef(false);

  useEffect(() => {
    if (reduced) return;

    const el = glowRef.current;
    if (!el) return;

    // RAF-throttled mousemove: only schedule one rAF per frame
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      if (!pending.current) {
        pending.current = true;
        rafId.current = requestAnimationFrame(() => {
          // Update CSS custom properties — no layout thrash, compositor-only
          el.style.setProperty("--fw-glow-x", `${pos.current.x}px`);
          el.style.setProperty("--fw-glow-y", `${pos.current.y}px`);
          pending.current = false;
        });
      }
    };

    // Hide when cursor leaves the window
    const onLeave = () => {
      el.style.setProperty("--fw-glow-x", "-9999px");
      el.style.setProperty("--fw-glow-y", "-9999px");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [reduced]);

  // Don't render anything for reduced-motion users
  if (reduced) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fw-cursor-glow"
    />
  );
}
