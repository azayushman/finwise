"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/learn",     label: "Learn" },
  { href: "/tools",     label: "Tools" },
  { href: "/quiz",      label: "Quiz" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-200/60"
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="FinWise home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center relative overflow-hidden shadow-sm"
                 style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="#00C896" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <polyline points="2 17 9 10 13 14 22 5" />
                <line x1="16" y1="5" x2="22" y2="5" />
                <line x1="22" y1="5" x2="22" y2="11" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Fin<span className="text-[#00C896]">Wise</span>
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
                      ? "text-slate-900 bg-slate-100 font-semibold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
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
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
              id="navbar-login-btn"
            >
              Login
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              id="hamburger-btn"
            >
              <span className={`block h-0.5 w-5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-0.5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-5"}`} />
              <span className={`block h-0.5 w-5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-white border-t border-slate-200 px-4 py-3 shadow-xl animate-slide-down"
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
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-slate-100 mt-2 pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white rounded-xl"
                style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
              >
                Login →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-[68px]" aria-hidden="true" />
    </>
  );
}
