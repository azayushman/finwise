"use client";

import { useState, useCallback, useId } from "react";
import { useCurrency } from "@/src/contexts/CurrencyContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ResetConfirmModal } from "@/components/ui/ResetConfirmModal";
import {
  downloadJSON,
  downloadCSV,
  buildFinWiseBackup,
  clearFinWiseStorage,
  todayIso,
  type CsvRow,
} from "@/src/lib/exportData";

/* ══════════════════════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════════════════════ */

const EXPENSE_CATEGORIES = [
  "Housing", "Transport", "Food", "Utilities", "Insurance",
  "Healthcare", "Entertainment", "Subscriptions", "Clothing",
  "Education", "Dining Out", "Personal Care", "Debt Payment", "Other",
] as const;

type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

interface ExpenseEntry {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  type: "fixed" | "variable";
}

interface FormErrors {
  income?: string;
  savings?: string;
  expenseName?: string;
  expenseAmount?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#8B5CF6", Transport: "#F59E0B", Food: "#6D5DFB",
  Utilities: "#A78BFA", Insurance: "#EC4899", Healthcare: "#EF4444",
  Entertainment: "#F97316", Subscriptions: "#6366F1", Clothing: "#38BDF8",
  Education: "#4F46E5", "Dining Out": "#D97706", "Personal Care": "#C084FC",
  "Debt Payment": "#DC2626", Other: "#94A3B8",
};

/* ══════════════════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════════════════ */

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min((part / total) * 100, 100);
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Clamp `value` within [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Parse a string to a number and clamp it.
 * Returns `fallback` (default 0) when the string is empty or results in NaN.
 */
function safeNum(raw: string, min: number, max: number, fallback = 0): number {
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return clamp(n, min, max);
}

/* ══════════════════════════════════════════════════════════════════════════
   Donut Chart (SVG)
   ══════════════════════════════════════════════════════════════════════════ */

interface DonutSlice { label: string; value: number; color: string }

function DonutChart({ slices, centerLabel, centerValue }: {
  slices: DonutSlice[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total <= 0) {
    return (
      <div className="flex items-center justify-center h-52 text-sm text-slate-300">
        Add expenses to see chart
      </div>
    );
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const slicesFiltered = slices.filter(s => s.value > 0);
  const slicesWithOffsets = slicesFiltered.map((slice, index, arr) => {
    const fraction = slice.value / total;
    const dashLen = fraction * circumference;
    const cumulative = arr.slice(0, index).reduce((sum, s) => sum + (s.value / total), 0);
    const dashOff = -cumulative * circumference;
    return { ...slice, dashLen, dashOff };
  });

  return (
    <svg viewBox="0 0 120 120" className="w-full max-w-[220px] mx-auto" aria-hidden="true">
      {slicesWithOffsets.map((slice) => (
        <circle
          key={slice.label}
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={slice.color}
          strokeWidth="14"
          strokeDasharray={`${slice.dashLen} ${circumference - slice.dashLen}`}
          strokeDashoffset={slice.dashOff}
          strokeLinecap="butt"
          style={{ transition: "stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease" }}
        />
      ))}
      <text x="60" y="55" textAnchor="middle" className="fill-white text-[10px] font-bold">{centerValue}</text>
      <text x="60" y="67" textAnchor="middle" className="fill-[#94A3B8] text-[6px]">{centerLabel}</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Horizontal bar row
   ══════════════════════════════════════════════════════════════════════════ */

function BreakdownRow({ label, amount, percentage, color }: {
  label: string; amount: number; percentage: number; color: string;
}) {
  const { formatCurrency } = useCurrency();
  return (
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-sm text-slate-200 flex-1 truncate">{label}</span>
      <span className="text-xs text-slate-300 w-10 text-right">{percentage.toFixed(0)}%</span>
      <span className="text-sm font-semibold text-white w-20 text-right">{formatCurrency(amount)}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Shared input class helper
   ══════════════════════════════════════════════════════════════════════════ */

function inputCls(hasError: boolean, extra?: string) {
  return [
    "w-full px-4 py-3 text-sm text-white rounded-xl outline-none transition-all duration-300",
    "bg-white/5 border placeholder:text-slate-300/60",
    hasError
      ? "border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
      : "border-white/10 hover:border-white/15 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20",
    extra ?? "",
  ].join(" ");
}

/* ══════════════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════════════ */

export function BudgetClient() {
  const { formatCurrency, currency } = useCurrency();
  /* ── State ── */
  const [income, setIncome] = useState<string>("");
  const [savingsRate, setSavingsRate] = useState<string>("20");
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // New expense form
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("Other");
  const [newType, setNewType] = useState<"fixed" | "variable">("fixed");
  const [editingId, setEditingId] = useState<string | null>(null);

  const incomeId = useId();
  const savingsId = useId();

  /* ── Derived values ── */
  // Clamp income to a safe positive range to prevent NaN in all downstream calculations
  const incomeNum = safeNum(income, 0, 100_000_000);
  const savingsRateNum = Math.max(0, Math.min(100, parseFloat(savingsRate) || 0));
  const savingsAllocation = incomeNum * (savingsRateNum / 100);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = incomeNum - totalExpenses - savingsAllocation;
  const fixedTotal = expenses.filter(e => e.type === "fixed").reduce((s, e) => s + e.amount, 0);
  const variableTotal = expenses.filter(e => e.type === "variable").reduce((s, e) => s + e.amount, 0);

  /* Category breakdown */
  const categoryBreakdown = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const donutSlices: DonutSlice[] = [
    ...Object.entries(categoryBreakdown).map(([label, value]) => ({
      label, value, color: CATEGORY_COLORS[label] || "#94A3B8",
    })),
    ...(savingsAllocation > 0 ? [{ label: "Savings", value: savingsAllocation, color: "#8B5CF6" }] : []),
    ...(remaining > 0 ? [{ label: "Unallocated", value: remaining, color: "#1E3A5F" }] : []),
  ];

  /* ── Validation ── */
  const validateIncome = useCallback((v: string) => {
    const n = parseFloat(v);
    if (!v.trim()) return "Income is required.";
    if (isNaN(n) || n < 0) return "Enter a valid non-negative number.";
    return undefined;
  }, []);

  const validateSavings = useCallback((v: string) => {
    const n = parseFloat(v);
    if (isNaN(n) || n < 0 || n > 100) return "Enter a value between 0 and 100.";
    return undefined;
  }, []);

  /* ── Add / Edit expense ── */
  function handleAddExpense() {
    const nameErr = !newName.trim() ? "Name is required." : undefined;
    const amtNum = parseFloat(newAmount);
    const amtErr = !newAmount.trim()
      ? "Amount is required."
      : !Number.isFinite(amtNum) || amtNum <= 0
        ? "Enter a positive number."
        : amtNum > 100_000_000
          ? "Amount is too large (max 100,000,000)."
          : undefined;

    if (nameErr || amtErr) {
      setErrors(prev => ({ ...prev, expenseName: nameErr, expenseAmount: amtErr }));
      return;
    }

    // Safe-clamp the stored amount so NaN can never enter the expense list
    const safeAmt = clamp(amtNum, 0, 100_000_000);

    if (editingId) {
      setExpenses(prev => prev.map(e =>
        e.id === editingId
          ? { ...e, name: newName.trim(), amount: safeAmt, category: newCategory, type: newType }
          : e
      ));
      setEditingId(null);
    } else {
      setExpenses(prev => [
        ...prev,
        { id: genId(), name: newName.trim(), amount: safeAmt, category: newCategory, type: newType },
      ]);
    }

    setNewName(""); setNewAmount(""); setNewCategory("Other"); setNewType("fixed");
    setErrors(prev => ({ ...prev, expenseName: undefined, expenseAmount: undefined }));
  }

  function handleEdit(entry: ExpenseEntry) {
    setNewName(entry.name);
    setNewAmount(entry.amount.toString());
    setNewCategory(entry.category);
    setNewType(entry.type);
    setEditingId(entry.id);
  }

  function handleDelete(id: string) {
    setExpenses(prev => prev.filter(e => e.id !== id));
    if (editingId === id) {
      setEditingId(null); setNewName(""); setNewAmount("");
    }
  }

  function handleReset() {
    setIncome(""); setSavingsRate("20"); setExpenses([]);
    setNewName(""); setNewAmount(""); setNewCategory("Other"); setNewType("fixed");
    setEditingId(null); setErrors({});
  }

  /* ── Export handlers ── */
  function handleExportJSON() {
    const backup = buildFinWiseBackup({
      currency,
      income,
      savingsRate,
      expenses: expenses.map(({ id, name, amount, category, type }) => ({
        id, name, amount, category, type,
      })),
      savings: null,
    });
    downloadJSON(backup, `finwise-backup-${todayIso()}.json`);
  }

  function handleExportCSV() {
    const today = todayIso();
    // Map expense type to need/want label (fixed ≈ Need, variable ≈ Want)
    const typeLabel = (t: "fixed" | "variable"): string =>
      t === "fixed" ? "Need" : "Want";
    const rows: CsvRow[] = expenses.map((e) => ({
      Category: e.category,
      Amount: e.amount,
      Type: typeLabel(e.type),
      Date: today,
    }));
    downloadCSV(rows, `finwise-budget-${today}.csv`);
  }

  function handleResetAll() {
    clearFinWiseStorage();
    handleReset();
  }

  /* ── Summary cards ── */
  const summaryCards = [
    { label: "Monthly Income", value: incomeNum, color: "#8B5CF6", icon: "💰" },
    { label: "Total Expenses", value: totalExpenses, color: "#60A5FA", icon: "📋" },
    { label: "Savings", value: savingsAllocation, color: "#C4B5FD", icon: "💎" },
    { label: "Remaining", value: remaining, color: remaining < 0 ? "#EF4444" : "#8B5CF6", icon: remaining < 0 ? "⚠️" : "✨" },
  ];

  return (
    <div className="min-h-screen text-[#F5F7FF] relative">
      {/* ── Page-level ambient depth ── */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#6D5DFB]/8 rounded-full blur-[120px] -z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-[30%] left-0 w-[500px] h-[500px] bg-[#3B82F6]/6 rounded-full blur-[100px] -z-10 pointer-events-none" aria-hidden="true" />

      {/* ── Hero / Header ── */}
      <div className="pt-16 pb-12 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 glass-surface">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                Budget Planner
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white mb-4">
              Know where your<br />
              <span className="gradient-text">money goes.</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed text-slate-300">
              Create a personalised monthly budget. Track where your money goes and
              find areas to save more.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* ── Summary Cards ── */}
        <ScrollReveal direction="up" className="mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((c) => (
              <div
                key={c.label}
                className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg" aria-hidden="true">{c.icon}</span>
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{c.label}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: c.color }}>
                  {formatCurrency(c.value)}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Inputs + Expense List ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Income + Savings Rate */}
            <ScrollReveal direction="up" delay={50}>
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Income &amp; Savings</h2>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-300 hover:text-rose-400 transition-colors"
                  >
                    Reset budget
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Income */}
                  <div>
                    <label htmlFor={incomeId} className="text-sm font-semibold text-slate-200 mb-1.5 block">
                      Monthly Income ($)
                    </label>
                    <input
                      id={incomeId}
                      type="number"
                      min="0"
                      step="0.01"
                      value={income}
                      onChange={e => { setIncome(e.target.value); setErrors(prev => ({ ...prev, income: validateIncome(e.target.value) })); }}
                      onBlur={() => setErrors(prev => ({ ...prev, income: validateIncome(income) }))}
                      placeholder="e.g. 4500"
                      aria-invalid={Boolean(errors.income)}
                      className={inputCls(Boolean(errors.income))}
                    />
                    {errors.income && <p className="mt-1.5 text-xs text-rose-400 font-medium" role="alert">{errors.income}</p>}
                  </div>
                  {/* Savings rate */}
                  <div>
                    <label htmlFor={savingsId} className="text-sm font-semibold text-slate-200 mb-1.5 block">
                      Savings Rate (%)
                    </label>
                    <input
                      id={savingsId}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={savingsRate}
                      onChange={e => { setSavingsRate(e.target.value); setErrors(prev => ({ ...prev, savings: validateSavings(e.target.value) })); }}
                      onBlur={() => setErrors(prev => ({ ...prev, savings: validateSavings(savingsRate) }))}
                      placeholder="20"
                      aria-invalid={Boolean(errors.savings)}
                      className={inputCls(Boolean(errors.savings))}
                    />
                    {errors.savings && <p className="mt-1.5 text-xs text-rose-400 font-medium" role="alert">{errors.savings}</p>}
                  </div>
                </div>

                {/* Savings allocation callout */}
                {savingsAllocation > 0 && (
                  <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl glass-surface border-[#8B5CF6]/20">
                    <span className="text-[#8B5CF6]" aria-hidden="true">💎</span>
                    <span className="text-sm text-[#C4B5FD] font-medium">
                      Saving <strong className="text-white">{formatCurrency(savingsAllocation)}</strong> / month at {savingsRateNum}%
                    </span>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Add Expense Form */}
            <ScrollReveal direction="up" delay={100}>
              <form
                className="glass-panel rounded-3xl p-6 sm:p-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddExpense();
                }}
              >
                <h2 className="text-lg font-bold text-white mb-6">
                  {editingId ? "Edit Expense" : "Add Expense"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label htmlFor="expense-name" className="text-sm font-semibold text-slate-200 mb-1.5 block">Name</label>
                    <input
                      id="expense-name"
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Rent"
                      className={inputCls(Boolean(errors.expenseName))}
                    />
                    {errors.expenseName && <p className="mt-1.5 text-xs text-rose-400 font-medium" role="alert">{errors.expenseName}</p>}
                  </div>
                  <div>
                    <label htmlFor="expense-amount" className="text-sm font-semibold text-slate-200 mb-1.5 block">Amount ($)</label>
                    <input
                      id="expense-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value)}
                      placeholder="e.g. 1200"
                      className={inputCls(Boolean(errors.expenseAmount))}
                    />
                    {errors.expenseAmount && <p className="mt-1.5 text-xs text-rose-400 font-medium" role="alert">{errors.expenseAmount}</p>}
                  </div>
                  <div>
                    <label htmlFor="expense-category" className="text-sm font-semibold text-slate-200 mb-1.5 block">Category</label>
                    <select
                      id="expense-category"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-4 py-3 text-sm text-white rounded-xl outline-none transition-all duration-300 bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
                    >
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0B1F3A] text-white">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-1.5 block">Type</label>
                    <div className="flex gap-3 pt-1">
                      {(["fixed", "variable"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewType(t)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                            newType === t
                              ? "border-[#8B5CF6]/50 text-white bg-[#6D5DFB]/20 shadow-[0_0_12px_rgba(109,93,251,0.2)]"
                              : "border-white/10 text-slate-300 glass-surface hover:border-white/20 hover:text-white"
                          }`}
                          aria-pressed={newType === t}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 glass-control"
                  >
                    {editingId ? "Save Changes" : "Add Expense"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setNewName("");
                        setNewAmount("");
                        setNewCategory("Other");
                        setNewType("fixed");
                      }}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 glass-surface border-white/10 hover:text-white transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </ScrollReveal>

            {/* Expense list */}
            <ScrollReveal direction="up" delay={150}>
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">
                    Expenses <span className="text-slate-300 font-normal text-sm">({expenses.length})</span>
                  </h2>
                  <span className="text-xs text-slate-300">
                    Fixed {formatCurrency(fixedTotal)} · Variable {formatCurrency(variableTotal)}
                  </span>
                </div>

                {expenses.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <div className="text-5xl mb-4 opacity-80" aria-hidden="true">🌱</div>
                    <h3 className="text-lg font-bold text-white mb-2">Start Your Budget</h3>
                    <p className="text-sm text-slate-300 max-w-[280px] mx-auto leading-relaxed">
                      You haven&apos;t added any expenses yet. Use the form above to add your fixed and variable costs, and see how they fit into your monthly income.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-4 rounded-2xl glass-surface border-white/5 hover:border-white/10 transition-all duration-300 group"
                      >
                        <span
                          className="w-2 h-8 rounded-full flex-shrink-0"
                          style={{ background: CATEGORY_COLORS[entry.category] || "#94A3B8" }}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{entry.name}</div>
                          <div className="text-xs text-slate-300">
                            {entry.category} · {entry.type === "fixed" ? "Fixed" : "Variable"}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-white">{formatCurrency(entry.amount)}</div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                            aria-label={`Edit ${entry.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-950/50 transition-colors text-slate-300 hover:text-rose-400"
                            aria-label={`Delete ${entry.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* ── RIGHT: Charts + Breakdown ── */}
          <div className="space-y-8">
            {/* Donut chart */}
            <ScrollReveal direction="up" delay={100}>
              <div className="glass-panel rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Spending Breakdown</h2>
                <DonutChart
                  slices={donutSlices}
                  centerLabel={incomeNum > 0 ? "of income" : ""}
                  centerValue={incomeNum > 0 ? `${pct(totalExpenses, incomeNum).toFixed(0)}%` : "—"}
                />

                {/* Legend */}
                {donutSlices.filter(s => s.value > 0).length > 0 && (
                  <div className="mt-5 space-y-2">
                    {donutSlices.filter(s => s.value > 0).map(s => (
                      <BreakdownRow
                        key={s.label}
                        label={s.label}
                        amount={s.value}
                        percentage={pct(s.value, incomeNum || (totalExpenses + savingsAllocation))}
                        color={s.color}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Budget allocation bar */}
            <ScrollReveal direction="up" delay={150}>
              <div className="glass-panel rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Budget Allocation</h2>
                {incomeNum > 0 ? (
                  <>
                    {/* Stacked horizontal bar */}
                    <div className="h-3 rounded-full overflow-hidden flex mb-5 bg-white/5">
                      {fixedTotal > 0 && (
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${pct(fixedTotal, incomeNum)}%`, background: "#4F46E5" }}
                          title={`Fixed: ${formatCurrency(fixedTotal)}`}
                        />
                      )}
                      {variableTotal > 0 && (
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${pct(variableTotal, incomeNum)}%`, background: "#F59E0B" }}
                          title={`Variable: ${formatCurrency(variableTotal)}`}
                        />
                      )}
                      {savingsAllocation > 0 && (
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${pct(savingsAllocation, incomeNum)}%`, background: "#8B5CF6" }}
                          title={`Savings: ${formatCurrency(savingsAllocation)}`}
                        />
                      )}
                    </div>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: "#4F46E5" }} aria-hidden="true" />
                        <span className="text-slate-300 flex-1">Fixed</span>
                        <span className="font-semibold text-white">{formatCurrency(fixedTotal)}</span>
                        <span className="text-slate-300 w-12 text-right">{pct(fixedTotal, incomeNum).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: "#F59E0B" }} aria-hidden="true" />
                        <span className="text-slate-300 flex-1">Variable</span>
                        <span className="font-semibold text-white">{formatCurrency(variableTotal)}</span>
                        <span className="text-slate-300 w-12 text-right">{pct(variableTotal, incomeNum).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: "#8B5CF6" }} aria-hidden="true" />
                        <span className="text-slate-300 flex-1">Savings</span>
                        <span className="font-semibold text-white">{formatCurrency(savingsAllocation)}</span>
                        <span className="text-slate-300 w-12 text-right">{pct(savingsAllocation, incomeNum).toFixed(0)}%</span>
                      </div>
                      <div className="border-t border-white/5 pt-2.5 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: remaining >= 0 ? "#8B5CF6" : "#EF4444" }} aria-hidden="true" />
                        <span className="text-slate-200 flex-1 font-semibold">
                          {remaining >= 0 ? "Remaining" : "Over Budget"}
                        </span>
                        <span className="font-bold" style={{ color: remaining >= 0 ? "#8B5CF6" : "#EF4444" }}>
                          ${formatCurrency(Math.abs(remaining))}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-300 text-center py-6">Enter your income to see allocation.</p>
                )}
              </div>
            </ScrollReveal>

            {/* 50/30/20 guide */}
            <ScrollReveal direction="up" delay={200}>
              <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                     style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }} aria-hidden="true" />
                <h3 className="text-base font-bold mb-2 relative z-10 text-white">The 50/30/20 Rule</h3>
                <p className="text-xs leading-relaxed relative z-10 mb-5 text-slate-300">
                  Split after-tax income: 50% needs, 30% wants, 20% savings &amp; debt.
                </p>
                <div className="flex gap-6 relative z-10">
                  {[{ pct: "50%", label: "Needs" }, { pct: "30%", label: "Wants" }, { pct: "20%", label: "Save" }].map((b) => (
                    <div key={b.label}>
                      <div className="text-2xl font-black text-[#8B5CF6]">{b.pct}</div>
                      <div className="text-[10px] uppercase tracking-wider mt-0.5 text-slate-300">{b.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Warning for over-budget */}
        {remaining < 0 && incomeNum > 0 && (
          <div
            className="mt-8 flex items-center gap-3 glass-danger rounded-2xl px-5 py-4 text-sm text-rose-300 font-medium"
            role="alert"
          >
            <span className="text-lg flex-shrink-0" aria-hidden="true">⚠️</span>
            <span>
              <strong>Over budget by {formatCurrency(Math.abs(remaining))}.</strong>{" "}
              Your expenses and savings ({savingsRateNum}%) exceed your income. Consider reducing expenses or adjusting your savings rate.
            </span>
          </div>
        )}

        {/* ── Data & Privacy ── */}
        <ScrollReveal direction="up" delay={50}>
          <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(109,93,251,0.15)", border: "1px solid rgba(109,93,251,0.25)" }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Data &amp; Privacy</h2>
                <p className="text-xs text-slate-400 mt-0.5">Export or permanently clear your local FinWise data.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Export JSON */}
              <button
                type="button"
                id="btn-export-json"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(109,93,251,0.18)",
                  border: "1px solid rgba(109,93,251,0.35)",
                }}
                aria-label="Export budget data as JSON file"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Data (JSON)
              </button>

              {/* Export CSV */}
              <button
                type="button"
                id="btn-export-csv"
                onClick={handleExportCSV}
                disabled={expenses.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: expenses.length === 0 ? "#94A3B8" : "#E0E7FF",
                }}
                title={expenses.length === 0 ? "Add expenses first to export CSV" : "Download budget breakdown as CSV"}
                aria-label={expenses.length === 0 ? "Export as CSV — add expenses first" : "Export expense breakdown as CSV"}
                aria-disabled={expenses.length === 0}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                Export as CSV
              </button>

              {/* Spacer pushes danger button right on wide screens */}
              <div className="flex-1 hidden sm:block" aria-hidden="true" />

              {/* Reset App Data */}
              <button
                type="button"
                id="btn-reset-app-data"
                onClick={() => setResetModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(220,38,38,0.10)",
                  border: "1px solid rgba(220,38,38,0.28)",
                  color: "#FCA5A5",
                }}
                aria-label="Reset all app data — opens confirmation dialog"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Reset App Data
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Reset confirmation modal ── */}
      <ResetConfirmModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetAll}
      />
    </div>
  );
}
