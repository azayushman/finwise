"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// ── Types ──────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
}

interface Budget {
  id: string;
  category: string;
  amount_limit: number;
  spent: number;
}

interface SavingsGoal {
  id: string;
  name: string;
  current_amount: number;
  target_amount: number;
  target_date?: string;
}

interface QuizProgress {
  id: string;
  topic?: string;
  score: number;
  total_questions?: number;
}

// ── Demo Data Fallbacks ────────────────────────────────────────────────────

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "t1", amount: 4200, type: "income", category: "Salary", description: "Tech Corp Inc.", date: new Date().toISOString() },
  { id: "t2", amount: 1200, type: "expense", category: "Housing", description: "Monthly Rent", date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "t3", amount: 150, type: "expense", category: "Food", description: "Whole Foods Market", date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "t4", amount: 60, type: "expense", category: "Utilities", description: "Electric Bill", date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "t5", amount: 200, type: "income", category: "Side Hustle", description: "Freelance Design", date: new Date(Date.now() - 86400000 * 10).toISOString() },
];

const DEMO_BUDGETS: Budget[] = [
  { id: "b1", category: "Housing", amount_limit: 1500, spent: 1200 },
  { id: "b2", category: "Food", amount_limit: 500, spent: 340 },
  { id: "b3", category: "Transportation", amount_limit: 300, spent: 120 },
  { id: "b4", category: "Entertainment", amount_limit: 200, spent: 180 },
];

const DEMO_SAVINGS: SavingsGoal[] = [
  { id: "s1", name: "Emergency Fund", current_amount: 12500, target_amount: 15000 },
  { id: "s2", name: "Vacation", current_amount: 1200, target_amount: 3000 },
];

const DEMO_QUIZ: QuizProgress[] = [
  { id: "q1", topic: "Budgeting Basics", score: 90, total_questions: 100 },
  { id: "q2", topic: "Investing 101", score: 85, total_questions: 100 },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── StatCard ───────────────────────────────────────────────────────────────

function StatCard({ title, amount, prefix = "$", color = "#FFFFFF", icon, trend }: {
  title: string; amount: number; prefix?: string; color?: string; icon?: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(109,93,251,0.25)]">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{title}</h3>
        {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
      </div>
      <div className="text-3xl font-black mb-3 truncate" style={{ color }}>
        {prefix}{fmt(amount)}
      </div>
      {trend && (
        <div className={`text-xs font-semibold inline-flex items-center gap-1 ${trend.positive ? "text-[#8B5CF6]" : "text-rose-400"}`}>
          <span aria-hidden="true">{trend.positive ? "↑" : "↓"}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}

// ── SpendingChart ──────────────────────────────────────────────────────────

function SpendingChart({ transactions }: { transactions: Transaction[] }) {
  const chartData = useMemo(() => {
    const data: { month: string; spent: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
      data.push({ month: monthStr, spent: 0 });
    }

    transactions.filter(t => t.type === 'expense').forEach(tx => {
      const txDate = new Date(tx.date);
      const monthStr = txDate.toLocaleDateString('en-US', { month: 'short' });
      const idx = data.findIndex(d => d.month === monthStr && txDate.getFullYear() === now.getFullYear() - (now.getMonth() < txDate.getMonth() ? 1 : 0));
      if (idx !== -1) {
        data[idx].spent += tx.amount;
      } else {
        const fallbackIdx = data.findIndex(d => d.month === monthStr);
        if (fallbackIdx !== -1) data[fallbackIdx].spent += tx.amount;
      }
    });

    return data;
  }, [transactions]);

  const max = Math.max(...chartData.map(d => d.spent), 100);
  const hasData = chartData.some(d => d.spent > 0);

  if (!hasData) {
    return (
      <div className="h-48 flex items-center justify-center pt-4">
        <p className="text-sm text-[#94A3B8] font-medium text-center">No expenses yet. Add expenses to see your trend.</p>
      </div>
    );
  }

  return (
    <div className="h-48 flex items-end justify-between gap-2 pt-4" role="img" aria-label="Monthly spending bar chart for the last 6 months">
      {chartData.map((d, i) => (
        <div key={`${d.month}-${i}`} className="flex flex-col items-center gap-2 flex-1 group">
          <div
            className="w-full relative rounded-t-lg overflow-hidden glass-surface"
            style={{ height: "140px" }}
            title={`${d.month}: $${fmt(d.spent)}`}
          >
            <div
              className="absolute bottom-0 inset-x-0 rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-80"
              style={{
                height: `${(d.spent / max) * 100}%`,
                background: i === chartData.length - 1
                  ? "linear-gradient(180deg, #8B5CF6 0%, #6D5DFB 100%)"
                  : "linear-gradient(180deg, #4F46E5 0%, #1E3A5F 100%)",
                boxShadow: i === chartData.length - 1 ? "0 -4px 12px rgba(139,92,246,0.4)" : "none",
              }}
            />
          </div>
          <span className="text-xs font-semibold text-[#94A3B8] uppercase">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Client ────────────────────────────────────────────────────────────

export function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");

  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("No active session");
        }

        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "User");

        // Fetch real data simultaneously
        const [txRes, budgetRes, savingsRes, quizRes] = await Promise.all([
          supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }),
          supabase.from("budgets").select("*").eq("user_id", user.id),
          supabase.from("savings_goals").select("*").eq("user_id", user.id),
          supabase.from("quiz_progress").select("*").eq("user_id", user.id),
        ]);

        if (txRes.error || budgetRes.error || savingsRes.error || quizRes.error) {
          console.error("Data fetch error", txRes.error || budgetRes.error);
          setFetchError("We encountered a problem loading your dashboard data.");
        }

        setTransactions(txRes.data || []);
        setBudgets(budgetRes.data || []);
        setSavingsGoals(savingsRes.data || []);
        setQuizProgress(quizRes.data || []);

      } catch (err) {
        console.warn("User unauthenticated, falling back to demo mode.", err);
        setDemoMode(true);
        setUserName("Alex (Demo)");
        setTransactions(DEMO_TRANSACTIONS);
        setBudgets(DEMO_BUDGETS);
        setSavingsGoals(DEMO_SAVINGS);
        setQuizProgress(DEMO_QUIZ);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ── Loading state ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading dashboard">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin text-[#8B5CF6]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p className="text-sm font-semibold text-[#94A3B8]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────

  if (fetchError && !demoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-4xl" aria-hidden="true">⚠️</div>
          <p className="text-sm font-semibold text-rose-400" role="alert">Oops, something went wrong</p>
          <p className="text-xs text-[#94A3B8] max-w-sm">{fetchError}</p>
        </div>
      </div>
    );
  }

  const isCompletelyEmpty = !demoMode && transactions.length === 0 && budgets.length === 0 && savingsGoals.length === 0;

  // ── Derived Stats ────────────────────────────────────────────────────────

  const totalIncome   = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const totalSavings  = savingsGoals.reduce((acc, g) => acc + g.current_amount, 0);

  const netWorth = totalIncome - totalExpenses;

  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  let healthScore = 50;
  if (savingsRate >= 20) healthScore += 25;
  if (totalExpenses < totalIncome && totalIncome > 0) healthScore += 25;

  const avgQuizScore = quizProgress.length > 0
    ? quizProgress.reduce((s, q) => s + (q.score / (q.total_questions || 100)) * 100, 0) / quizProgress.length
    : 0;

  return (
    <div className="min-h-screen text-[#F5F7FF] pb-20 relative">
      {/* ── Page ambient depth ── */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[130px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,93,251,0.08), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[40%] left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.06), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* ════════════════ HEADER ════════════════ */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 glass-surface">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                    Your Financial Overview
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white mb-2">
                  Welcome back,{" "}
                  <span className="gradient-text">{userName}</span>
                </h1>
                <p className="text-base text-[#94A3B8]">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              {demoMode && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-surface self-start sm:self-auto"
                     style={{ color: "#C4B5FD", borderColor: "rgba(139,92,246,0.35)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Demo Mode</span>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ════════════════ EMPTY STATE ════════════════ */}
        {isCompletelyEmpty ? (
          <ScrollReveal direction="up">
            <div className="glass-panel rounded-3xl p-10 md:p-16 text-center max-w-3xl mx-auto">
              <div className="text-5xl mb-6" aria-hidden="true">🌱</div>
              <h2 className="text-2xl font-bold text-white mb-3">Your financial journey starts here</h2>
              <p className="text-[#94A3B8] mb-8 max-w-md mx-auto leading-relaxed">
                Welcome to FinWise! It looks like you haven&apos;t added any transactions or budgets yet. Start tracking your income and expenses to unlock personalized insights and a financial health score.
              </p>
              <Link
                href="/budget"
                className="inline-block px-6 py-3 bg-[#6D5DFB] hover:shadow-[0_8px_20px_rgba(109,93,251,0.4)] hover:-translate-y-0.5 border border-white/10 text-white font-bold rounded-xl transition-all duration-300"
              >
                Set up your Budget
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* ════ STAT CARDS ════ */}
            <ScrollReveal direction="up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard title="Net Worth"      amount={netWorth}      icon="💎" color="#F5F7FF" />
                <StatCard title="Total Income"   amount={totalIncome}   color="#8B5CF6" icon="📥" />
                <StatCard title="Total Expenses" amount={totalExpenses} color="#60A5FA" icon="📤" />
                <StatCard
                  title="Total Saved" amount={totalSavings} color="#C4B5FD" icon="⚡"
                  trend={savingsRate > 20 ? { value: "Great rate", positive: true } : undefined}
                />
              </div>
            </ScrollReveal>

            {/* ════ SPENDING CHART + HEALTH SCORE ════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

              {/* Spending chart */}
              <div className="lg:col-span-2">
                <ScrollReveal direction="up" delay={100}>
                  <div className="glass-panel rounded-3xl p-6 h-full flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Spending Overview</h2>
                      <p className="text-sm text-[#94A3B8] mb-4">Your expenses over the last 6 months</p>
                    </div>
                    <SpendingChart transactions={transactions} />
                  </div>
                </ScrollReveal>
              </div>

              {/* Health score */}
              <div className="lg:col-span-1">
                <ScrollReveal direction="up" delay={150}>
                  <div className="glass-panel rounded-3xl p-6 h-full text-center flex flex-col items-center justify-center">
                    <h2 className="text-lg font-bold text-white mb-6">Financial Health Score</h2>

                    {/* Score Ring */}
                    <div className="relative mb-6">
                      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90" aria-hidden="true">
                        <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                        <circle
                          cx="70" cy="70" r="60"
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(healthScore / 100) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                          style={{ transition: "stroke-dasharray 1s ease-out", filter: "drop-shadow(0 0 6px rgba(139,92,246,0.5))" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-black text-white" aria-label={`Health score: ${healthScore} out of 100`}>{healthScore}</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8]">/ 100</span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-200 mb-1">
                      {healthScore >= 80 ? "Excellent standing!" : healthScore >= 50 ? "Good standing" : "Needs attention"}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {totalIncome === 0 ? "Log income to improve your score." : "Your score updates automatically based on spending and saving."}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* ════ TRANSACTIONS + BUDGET + SAVINGS ════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* Recent Transactions */}
              <ScrollReveal direction="up" delay={200}>
                <div className="glass-panel rounded-3xl p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                    <span className="text-sm font-semibold text-[#94A3B8]">{transactions.length} Total</span>
                  </div>

                  {transactions.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-3xl mb-3" aria-hidden="true">📝</div>
                      <p className="text-sm font-medium text-slate-300">No transactions yet</p>
                      <p className="text-xs text-[#94A3B8] mt-1">They will appear here once added.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.slice(0, 6).map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl glass-surface hover:border-white/15 transition-all duration-200">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ${
                                tx.type === "income" ? "bg-[#6D5DFB]/20 text-[#8B5CF6]" : "bg-white/5 text-[#94A3B8]"
                              }`}
                              aria-hidden="true"
                            >
                              {tx.type === "income" ? "↓" : "↑"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{tx.description}</p>
                              <p className="text-xs text-[#94A3B8]">{tx.category} · {formatDate(tx.date)}</p>
                            </div>
                          </div>
                          <div className={`text-sm font-bold flex-shrink-0 ml-3 ${tx.type === "income" ? "text-[#8B5CF6]" : "text-white"}`}>
                            <span aria-label={`${tx.type === "income" ? "income" : "expense"} of $${fmt(tx.amount)}`}>
                              {tx.type === "income" ? "+" : "-"}${fmt(tx.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Budget + Savings stacked */}
              <div className="space-y-8">

                {/* Budget Progress */}
                <ScrollReveal direction="up" delay={250}>
                  <div className="glass-panel rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-white">Budget Progress</h2>
                      <Link href="/budget" className="text-sm font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">Manage</Link>
                    </div>

                    {budgets.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm font-medium text-slate-300 mb-3">Create your first budget</p>
                        <Link
                          href="/budget"
                          className="inline-block px-4 py-2 glass-surface border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-lg transition-all duration-200"
                        >
                          Get Started
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {budgets.map(b => {
                          const pct = b.amount_limit > 0 ? Math.min((b.spent / b.amount_limit) * 100, 100) : 0;
                          const isWarning = pct > 85;
                          return (
                            <div key={b.id}>
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-semibold text-slate-200">{b.category}</span>
                                <span className="font-medium text-[#94A3B8]">
                                  <span className={isWarning ? "text-rose-400 font-bold" : "text-white"}>
                                    ${fmt(b.spent)}
                                  </span>
                                  {isWarning && <span className="sr-only"> (over budget warning)</span>}
                                  {" "}/ ${fmt(b.amount_limit)}
                                </span>
                              </div>
                              <div
                                className="h-1.5 rounded-full overflow-hidden glass-surface"
                                role="progressbar"
                                aria-valuenow={Math.round(pct)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${b.category}: ${Math.round(pct)}% of budget used`}
                              >
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%`, background: isWarning ? "#EF4444" : "#8B5CF6" }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                {/* Savings Goals */}
                <ScrollReveal direction="up" delay={300}>
                  <div className="glass-panel rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-white">Savings Goals</h2>
                      <Link href="/savings" className="text-sm font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">Manage</Link>
                    </div>

                    {savingsGoals.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm font-medium text-slate-300 mb-3">Start a savings goal</p>
                        <Link
                          href="/savings"
                          className="inline-block px-4 py-2 glass-surface border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-lg transition-all duration-200"
                        >
                          Plan Savings
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {savingsGoals.map(g => {
                          const pct = g.target_amount > 0 ? Math.min((g.current_amount / g.target_amount) * 100, 100) : 0;
                          return (
                            <div key={g.id}>
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-semibold text-slate-200">{g.name}</span>
                                <span className="font-medium text-[#94A3B8]">
                                  <span className="text-[#8B5CF6] font-bold">${fmt(g.current_amount)}</span>
                                  {" "}/ ${fmt(g.target_amount)}
                                </span>
                              </div>
                              <div
                                className="h-1.5 rounded-full overflow-hidden glass-surface"
                                role="progressbar"
                                aria-valuenow={Math.round(pct)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${g.name}: ${Math.round(pct)}% of goal reached`}
                              >
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, #6D5DFB, #8B5CF6)" }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* ════ LEARNING PROGRESS + INSIGHT ════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Learning Progress */}
              <ScrollReveal direction="up" delay={100}>
                <div className="glass-panel rounded-3xl p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white">Learning Progress</h2>
                      <Link href="/learn" className="text-sm font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors">Continue</Link>
                    </div>

                    {quizProgress.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="text-3xl mb-3" aria-hidden="true">📚</div>
                        <p className="text-sm font-medium text-slate-300">Test your financial literacy</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-surface rounded-xl p-4 text-center">
                          <div className="text-2xl font-black text-[#8B5CF6] mb-1">{quizProgress.length}</div>
                          <div className="text-xs font-semibold uppercase text-[#94A3B8]">Quizzes Done</div>
                        </div>
                        <div className="glass-surface rounded-xl p-4 text-center">
                          <div className="text-2xl font-black text-[#60A5FA] mb-1">{avgQuizScore.toFixed(0)}%</div>
                          <div className="text-xs font-semibold uppercase text-[#94A3B8]">Avg Score</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>

              {/* FinWise Insight */}
              <ScrollReveal direction="up" delay={150}>
                <div className="glass-panel rounded-3xl p-6 text-white relative overflow-hidden h-full">
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 translate-x-8 -translate-y-8 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }}
                    aria-hidden="true"
                  />

                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <span className="text-xl" aria-hidden="true">💡</span>
                    <h2 className="text-sm font-bold tracking-wider uppercase text-[#8B5CF6]">FinWise Insight</h2>
                  </div>

                  <p className="text-sm leading-relaxed mb-4 relative z-10 text-[#94A3B8]">
                    {totalSavings > 0
                      ? "Great job on your savings! Remember, every dollar saved today benefits from the power of compound interest."
                      : "Track your income and expenses to unlock personalized insights and recommendations for your financial journey."}
                  </p>

                  <Link
                    href="/learn"
                    className="text-xs font-bold text-white hover:underline decoration-[#8B5CF6] underline-offset-4 relative z-10"
                  >
                    Learn more about Financial Health →
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
