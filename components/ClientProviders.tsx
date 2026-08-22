"use client";

import { CursorGlow } from "@/components/ui/CursorGlow";

/**
 * Client-side providers / global overlays.
 * Mounted once at the root layout level.
 *
 * Currently wraps:
 *  - CursorGlow (global cursor-following spotlight)
 *
 * This component exists so the root layout can remain a server component
 * while still mounting client-side interactive layers.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CursorGlow />
      {children}
    </>
  );
}
