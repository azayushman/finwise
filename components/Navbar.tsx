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
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setMenuOpen(false);
    setPrevPathname(pathname);
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#07111F]/90 backdrop-blur-md shadow-[0_4px_25px_rgba(7,17,31,0.8)] border-b border-[#8B5CF6]/20"
            : "bg-[#07111F]/70 backdrop-blur-sm border-b border-[#8B5CF6]/10"
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="FinWise home">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm border border-[#8B5CF6]/30"
                 style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)" }}>
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
                      ? "text-white bg-[#102A4C] border border-[#8B5CF6]/30 font-semibold shadow-[0_0_12px_rgba(109,93,251,0.2)]"
                      : "text-[#94A3B8] hover:text-white hover:bg-[#102A4C]/60"
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
              className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(109,93,251,0.4)]"
              style={{ background: "linear-gradient(135deg, #6D5DFB 0%, #4F46E5 100%)" }}
              id="navbar-login-btn"
            >
              Login
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-[#102A4C] transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
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
            className="md:hidden bg-[#0B1F3A] border-t border-[#8B5CF6]/20 px-4 py-3 shadow-xl animate-slide-down"
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
                      ? "bg-[#102A4C] text-white font-semibold border border-[#8B5CF6]/30"
                      : "text-[#94A3B8] hover:bg-[#102A4C]/50 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-[#8B5CF6]/15 mt-2 pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white rounded-xl shadow-[0_0_20px_rgba(109,93,251,0.3)]"
                style={{ background: "linear-gradient(135deg, #6D5DFB 0%, #4F46E5 100%)" }}
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
