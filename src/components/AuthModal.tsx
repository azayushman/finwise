import React, { useState } from "react";
import { X, User, ShieldCheck, Landmark } from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [currency, setCurrency] = useState(currentUser.currencySymbol || "$");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateUser({
      ...currentUser,
      name: name.trim(),
      currencySymbol: currency,
      isDemo: name.trim().toLowerCase() === "alex",
    });
    onClose();
  };

  const handleSetDemoAlex = () => {
    onUpdateUser({
      id: "demo-alex",
      name: "Alex",
      email: "alex@finwise.app",
      isDemo: true,
      currencySymbol: "$",
    });
    setName("Alex");
    setCurrency("$");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/25 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl glass-surface border-white/5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-amber-300 font-wallstreet">
          <Landmark className="w-4 h-4 text-amber-400" />
          <span>Investor Ledger Profile</span>
        </div>

        <h3 className="text-xl font-black text-white font-wallstreet mb-1">
          Customize Ledger Settings
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Define your portfolio display credentials and reporting currency.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Investor Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0E121B] border border-amber-500/25 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reporting Currency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "$ (USD)", val: "$" },
                { label: "₹ (INR)", val: "₹" },
                { label: "€ (EUR)", val: "€" },
                { label: "£ (GBP)", val: "£" },
              ].map((c) => (
                <button
                  type="button"
                  key={c.val}
                  onClick={() => setCurrency(c.val)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    currency === c.val
                      ? "bg-amber-500/25 border-amber-500/50 text-amber-300 shadow-sm"
                      : "bg-[#0E121B] border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] transition-all cursor-pointer shadow-md shadow-amber-950/40"
            >
              Save Ledger Configuration
            </button>

            <button
              type="button"
              onClick={handleSetDemoAlex}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-amber-300/90 glass-surface border-amber-500/20 hover:border-amber-500/40 transition-colors cursor-pointer"
            >
              Reset to Demo Portfolio (Alex, USD)
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Client Storage Safe
          </span>
          <span>Zero external tracking</span>
        </div>
      </div>
    </div>
  );
};
