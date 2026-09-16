"use client";

import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

/* ══════════════════════════════════════════════════════════════════════════
   NetworkStatusBanner
   ══════════════════════════════════════════════════════════════════════════
   Renders two separate layers, both position:fixed so they never participate
   in document flow → zero layout shift guaranteed.

   1. Offline banner  — slides down from the top when offline, slides away
                        when online. Uses CSS max-height transition so the
                        browser never needs to repaint the rest of the page.
   2. Back-online toast — appears bottom-right, fades + slides up, then
                          auto-dismisses after the hook's 3 s window.
   ══════════════════════════════════════════════════════════════════════════ */

export function NetworkStatusBanner() {
  const { isOnline, justReconnected } = useNetworkStatus();

  // Track whether the banner has ever been shown (avoids animating on first
  // load when the user is online — we only want motion on state *changes*).
  const [hasGoneOffline, setHasGoneOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) setHasGoneOffline(true);
  }, [isOnline]);

  // Don't render anything at all until a network change has happened.
  // This prevents the fixed layer from blocking pointer events on first load.
  if (!hasGoneOffline && isOnline && !justReconnected) return null;

  return (
    <>
      {/* ── 1. Offline banner ── */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-print="hide"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          // max-height trick: 0 → collapses with no layout shift on siblings
          maxHeight: isOnline ? "0px" : "80px",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: isOnline ? "none" : "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,15,50,0.97) 100%)",
            borderBottom: "1px solid rgba(245,158,11,0.35)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(245,158,11,0.15) inset",
          }}
        >
          {/* Pulsing dot */}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#F59E0B",
              flexShrink: 0,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />

          {/* WiFi-off icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
            <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0122.56 9" />
            <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
            <path d="M8.53 16.11a6 6 0 016.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>

          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#FDE68A",
              letterSpacing: "0.01em",
            }}
          >
            You are currently offline.{" "}
            <span style={{ color: "#FCD34D", fontWeight: 400 }}>
              Local calculations and saved budgets remain fully functional.
            </span>
          </span>
        </div>
      </div>

      {/* ── 2. Back-online toast ── */}
      {justReconnected && (
        <div
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          data-print="hide"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.14) 100%)",
            border: "1px solid rgba(16,185,129,0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(16,185,129,0.1) inset",
            animation: "toastEnter 0.4s cubic-bezier(0.22,1,0.36,1) both, toastFade 0.5s ease 2.5s both",
            pointerEvents: "none",
          }}
        >
          {/* Checkmark */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#6EE7B7",
              whiteSpace: "nowrap",
            }}
          >
            Back online!
          </span>
        </div>
      )}

      {/* Keyframe animations — injected once, cost is negligible */}
      <style>{`
        @keyframes toastEnter {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes toastFade {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </>
  );
}
