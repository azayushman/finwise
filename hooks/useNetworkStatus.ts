/**
 * hooks/useNetworkStatus.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Lightweight hook that tracks the browser's online/offline state.
 *
 * Design choices:
 *  • SSR-safe: `navigator.onLine` is only read on the client. During SSR the
 *    hook returns `true` so the UI renders in the "online" default state with
 *    no hydration mismatch.
 *  • Event-driven only — no polling, zero overhead while stable.
 *  • `justReconnected` flag is `true` for exactly one render cycle after the
 *    browser fires the 'online' event, so consumers can show a transient
 *    "Back online!" toast without managing their own timers.
 */

"use client";

import { useState, useEffect } from "react";

export interface NetworkStatus {
  /** Whether the browser currently reports a network connection. */
  isOnline: boolean;
  /**
   * `true` for the single render that immediately follows a reconnection.
   * After `reconnectToastMs` milliseconds this resets to `false`.
   */
  justReconnected: boolean;
}

const RECONNECT_TOAST_MS = 3000;

export function useNetworkStatus(): NetworkStatus {
  // Default to true — avoids an offline flash on first SSR hydration.
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);

  useEffect(() => {
    // Sync with the real browser value once we are on the client.
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
      setJustReconnected(true);
      const id = setTimeout(() => setJustReconnected(false), RECONNECT_TOAST_MS);
      return () => clearTimeout(id);
    }

    function handleOffline() {
      setIsOnline(false);
      setJustReconnected(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, justReconnected };
}
