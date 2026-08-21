"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealTag = "div" | "section" | "article" | "li" | "header" | "span" | "aside";

interface ScrollRevealProps {
  children: ReactNode;
  /** Extra classes on the reveal wrapper. */
  className?: string;
  /**
   * Delay before the reveal plays, in ms.
   * Use to stagger sibling reveals. Default: 0.
   */
  delay?: number;
  /**
   * Unobserve after first reveal (true) or re-animate on each entry (false).
   * Default: true.
   */
  once?: boolean;
  /**
   * IntersectionObserver visibility threshold [0-1]. Default: 0.12.
   * Lower = triggers earlier as element enters viewport.
   */
  threshold?: number;
  /**
   * Direction of the entry animation. Default: "up".
   * "none" = fade only (no translate).
   */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** HTML tag to render as. Default: "div". */
  as?: RevealTag;
}

/**
 * Wraps children in an element that reveals with a fade + slide animation
 * when it enters the viewport, using IntersectionObserver.
 *
 * - Pure CSS transitions (opacity + transform), no JS animation loop.
 * - Supports stagger via `delay` prop.
 * - Respects `prefers-reduced-motion` (shows content immediately).
 * - Use `as` prop for semantic HTML without extra wrapper divs.
 *
 * @example
 * // Staggered feature cards
 * {features.map((f, i) => (
 *   <ScrollReveal key={f.title} delay={i * 80}>
 *     <FeatureCard {...f} />
 *   </ScrollReveal>
 * ))}
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  once = true,
  threshold = 0.12,
  direction = "up",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion: content is immediately visible, skip all animation
    if (reduced) {
      el.classList.remove("reveal-hidden");
      return;
    }

    // Set the initial hidden state (direction-specific translate)
    const directionClass = `reveal-from-${direction}`;
    el.classList.add("reveal-hidden", directionClass);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay, then trigger
          const timer = setTimeout(() => {
            el.classList.remove("reveal-hidden", directionClass);
            el.classList.add("reveal-visible");
          }, delay);

          if (once) {
            observer.unobserve(el);
            return () => clearTimeout(timer);
          }
        } else if (!once) {
          el.classList.remove("reveal-visible");
          el.classList.add("reveal-hidden", directionClass);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, delay, once, threshold, direction]);

  // Use a cast to satisfy TypeScript — the ref type matches the rendered tag
  const AnyTag = Tag as "div";
  return (
    <AnyTag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </AnyTag>
  );
}
