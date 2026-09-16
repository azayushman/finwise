"use client";

import { useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   ResetConfirmModal
   ══════════════════════════════════════════════════════════════════════════ */

interface ResetConfirmModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the user clicks Cancel or the backdrop / presses Escape */
  onClose: () => void;
  /** Called when the user confirms the destructive action */
  onConfirm: () => void;
}

/**
 * Accessible confirmation dialog for the "Reset App Data" danger action.
 *
 * Accessibility features:
 *  • role="dialog" + aria-modal="true"
 *  • aria-labelledby pointing to the heading
 *  • Focuses the Cancel button on open (safer default for destructive confirm)
 *  • Closes on Escape key
 *  • Backdrop click closes
 *  • Focus is returned to the trigger button on close (caller's responsibility
 *    to manage the trigger ref if needed)
 */
export function ResetConfirmModal({ open, onClose, onConfirm }: ResetConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Focus the cancel button whenever the modal opens */
  useEffect(() => {
    if (open) {
      // rAF ensures the element is visible before focusing
      const id = requestAnimationFrame(() => {
        cancelRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  /* Close on Escape */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      /* Basic focus trap: keep Tab inside the modal */
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      }
    },
    [onClose]
  );

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      aria-hidden="false"
    >
      {/* Panel — stop propagation so clicking inside doesn't close */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
        className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl outline-none animate-in"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,15,60,0.98) 100%)",
          border: "1px solid rgba(239,68,68,0.25)",
          boxShadow: "0 0 60px rgba(239,68,68,0.08), 0 25px 60px rgba(0,0,0,0.6)",
          animation: "modalEnter 0.2s cubic-bezier(0.22,1,0.36,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
          aria-hidden="true"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Heading */}
        <h2
          id="reset-modal-title"
          className="text-xl font-bold text-white text-center mb-2"
        >
          Reset All App Data?
        </h2>

        {/* Body */}
        <p className="text-sm text-slate-300 text-center leading-relaxed mb-2">
          This will permanently wipe all local budgets and savings goals on this device.
        </p>
        <p className="text-xs text-slate-400 text-center leading-relaxed mb-7">
          Your AI chat history and currency preference will also be cleared. This action{" "}
          <strong className="text-rose-400">cannot be undone.</strong>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-200 transition-all duration-200 hover:text-white hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.06)";
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #DC2626, #B91C1C)",
              border: "1px solid rgba(239,68,68,0.4)",
              boxShadow: "0 4px 20px rgba(220,38,38,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 28px rgba(220,38,38,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(220,38,38,0.25)";
            }}
          >
            Yes, Reset Everything
          </button>
        </div>
      </div>

      {/* Keyframe animation injected inline — avoids requiring Tailwind plugin */}
      <style>{`
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px); }
        }
      `}</style>
    </div>
  );
}
