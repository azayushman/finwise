import { useEffect, useRef, useState } from "react";

interface Options {
  /** The final numeric value to count up to. */
  target: number;
  /** Animation duration in ms. Default: 1800. */
  duration?: number;
  /** Decimal places to show. Default: 0. */
  decimals?: number;
  /** String prepended to the value (e.g. "$"). Default: "". */
  prefix?: string;
  /** String appended to the value (e.g. "%", "K+"). Default: "". */
  suffix?: string;
  /** IntersectionObserver threshold. Default: 0.5. */
  threshold?: number;
}

interface AnimatedCounterResult {
  /** Attach this ref to the element that should trigger the animation on visibility. */
  ref: React.RefObject<HTMLElement | null>;
  /** The current formatted string to display. */
  display: string;
}

/**
 * Counts a number up from 0 to `target` once the host element enters the
 * viewport. Uses ease-out-cubic easing for a premium feel.
 *
 * @example
 * const { ref, display } = useAnimatedCounter({ target: 50000, suffix: "+" });
 * return <span ref={ref}>{display}</span>;
 */
export function useAnimatedCounter({
  target,
  duration = 1800,
  decimals = 0,
  prefix = "",
  suffix = "",
  threshold = 0.5,
}: Options): AnimatedCounterResult {
  const fmt = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;

  const [display, setDisplay] = useState(fmt(0));
  const ref = useRef<HTMLElement | null>(null);
  const rafId = useRef<number>(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: skip animation, show final value immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(fmt(target));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        let startTime: number | null = null;

        const step = (ts: number) => {
          if (!startTime) startTime = ts;
          const elapsed = ts - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(fmt(eased * target));
          if (progress < 1) {
            rafId.current = requestAnimationFrame(step);
          } else {
            setDisplay(fmt(target));
          }
        };

        rafId.current = requestAnimationFrame(step);
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, decimals, prefix, suffix, threshold]);

  return { ref, display };
}
