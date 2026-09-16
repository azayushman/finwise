"use client";

import dynamic from "next/dynamic";

/**
 * CursorGlow is dynamically imported with ssr:false inside this Client
 * Component. This is the correct pattern per Next.js docs — ssr:false is
 * only valid inside Client Components, not Server Components.
 *
 * The cursor-glow spotlight is a pure progressive enhancement:
 *  • On first server render: nothing is shown (no hydration mismatch).
 *  • After the client JS loads: the overlay appears and starts tracking.
 *  • Reduced-motion users: the component returns null immediately.
 *
 * This keeps CursorGlow out of the initial JS bundle for every route,
 * shaving a small amount off time-to-interactive on slow connections.
 */
const CursorGlow = dynamic(
  () => import("@/components/ui/CursorGlow").then((m) => m.CursorGlow),
  { ssr: false }
);

/**
 * NetworkStatusBanner listens to window online/offline events — client-only.
 * Dynamically imported with ssr:false to avoid hydration mismatches and keep
 * the server render clean.
 */
const NetworkStatusBanner = dynamic(
  () =>
    import("@/components/ui/NetworkStatusBanner").then(
      (m) => m.NetworkStatusBanner
    ),
  { ssr: false }
);

import { CurrencyProvider } from "@/src/contexts/CurrencyContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <CursorGlow />
      <NetworkStatusBanner />
      {children}
    </CurrencyProvider>
  );
}
