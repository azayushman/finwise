import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BookOpen,
  Calculator,
  Award,
  Landmark,
  PieChart,
  Target,
  LayoutDashboard,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Overview", icon: TrendingUp },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "budget", label: "Budget Blueprint", icon: PieChart },
    { id: "savings", label: "Capital Reserves", icon: Target },
    { id: "tools", label: "Calculators", icon: Calculator },
    { id: "learn", label: "Foundations", icon: BookOpen },
    { id: "quiz", label: "Benchmark", icon: Award },
    { id: "assistant", label: "Advisory Ledger", icon: Landmark },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090C12]/92 backdrop-blur-xl border-b border-amber-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-[#090C12]/60 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
          id="navbar-logo-btn"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden bg-amber-500/10 border border-amber-500/30 shadow-sm transition-transform group-hover:scale-105">
            <Landmark className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white font-wallstreet flex items-center gap-1">
              FIN<span className="text-amber-400">WISE</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold -mt-1">
              Wall Street Intelligence
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101520]/80 p-1.5 rounded-2xl border border-amber-500/15" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-white bg-amber-500/15 border border-amber-500/40 shadow-[0_2px_12px_rgba(212,175,55,0.18)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
                aria-current={isActive ? "page" : undefined}
                id={`nav-link-${item.id}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side controls (User Profile) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold glass-surface border-amber-500/20 hover:border-amber-500/40 text-slate-200 hover:text-white transition-all duration-200 cursor-pointer"
            id="navbar-profile-btn"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[100px] truncate">{user.name}</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl glass-surface border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#090C12]/98 backdrop-blur-2xl border-b border-amber-500/20 px-4 py-4 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-amber-500/20 text-white border border-amber-500/40"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Wall Street Heritage Intelligence
            </span>
            <button
              onClick={onOpenAuth}
              className="text-amber-400 hover:underline font-semibold"
            >
              Switch Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
