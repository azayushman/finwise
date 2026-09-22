import React, { useState, useEffect } from "react";
import {
  Target,
  Plus,
  TrendingUp,
  Trash2,
  CheckCircle2,
  Calendar,
  Landmark,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { SavingsGoal, UserProfile } from "../types";
import { formatCurrency } from "../utils/currency";

interface SavingsViewProps {
  user: UserProfile;
}

export const SavingsView: React.FC<SavingsViewProps> = ({ user }) => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      title: "6-Month Defensive Emergency Reserve",
      targetAmount: 120000,
      currentAmount: 75000,
      targetDate: "2026-12-31",
      category: "Emergency",
    },
    {
      id: "2",
      title: "High-Performance Workstation",
      targetAmount: 95000,
      currentAmount: 62000,
      targetDate: "2026-10-15",
      category: "Tech",
    },
    {
      id: "3",
      title: "Broad Market Index Fund Allocation",
      targetAmount: 25000,
      currentAmount: 25000,
      targetDate: "2026-08-01",
      category: "Investment",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newCurrent, setNewCurrent] = useState("");
  const [newDate, setNewDate] = useState("2027-03-31");
  const [newCat, setNewCat] = useState<SavingsGoal["category"]>("Emergency");

  const sym = user.currencySymbol || "$";

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("finwise_savings_goals");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGoals(parsed);
        }
      } catch (e) {
        console.error("Failed to parse savings goals", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("finwise_savings_goals", JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(newTarget);
    const currentNum = parseFloat(newCurrent) || 0;

    if (!newTitle.trim() || isNaN(targetNum) || targetNum <= 0) return;

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      targetAmount: targetNum,
      currentAmount: Math.min(targetNum, currentNum),
      targetDate: newDate,
      category: newCat,
    };

    setGoals((prev) => [newGoal, ...prev]);
    setNewTitle("");
    setNewTarget("");
    setNewCurrent("");
    setShowAddForm(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleDeposit = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updated = Math.min(g.targetAmount, g.currentAmount + amount);
        return { ...g, currentAmount: updated };
      })
    );
  };

  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-500/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-300">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Capital Reserves & Sinking Funds</span>
          </div>
          <h1 className="text-3xl font-black text-white font-wallstreet tracking-tight">
            Liquidity <span className="gold-gradient-text">Milestones</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build defensive emergency reserves and targeted sinking funds before expanding equity exposure.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-amber-950/40"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{showAddForm ? "Cancel Entry" : "Create Reserve Target"}</span>
        </button>
      </div>

      {/* Aggregate Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-amber-500/25 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300/90 font-wallstreet">
              Total Capital Reserved
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-data mt-1">
              {formatCurrency(totalSaved, sym, true)}{" "}
              <span className="text-sm font-semibold text-slate-400">/ {formatCurrency(totalTarget, sym, true)}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-300 font-data">{overallProgress}%</span>
            <span className="block text-[11px] text-slate-400 font-medium">Cumulative Horizon Completed</span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-[#0E121B] overflow-hidden border border-slate-800">
          <div
            style={{ width: `${overallProgress}%` }}
            className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-500"
          />
        </div>
      </div>

      {/* Add Goal Modal / Inline Form */}
      {showAddForm && (
        <div className="glass-panel rounded-3xl p-6 mb-8 border border-amber-500/30 shadow-2xl animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-white font-wallstreet mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            Establish New Reserve Target
          </h3>

          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reserve Objective
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Month Emergency Cushion, Laptop Sinking Fund"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Asset Category
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none cursor-pointer"
                >
                  <option value="Emergency">Emergency Buffer (Cash / Treasury)</option>
                  <option value="Investment">Broad Market Investment Pool</option>
                  <option value="Education">Education & Certifications</option>
                  <option value="Tech">Hardware & Infrastructure</option>
                  <option value="Travel">Discretionary Sinking Fund</option>
                  <option value="Other">Other Capital Reserve</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Target Capital ({sym})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="100000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white font-data placeholder-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Initial Capital ({sym})
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="15000"
                  value={newCurrent}
                  onChange={(e) => setNewCurrent(e.target.value)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white font-data placeholder-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Target Maturity Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#0E121B] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] transition-all cursor-pointer shadow-md"
              >
                Confirm Target
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
          const isDone = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`glass-panel rounded-3xl p-6 transition-all duration-200 border ${
                isDone
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : "border-slate-800 hover:border-amber-500/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-wallstreet">
                    {goal.category}
                  </span>
                  <h3 className="text-base font-bold text-white font-wallstreet mt-1.5">{goal.title}</h3>
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                  aria-label="Delete goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Amount progress with guaranteed clean currency format */}
              <div className="flex items-baseline justify-between text-xs font-semibold mb-2">
                <span className="text-white font-data text-sm">
                  {formatCurrency(goal.currentAmount, sym, true)}
                </span>
                <span className="text-slate-400 font-data">
                  of {formatCurrency(goal.targetAmount, sym, true)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-[#0E121B] overflow-hidden border border-slate-800 mb-4">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDone ? "bg-emerald-400" : "bg-gradient-to-r from-[#D4AF37] to-[#F5D77F]"
                  }`}
                />
              </div>

              {/* Quick capital deposit buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Add:</span>
                  <button
                    onClick={() => handleDeposit(goal.id, 1000)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-200 glass-surface border-slate-700 hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    +{formatCurrency(1000, sym)}
                  </button>
                  <button
                    onClick={() => handleDeposit(goal.id, 5000)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-200 glass-surface border-slate-700 hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    +{formatCurrency(5000, sym)}
                  </button>
                </div>

                {isDone ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Target Achieved
                  </span>
                ) : (
                  <span className="text-[11px] font-data text-amber-300 font-bold">{pct}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
