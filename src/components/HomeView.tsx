import React from "react";
import {
  TrendingUp,
  BookOpen,
  Calculator,
  Award,
  ShieldCheck,
  ArrowRight,
  PieChart,
  Landmark,
  Scale,
  Gem,
  CheckCircle2,
} from "lucide-react";
import { UserProfile } from "../types";
import { formatCurrency } from "../utils/currency";

interface HomeViewProps {
  user: UserProfile;
  onNavigateTab: (tab: string) => void;
  onAskAboutTopic: (topic: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  onNavigateTab,
  onAskAboutTopic,
}) => {
  const sym = user.currencySymbol || "$";

  return (
    <div className="space-y-16 py-8 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-300">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Institutional Capital Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-wallstreet tracking-tight leading-[1.1]">
            Empirical Wealth. <br />
            <span className="gold-gradient-text">Wall Street Discipline.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            FinWise equips students and emerging professionals with the timeless capital allocation principles of modern Wall Street: mathematical budgeting frameworks, non-linear compound growth models, and strategic debt liquidation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("dashboard")}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-950/40"
              id="hero-dashboard-cta"
            >
              <TrendingUp className="w-4 h-4 text-slate-950" />
              <span>Open Balance Sheet</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => onNavigateTab("assistant")}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-amber-300 glass-surface border-amber-500/20 hover:border-amber-500/40 hover:text-white transition-all cursor-pointer flex items-center gap-2"
              id="hero-assistant-cta"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Open Advisory Ledger</span>
            </button>
          </div>

          {/* Institutional Trust Badges */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Unbiased Academic Principles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Sponsored Broker Bias</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-300" />
              <span>Client-Side Mathematical Accuracy</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Capital Compound Model Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/25 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-wallstreet">
                Empirical Compounding Model
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                12% Annualized Benchmark
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-wallstreet mb-2">
              The Power of Capital Duration
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              A disciplined monthly allocation of {formatCurrency(2500, sym)} at 12% historic equity return across 30 years grows to over <strong className="text-white">{formatCurrency(8800000, sym)}</strong> on just {formatCurrency(900000, sym)} cumulative principal. Compounding does the heavy lifting.
            </p>

            <div className="space-y-3 p-4 rounded-2xl bg-[#0F1420] border border-amber-500/15">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Contributed Principal:</span>
                <span className="text-white font-data">{formatCurrency(900000, sym)} (10%)</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-300">Compounded Surplus:</span>
                <span className="text-amber-300 font-data font-bold">{formatCurrency(7900000, sym)} (90%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#080B10] overflow-hidden flex border border-slate-800">
                <div style={{ width: "10%" }} className="h-full bg-slate-600" />
                <div style={{ width: "90%" }} className="h-full bg-gradient-to-r from-amber-500 to-amber-300" />
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("tools")}
              className="w-full mt-6 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Model Custom Trajectories in Calculators</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-wallstreet tracking-tight">
            Institutional Financial Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Disciplined frameworks engineered to manage capital through college, early career, and long-term compounding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onNavigateTab("learn")}
            className="glass-card rounded-3xl p-6 cursor-pointer space-y-4 border border-slate-800 hover:border-amber-500/30"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-wallstreet">Foundations Curriculum</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Empirical modules on the 50/30/20 balance sheet, dollar-cost averaging, inflation mechanics, and credit ratings.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 pt-2">
              Review Modules <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigateTab("tools")}
            className="glass-card rounded-3xl p-6 cursor-pointer space-y-4 border border-slate-800 hover:border-amber-500/30"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-wallstreet">Capital Calculators</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Compound growth simulator, 50/30/20 cash flow distributor, emergency reserve model, and loan EMI amortizers.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 pt-2">
              Run Calculators <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigateTab("quiz")}
            className="glass-card rounded-3xl p-6 cursor-pointer space-y-4 border border-slate-800 hover:border-amber-500/30"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-wallstreet">Literacy Benchmark</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                15 rigorous evaluative questions benchmarking understanding of market risk, interest traps, and portfolio diversification.
              </p>
            </div>
            <span className="text-xs text-slate-300 font-bold flex items-center gap-1 pt-2">
              Take Benchmark <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onNavigateTab("assistant")}
            className="glass-card rounded-3xl p-6 cursor-pointer space-y-4 border border-slate-800 hover:border-amber-500/30"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-wallstreet">Advisory Ledger</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Institutional memoranda and financial dispatches addressing debt liquidation, market history, and compounding principles.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 pt-2 font-data">
              Open Ledger Dispatches <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Suggested Historical & Strategic Inquiries */}
      <section className="glass-panel rounded-3xl p-8 space-y-4 border border-amber-500/20">
        <h3 className="text-lg font-bold text-white font-wallstreet flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-400" />
          Strategic Inquiries Transcribed to Advisory Ledger
        </h3>
        <p className="text-xs text-slate-400">
          Select any strategic topic to evaluate with your institutional advisor:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {[
            "How does Benjamin Graham's Margin of Safety apply to an emergency fund?",
            "What did the 1792 Buttonwood Agreement establish about market diversification?",
            "How does the 50/30/20 framework function as an operating balance sheet?",
            "Why is paying only the 'Minimum Due' on credit cards a mathematical trap?",
            "How do historical equities beat inflation over 20+ year compounding windows?",
            "Mathematical comparison of Debt Avalanche vs. Debt Snowball",
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => onAskAboutTopic(q)}
              className="text-left p-3.5 rounded-2xl glass-surface border-slate-800 hover:border-amber-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-2"
            >
              <span>{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
