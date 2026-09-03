import { useSyncExternalStore } from "react";

const getSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerSnapshot = () => false;

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * Returns `true` when the user's OS/browser requests reduced motion.
 * Reactive — updates live if the preference changes.
 * Safe for SSR: defaults to `false` on the server, syncs after hydration.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
