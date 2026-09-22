import React, { useState, useEffect } from "react";
import {
  PieChart,
  Plus,
  Trash2,
  TrendingUp,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Landmark,
  Building2,
} from "lucide-react";
import { ExpenseCategory, Transaction, UserProfile } from "../types";
import { formatCurrency } from "../utils/currency";

interface BudgetViewProps {
  user: UserProfile;
  onBudgetUpdated: (income: number, expenses: Transaction[]) => void;
  onNavigateToAssistant: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  "Housing",
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Subscriptions",
  "Personal Care",
  "Debt Payment",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#38BDF8",
  Food: "#F59E0B",
  Transport: "#FACC15",
  Utilities: "#06B6D4",
  Entertainment: "#EC4899",
  Healthcare: "#10B981",
  Education: "#A78BFA",
  Subscriptions: "#D946EF",
  "Personal Care": "#818CF8",
  "Debt Payment": "#EF4444",
  Other: "#94A3B8",
};

export const BudgetView: React.FC<BudgetViewProps> = ({
  user,
  onBudgetUpdated,
  onNavigateToAssistant,
}) => {
  const [income, setIncome] = useState<number>(45000);
  const [savingsRate, setSavingsRate] = useState<number>(20);
  const [expenses, setExpenses] = useState<Transaction[]>([
    { id: "1", name: "Apartment Rent & Society", amount: 15000, type: "expense", category: "Housing", date: "2026-09-01" },
    { id: "2", name: "Groceries & Food", amount: 6500, type: "expense", category: "Food", date: "2026-09-03" },
    { id: "3", name: "Metro / Fuel Travel", amount: 3000, type: "expense", category: "Transport", date: "2026-09-05" },
    { id: "4", name: "Internet & Utilities", amount: 1200, type: "expense", category: "Utilities", date: "2026-09-07" },
    { id: "5", name: "Streaming Subscriptions", amount: 800, type: "expense", category: "Subscriptions", date: "2026-09-08" },
    { id: "6", name: "Dining Out & Cafes", amount: 3500, type: "expense", category: "Entertainment", date: "2026-09-10" },
  ]);

  // Form input state
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("Food");

  const sym = user.currencySymbol || "$";

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("finwise_budget_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.income) setIncome(parsed.income);
        if (parsed.savingsRate) setSavingsRate(parsed.savingsRate);
        if (Array.isArray(parsed.expenses) && parsed.expenses.length > 0) {
          setExpenses(parsed.expenses);
        }
      } catch (e) {
        console.error("Could not load budget data", e);
      }
    }
  }, []);

  // Save changes & notify parent
  useEffect(() => {
    localStorage.setItem(
      "finwise_budget_data",
      JSON.stringify({ income, savingsRate, expenses })
    );
    onBudgetUpdated(income, expenses);
  }, [income, savingsRate, expenses, onBudgetUpdated]);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const savingsAllocation = Math.round((income * savingsRate) / 100);
  const remaining = income - totalExpenses - savingsAllocation;

  // Handle adding expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newItem: Transaction = {
      id: Date.now().toString(),
      name: newTitle.trim(),
      amount: parsedAmount,
      type: "expense",
      category: newCategory,
      date: new Date().toISOString().split("T")[0],
    };

    setExpenses((prev) => [newItem, ...prev]);
    setNewTitle("");
    setNewAmount("");
  };

  // Handle removing expense
  const handleRemoveExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate breakdown by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-500/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>50/30/20 Capital Allocation Architecture</span>
          </div>
          <h1 className="text-3xl font-black text-white font-wallstreet tracking-tight">
            Operating <span className="gold-gradient-text">Budget Blueprint</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Map every unit of capital before deployment. Automatically synchronizes with your balance sheet and Wall Street Advisor.
          </p>
        </div>

        <button
          onClick={onNavigateToAssistant}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-950/40"
        >
          <Landmark className="w-3.5 h-3.5 text-slate-950" />
          <span>Review with Wall Street Advisor</span>
        </button>
      </div>

      {/* Top Level Metric Cards (Clean currency, no '$$') */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Income Card */}
        <div className="glass-panel rounded-3xl p-5 space-y-2 border border-slate-700/40 hover:border-amber-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 font-wallstreet">
            <span>Monthly Inflow</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-data">{sym}</span>
            <input
              type="number"
              min="0"
              value={income}
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent text-2xl font-black text-white font-data focus:outline-none border-b border-transparent focus:border-amber-400"
            />
          </div>
          <span className="text-[10px] text-slate-500">Edit income to dynamically adjust</span>
        </div>

        {/* Expenses Total */}
        <div className="glass-panel rounded-3xl p-5 space-y-2 border border-slate-700/40 hover:border-rose-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 font-wallstreet">
            <span>Operating Outflow</span>
            <PieChart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300 font-data">
            {formatCurrency(totalExpenses, sym, true)}
          </div>
          <span className="text-[10px] text-slate-400">
            {Math.round((totalExpenses / (income || 1)) * 100)}% of monthly earnings
          </span>
        </div>

        {/* Planned Savings */}
        <div className="glass-panel rounded-3xl p-5 space-y-2 border border-slate-700/40 hover:border-amber-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 font-wallstreet">
            <span>Reserve Allocation ({savingsRate}%)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-data">
            {formatCurrency(savingsAllocation, sym, true)}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="50"
              value={savingsRate}
              onChange={(e) => setSavingsRate(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Remaining Unallocated */}
        <div className="glass-panel rounded-3xl p-5 space-y-2 border border-slate-700/40 hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 font-wallstreet">
            <span>Surplus Balance</span>
            {remaining >= 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div
            className={`text-2xl font-black font-data ${
              remaining >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatCurrency(remaining, sym, true)}
          </div>
          <span className="text-[10px] text-slate-400">
            {remaining >= 0
              ? "All liabilities balanced"
              : "Deficit warning: exceeds inflow"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Expense List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Add Expense Form */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/20">
            <h3 className="text-base font-bold text-white font-wallstreet mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              Register Capital Expenditure
            </h3>

            <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health Insurance, Broadband"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Amount ({sym})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="2500"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white font-data placeholder-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0E121B] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-12 pt-1 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-950" />
                  <span>Append to Ledger</span>
                </button>
              </div>
            </form>
          </div>

          {/* Ledger Table */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-wallstreet">
                Logged Outflows ({expenses.length})
              </h3>
              <span className="text-xs text-slate-400">
                Sorted by most recent
              </span>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No expenditures registered yet. Use the form above to add items.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {expenses.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[item.category] || "#94A3B8" }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.category} • {item.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-rose-300 font-data">
                        -{formatCurrency(item.amount, sym, true)}
                      </span>
                      <button
                        onClick={() => handleRemoveExpense(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                        title="Delete expense entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Breakdown & Wall Street Advisory */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
            <h3 className="text-base font-bold text-white font-wallstreet flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              Allocation by Category
            </h3>

            {expenses.length === 0 ? (
              <p className="text-xs text-slate-500">No data available.</p>
            ) : (
              <div className="space-y-3 pt-2">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amt]) => {
                    const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                    const color = CATEGORY_COLORS[cat] || "#94A3B8";
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            {cat}
                          </span>
                          <span className="text-white font-data text-[11px]">
                            {formatCurrency(amt, sym)} <span className="text-slate-500">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            style={{ width: `${pct}%`, backgroundColor: color }}
                            className="h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="glass-panel rounded-3xl p-6 bg-[#0E121B] border border-amber-500/20">
            <h4 className="text-xs font-bold text-white font-wallstreet uppercase tracking-wider mb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              Wall Street Ledger Ready
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your budget of {formatCurrency(income, sym)} and {expenses.length} outflow lines are securely stored and structured for analysis in your <strong>Advisory Ledger</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
