"use client";

import { useState, useCallback, useId } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
  Housing: "#4A80BF", Transport: "#F59E0B", Food: "#00C896",
  Utilities: "#8B5CF6", Insurance: "#EC4899", Healthcare: "#EF4444",
  Entertainment: "#F97316", Subscriptions: "#6366F1", Clothing: "#14B8A6",
  Education: "#2E5F9A", "Dining Out": "#D97706", "Personal Care": "#A855F7",
  "Debt Payment": "#DC2626", Other: "#6B7280",
};

/* ══════════════════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════════════════ */

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min((part / total) * 100, 100);
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
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
      <div className="flex items-center justify-center h-52 text-sm text-slate-400">
        Add expenses to see chart
      </div>
    );
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <svg viewBox="0 0 120 120" className="w-full max-w-[220px] mx-auto" aria-hidden="true">
      {slices.filter(s => s.value > 0).map((slice) => {
        const fraction = slice.value / total;
        const dashLen = fraction * circumference;
        const dashOff = -cumulative * circumference;
        cumulative += fraction;
        return (
          <circle
            key={slice.label}
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth="14"
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={dashOff}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease" }}
          />
        );
      })}
      <text x="60" y="55" textAnchor="middle" className="fill-slate-900 text-[10px] font-bold">{centerValue}</text>
      <text x="60" y="67" textAnchor="middle" className="fill-slate-400 text-[6px]">{centerLabel}</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Horizontal bar row
   ══════════════════════════════════════════════════════════════════════════ */

function BreakdownRow({ label, amount, percentage, color }: {
  label: string; amount: number; percentage: number; color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-sm text-slate-700 flex-1 truncate">{label}</span>
      <span className="text-xs text-slate-400 w-10 text-right">{percentage.toFixed(0)}%</span>
      <span className="text-sm font-semibold text-slate-900 w-20 text-right">${fmt(amount)}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════════════ */

export function BudgetClient() {
  /* ── State ── */
  const [income, setIncome] = useState<string>("");
  const [savingsRate, setSavingsRate] = useState<string>("20");
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  // New expense form
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("Other");
  const [newType, setNewType] = useState<"fixed" | "variable">("fixed");
  const [editingId, setEditingId] = useState<string | null>(null);

  const incomeId = useId();
  const savingsId = useId();

  /* ── Derived values ── */
  const incomeNum = parseFloat(income) || 0;
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
      label, value, color: CATEGORY_COLORS[label] || "#6B7280",
    })),
    ...(savingsAllocation > 0 ? [{ label: "Savings", value: savingsAllocation, color: "#00C896" }] : []),
    ...(remaining > 0 ? [{ label: "Unallocated", value: remaining, color: "#E2E8F0" }] : []),
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
      : isNaN(amtNum) || amtNum <= 0
        ? "Enter a positive number."
        : undefined;

    if (nameErr || amtErr) {
      setErrors(prev => ({ ...prev, expenseName: nameErr, expenseAmount: amtErr }));
      return;
    }

    if (editingId) {
      setExpenses(prev => prev.map(e =>
        e.id === editingId
          ? { ...e, name: newName.trim(), amount: amtNum, category: newCategory, type: newType }
          : e
      ));
      setEditingId(null);
    } else {
      setExpenses(prev => [
        ...prev,
        { id: genId(), name: newName.trim(), amount: amtNum, category: newCategory, type: newType },
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

  /* ── Summary cards ── */
  const summaryCards = [
    { label: "Monthly Income", value: incomeNum, color: "#00C896", icon: "💰" },
    { label: "Total Expenses", value: totalExpenses, color: "#4A80BF", icon: "📋" },
    { label: "Savings", value: savingsAllocation, color: "#8B5CF6", icon: "💎" },
    { label: "Remaining", value: remaining, color: remaining < 0 ? "#EF4444" : "#00C896", icon: remaining < 0 ? "⚠️" : "✨" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <AmbientBackground variant="dark" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionLabel>Budget Planner</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Build Your<br />
            <span className="gradient-text">Perfect Budget.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#A8C5E8" }}>
            Create a personalised monthly budget. Track where your money goes and
            find areas to save more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Summary Cards ── */}
        <ScrollReveal direction="up" className="mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((c) => (
              <div
                key={c.label}
                className="bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" aria-hidden="true">{c.icon}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.label}</span>
                </div>
                <div className="text-2xl font-black" style={{ color: c.color }}>
                  ${fmt(c.value)}
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900">Income & Savings</h2>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Reset budget
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Income */}
                  <div>
                    <label htmlFor={incomeId} className="text-sm font-semibold text-slate-700 mb-1.5 block">
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
                      className={`w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 ${
                        errors.income
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
                      }`}
                    />
                    {errors.income && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.income}</p>}
                  </div>
                  {/* Savings rate */}
                  <div>
                    <label htmlFor={savingsId} className="text-sm font-semibold text-slate-700 mb-1.5 block">
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
                      className={`w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 ${
                        errors.savings
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
                      }`}
                    />
                    {errors.savings && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.savings}</p>}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Add Expense Form */}
            <ScrollReveal direction="up" delay={100}>
              <form
                className="bg-white border border-slate-200 rounded-2xl p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddExpense();
                }}
              >
                <h2 className="text-lg font-bold text-slate-900 mb-5">
                  {editingId ? "Edit Expense" : "Add Expense"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Rent"
                      className={`w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 ${
                        errors.expenseName
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
                      }`}
                    />
                    {errors.expenseName && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.expenseName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Amount ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value)}
                      placeholder="e.g. 1200"
                      className={`w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 ${
                        errors.expenseAmount
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
                      }`}
                    />
                    {errors.expenseAmount && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.expenseAmount}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-150 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
                    >
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Type</label>
                    <div className="flex gap-3 pt-2">
                      {(["fixed", "variable"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewType(t)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                            newType === t
                              ? "border-[#00C896] text-[#00C896] bg-[#00C896]/5"
                              : "border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
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
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </ScrollReveal>

            {/* Expense list */}
            <ScrollReveal direction="up" delay={150}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Expenses ({expenses.length})
                  </h2>
                  <span className="text-xs text-slate-400">
                    Fixed ${fmt(fixedTotal)} · Variable ${fmt(variableTotal)}
                  </span>
                </div>

                {expenses.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <span className="text-3xl block mb-2">📋</span>
                    <p className="text-sm">No expenses yet. Add your first expense above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group"
                      >
                        <span
                          className="w-2 h-8 rounded-full flex-shrink-0"
                          style={{ background: CATEGORY_COLORS[entry.category] || "#6B7280" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">{entry.name}</div>
                          <div className="text-xs text-slate-400">
                            {entry.category} · {entry.type === "fixed" ? "Fixed" : "Variable"}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-900">${fmt(entry.amount)}</div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                            aria-label={`Edit ${entry.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500"
                            aria-label={`Delete ${entry.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Spending Breakdown</h2>
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Budget Allocation</h2>
                {incomeNum > 0 ? (
                  <>
                    {/* Stacked horizontal bar */}
                    <div className="h-4 rounded-full overflow-hidden flex mb-4" style={{ background: "#E2E8F0" }}>
                      {fixedTotal > 0 && (
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${pct(fixedTotal, incomeNum)}%`, background: "#4A80BF" }}
                          title={`Fixed: $${fmt(fixedTotal)}`}
                        />
                      )}
                      {variableTotal > 0 && (
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${pct(variableTotal, incomeNum)}%`, background: "#F59E0B" }}
                          title={`Variable: $${fmt(variableTotal)}`}
                        />
                      )}
                      {savingsAllocation > 0 && (
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${pct(savingsAllocation, incomeNum)}%`, background: "#8B5CF6" }}
                          title={`Savings: $${fmt(savingsAllocation)}`}
                        />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ background: "#4A80BF" }} />
                        <span className="text-slate-600 flex-1">Fixed</span>
                        <span className="font-semibold">${fmt(fixedTotal)}</span>
                        <span className="text-slate-400 w-12 text-right">{pct(fixedTotal, incomeNum).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ background: "#F59E0B" }} />
                        <span className="text-slate-600 flex-1">Variable</span>
                        <span className="font-semibold">${fmt(variableTotal)}</span>
                        <span className="text-slate-400 w-12 text-right">{pct(variableTotal, incomeNum).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ background: "#8B5CF6" }} />
                        <span className="text-slate-600 flex-1">Savings</span>
                        <span className="font-semibold">${fmt(savingsAllocation)}</span>
                        <span className="text-slate-400 w-12 text-right">{pct(savingsAllocation, incomeNum).toFixed(0)}%</span>
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ background: remaining >= 0 ? "#00C896" : "#EF4444" }} />
                        <span className="text-slate-600 flex-1 font-semibold">
                          {remaining >= 0 ? "Remaining" : "Over Budget"}
                        </span>
                        <span className="font-bold" style={{ color: remaining >= 0 ? "#00C896" : "#EF4444" }}>
                          ${fmt(Math.abs(remaining))}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-6">Enter your income to see allocation.</p>
                )}
              </div>
            </ScrollReveal>

            {/* 50/30/20 guide */}
            <ScrollReveal direction="up" delay={200}>
              <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
                     style={{ background: "radial-gradient(circle, #00C896, transparent 70%)" }} aria-hidden="true" />
                <h3 className="text-base font-bold mb-2 relative z-10">The 50/30/20 Rule</h3>
                <p className="text-xs leading-relaxed relative z-10 mb-4" style={{ color: "#A8C5E8" }}>
                  Split after-tax income: 50% needs, 30% wants, 20% savings & debt.
                </p>
                <div className="flex gap-6 relative z-10">
                  {[{ pct: "50%", label: "Needs" }, { pct: "30%", label: "Wants" }, { pct: "20%", label: "Save" }].map((b) => (
                    <div key={b.label}>
                      <div className="text-2xl font-black" style={{ color: "#00C896" }}>{b.pct}</div>
                      <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "#A8C5E8" }}>{b.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Warning for over-budget */}
        {remaining < 0 && incomeNum > 0 && (
          <div className="mt-8 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 font-medium">
            <span className="text-lg">⚠️</span>
            <span>
              <strong>Over budget by ${fmt(Math.abs(remaining))}.</strong>{" "}
              Your expenses and savings ({savingsRateNum}%) exceed your income. Consider reducing expenses or adjusting your savings rate.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
