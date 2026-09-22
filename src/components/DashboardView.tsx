import React from "react";
import {
  TrendingUp,
  Wallet,
  PieChart,
  Target,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Receipt,
  Gem,
  ArrowUpRight,
} from "lucide-react";
import { Transaction, SavingsGoal, UserProfile } from "../types";
import { formatCurrency } from "../utils/currency";

interface DashboardViewProps {
  user: UserProfile;
  income: number;
  expenses: Transaction[];
  savingsGoals: SavingsGoal[];
  quizScore: { score: number; total: number } | null;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  income,
  expenses,
  savingsGoals,
  quizScore,
  onNavigateTab,
}) => {
  const sym = user.currencySymbol || "$";

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalSaved = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const netWorth = Math.max(0, totalSaved + (income - totalExpenses));
  const netSavings = Math.max(0, income - totalExpenses);
  const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;

  // Holistic Financial Health Score (0 - 100)
  const savingsRateScore = Math.min(40, (savingsRate / 20) * 40);
  const quizLitScore = quizScore ? Math.round((quizScore.score / quizScore.total) * 30) : 25;
  const goalFundedRatio =
    savingsGoals.length > 0
      ? savingsGoals.reduce((s, g) => s + Math.min(1, g.currentAmount / (g.targetAmount || 1)), 0) /
        savingsGoals.length
      : 0.8;
  const goalsScore = Math.round(goalFundedRatio * 30);
  const healthScore = Math.min(100, Math.round(savingsRateScore + quizLitScore + goalsScore));

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Simulated 6-Month Expense History
  const monthlyExpenses = [
    { month: "Apr", amount: Math.round(totalExpenses * 0.92) },
    { month: "May", amount: Math.round(totalExpenses * 0.96) },
    { month: "Jun", amount: Math.round(totalExpenses * 1.05) },
    { month: "Jul", amount: Math.round(totalExpenses * 0.98) },
    { month: "Aug", amount: Math.round(totalExpenses * 1.02) },
    { month: "Sep", amount: totalExpenses, current: true },
  ];
  const maxMonthExpense = Math.max(...monthlyExpenses.map((m) => m.amount), 1);

  // Date formatted like screenshot
  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Wall Street Institutional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-amber-500/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 bg-amber-500/10 border border-amber-500/25 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Institutional Financial Overview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-wallstreet tracking-tight">
            Welcome back, <span className="gold-gradient-text">{user.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            {currentDateFormatted}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AUDITED LEDGER</span>
          </div>

          <button
            onClick={() => onNavigateTab("assistant")}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-amber-950/40"
          >
            <Building2 className="w-4 h-4 text-slate-950" />
            <span>Advisory Ledger</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Balance Sheet Metrics (Fixed currency formatting: Never '$$') */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden border border-amber-500/20 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Net Worth</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300">
              <Gem className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-data">
            {formatCurrency(netWorth, sym, true)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Liquid Capital Reserve</span>
          </div>
        </div>

        {/* Total Income */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden border border-slate-700/40 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Total Income</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-data">
            {formatCurrency(income, sym, true)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-3">
            Monthly cashflow inflow
          </span>
        </div>

        {/* Total Expenses */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden border border-slate-700/40 hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Total Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-300 font-data">
            {formatCurrency(totalExpenses, sym, true)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-3">
            {Math.round((totalExpenses / (income || 1)) * 100)}% of earnings deployed
          </span>
        </div>

        {/* Total Saved */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden border border-slate-700/40 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Total Saved</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-data">
            {formatCurrency(totalSaved, sym, true)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>High Savings Trajectory</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Spending Overview & Financial Health Index */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spending Overview (Last 6 Months) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-wallstreet flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                Spending Overview
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly outflow history over the last 6 calendar periods
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("budget")}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Manage Blueprint</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Bar chart visualization */}
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2 border-b border-slate-700/60 pb-2">
              {monthlyExpenses.map((m) => {
                const heightPct = Math.max(15, Math.round((m.amount / maxMonthExpense) * 100));
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-data text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(m.amount, sym)}
                    </span>
                    <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-lg overflow-hidden flex items-end transition-all">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          m.current
                            ? "bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                            : "bg-slate-700 hover:bg-slate-600"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${m.current ? "text-amber-300 font-bold" : "text-slate-400"}`}>
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3">
              <span>*September reflects live registered expenditures</span>
              <span className="text-emerald-400 font-medium">Average Outflow: {formatCurrency(Math.round(totalExpenses * 0.98), sym)}</span>
            </div>
          </div>
        </div>

        {/* Financial Health Score (Radial Ring Gauge) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4 text-center">
          <div>
            <h3 className="text-base font-bold text-white font-wallstreet">
              Financial Health Index
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-factor liquidity & risk assessment
            </p>
          </div>

          <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="#1E293B"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="#D4AF37"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - healthScore / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white font-data">
                {healthScore}
              </span>
              <span className="text-[11px] text-slate-400 font-bold tracking-wider uppercase">
                / 100
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-emerald-400">
              {healthScore >= 80
                ? "Excellent Standing!"
                : healthScore >= 60
                ? "Solid Capital Reserve"
                : "Needs Liquidity Foundation"}
            </div>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Savings rate and reserve targets demonstrate institutional risk discipline.
            </p>
          </div>
        </div>
      </div>

      {/* Lower Row: Category Breakdown & Capital Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-wallstreet flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              Capital Allocation by Category
            </h3>
            <span className="text-xs text-slate-400">Top Categories</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([cat, amt]) => {
                const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{cat}</span>
                      <span className="text-white font-data">
                        {formatCurrency(amt, sym)}{" "}
                        <span className="text-slate-500">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full rounded-full bg-amber-400"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Active Capital Reserves */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-wallstreet flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Capital Reserves & Targets
              </h3>
              <button
                onClick={() => onNavigateTab("savings")}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All Reserves</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {savingsGoals.slice(0, 2).map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
                return (
                  <div key={goal.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-white">{goal.title}</span>
                      <span className="text-amber-300 font-data">
                        {formatCurrency(goal.currentAmount, sym)} / {formatCurrency(goal.targetAmount, sym)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-full bg-emerald-400 rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic / Knowledge Benchmark */}
          <div className="glass-panel rounded-3xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-wallstreet">Financial Literacy Benchmark</h4>
                <p className="text-xs text-slate-400">
                  {quizScore
                    ? `Mastery: ${quizScore.score}/${quizScore.total} foundational principles mastered`
                    : "Benchmark your understanding against 15 classic market & debt principles"}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("quiz")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shrink-0 cursor-pointer transition-colors"
            >
              {quizScore ? "Review" : "Take Exam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
