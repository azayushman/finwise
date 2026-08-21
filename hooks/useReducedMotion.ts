import { useEffect, useState } from "react";

/**
 * Returns `true` when the user's OS/browser requests reduced motion.
 * Reactive — updates live if the preference changes.
 * Safe for SSR: defaults to `false` on the server, syncs after hydration.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
