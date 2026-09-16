"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useCurrency, CurrencyCode } from "@/src/contexts/CurrencyContext";

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/learn",     label: "Learn" },
  { href: "/tools",     label: "Tools" },
  { href: "/quiz",      label: "Quiz" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

// ── Auth button ───────────────────────────────────────────────────────────────
// Defined at module scope so ESLint's react-hooks/static-components rule is
// satisfied: components must not be declared inside other render functions.

interface AuthButtonProps {
  mobile?: boolean;
  authLoading: boolean;
  session: Session | null;
  onLogout: () => void;
}

function AuthButton({ mobile = false, authLoading, session, onLogout }: AuthButtonProps) {
  // While the session check is in-flight render a size-matched skeleton so
  // there is no layout shift or Login↔Logout flicker.
  if (authLoading) {
    return (
      <div
        aria-hidden="true"
        className={
          mobile
            ? "w-full h-12 rounded-xl bg-white/5 animate-pulse"
            : "hidden sm:block w-[76px] h-9 rounded-full bg-white/5 animate-pulse"
        }
      />
    );
  }

  const sharedCls = mobile
    ? "w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white rounded-xl border border-[#8B5CF6]/30 bg-[#6D5DFB]/15"
    : "hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 border border-[#8B5CF6]/30 bg-[#6D5DFB]/15 hover:bg-[#6D5DFB]/25 hover:border-[#8B5CF6]/50 hover:shadow-[0_4px_16px_rgba(109,93,251,0.2)]";

  return session ? (
    <button
      onClick={onLogout}
      className={sharedCls}
      id={mobile ? "mobile-logout-btn" : "navbar-logout-btn"}
    >
      Logout
    </button>
  ) : (
    <Link
      href="/login"
      className={sharedCls}
      id={mobile ? "mobile-login-btn" : "navbar-login-btn"}
    >
      {mobile ? "Login →" : "Login"}
    </Link>
  );
}

function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="relative inline-block">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="appearance-none bg-[#6D5DFB]/15 border border-[#8B5CF6]/30 text-white text-sm font-semibold rounded-full px-4 py-2 pr-8 outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 cursor-pointer transition-all hover:bg-[#6D5DFB]/25"
        aria-label="Select Currency"
      >
        <option value="USD">USD ($)</option>
        <option value="INR">INR (₹)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white opacity-70">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [session, setSession]       = useState<Session | null>(null);
  /**
   * `authLoading` stays `true` until the initial session check resolves.
   * While true we suppress the login/logout button so there is no flicker
   * between the "not logged in" and "logged in" states.
   *
   * If supabase is null (no env vars) we skip the check entirely and resolve
   * immediately to unauthenticated (guest mode).
   */
  const [authLoading, setAuthLoading] = useState<boolean>(supabase !== null);

  // Close mobile menu on route change without triggering a re-render loop
  if (pathname !== prevPathname) {
    setMenuOpen(false);
    setPrevPathname(pathname);
  }

  // ── Scroll listener ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Auth session ─────────────────────────────────────────────────────────
  useEffect(() => {
    // No Supabase client → stay as guest immediately, no network calls needed.
    if (!supabase) return;

    let cancelled = false; // guard against state updates after unmount

    // Initial session fetch — wrapped in try/catch to handle:
    //  • Offline / DNS failure
    //  • Supabase endpoint unreachable
    //  • Malformed JWT / key mismatch that causes SDK to throw
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!cancelled) setSession(data.session);
      })
      .catch((err: unknown) => {
        // Silently degrade to guest mode; avoid red console errors for
        // expected offline / misconfiguration scenarios.
        if (process.env.NODE_ENV === "development") {
          console.warn("[Navbar] Supabase getSession failed — guest mode:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });

    // Subscribe to auth state changes.
    // onAuthStateChange is synchronous and always returns a valid subscription
    // object even when the client cannot reach the server, so no try/catch is
    // needed here. Individual state-change failures are swallowed by the SDK.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!cancelled) {
        setSession(newSession);
        // Ensure loading clears if somehow the listener fires before getSession
        setAuthLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch (err: unknown) {
      // Even if signOut fails (e.g. already expired), clear local session and
      // redirect — the user's intent was to log out.
      if (process.env.NODE_ENV === "development") {
        console.warn("[Navbar] signOut error (ignored):", err);
      }
    } finally {
      setSession(null);
      router.push("/");
    }
  };

  return (
    <>
      <header
        data-print="hide"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-surface border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] backdrop-blur-md"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="FinWise home">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden glass-surface">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <polyline points="2 17 9 10 13 14 22 5" />
                <line x1="16" y1="5" x2="22" y2="5" />
                <line x1="22" y1="5" x2="22" y2="11" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Fin<span className="text-[#8B5CF6]">Wise</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="listitem"
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? "text-white glass-surface font-semibold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <AuthButton authLoading={authLoading} session={session} onLogout={handleLogout} />

            {/* Hamburger */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              id="hamburger-btn"
            >
              <span className={`block h-0.5 w-5 bg-slate-300 rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-0.5 bg-slate-300 rounded transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-5"}`} />
              <span className={`block h-0.5 w-5 bg-slate-300 rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden glass-panel border-t border-white/5 px-4 py-3 animate-slide-down"
            role="dialog"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-xl mb-1 transition-colors ${
                    isActive
                      ? "glass-surface text-white font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-white/5 mt-2 pt-2">
              <AuthButton mobile authLoading={authLoading} session={session} onLogout={handleLogout} />
            </div>
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-[68px]" aria-hidden="true" />
    </>
  );
}
