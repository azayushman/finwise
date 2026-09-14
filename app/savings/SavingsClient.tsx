"use client";

import { useState, useCallback, useId, useMemo } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ══════════════════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════════════════ */

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
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

function monthsUntil(dateStr: string): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diff = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  return Math.max(diff, 0);
}

/* ══════════════════════════════════════════════════════════════════════════
   Circular Progress (SVG)
   ══════════════════════════════════════════════════════════════════════════ */

function CircularProgress({ percentage, color, size = 180 }: {
  percentage: number; color: string; size?: number;
}) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.max(0, Math.min(100, percentage));
  const dashLen = (clampedPct / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 180 180" className="mx-auto" aria-hidden="true">
      {/* Background track */}
      <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
      {/* Progress arc */}
      <circle
        cx="90" cy="90" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${dashLen} ${circumference - dashLen}`}
        strokeDashoffset={circumference / 4}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22,1,0.36,1)", filter: `drop-shadow(0 0 6px ${color}44)` }}
      />
      {/* Center text */}
      <text x="90" y="82" textAnchor="middle" className="fill-white text-[28px] font-bold">
        {clampedPct.toFixed(0)}%
      </text>
      <text x="90" y="102" textAnchor="middle" className="fill-[#94A3B8] text-[11px] font-medium">
        complete
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Compound Interest Projection
   ══════════════════════════════════════════════════════════════════════════ */

function compoundGrowth(principal: number, monthlyAdd: number, annualRate: number, months: number): number {
  if (months <= 0) return principal;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal + monthlyAdd * months;
  const factor = Math.pow(1 + r, months);
  // Guard against non-finite results from extreme inputs
  if (!Number.isFinite(factor)) return principal + monthlyAdd * months;
  const result = principal * factor + monthlyAdd * ((factor - 1) / r);
  return Number.isFinite(result) ? result : principal + monthlyAdd * months;
}

/* ══════════════════════════════════════════════════════════════════════════
   Input Field Helper
   ══════════════════════════════════════════════════════════════════════════ */

function InputBlock({
  id, label, value, onChange, onBlur, error, type = "number", placeholder, min, max, step, prefix, suffix
}: {
  id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void; error?: string; type?: string; placeholder: string;
  min?: string; max?: string; step?: string; prefix?: string; suffix?: string;
}) {
  const hasError = Boolean(error);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-200 mb-1.5 block">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-300 pointer-events-none">{prefix}</span>
        )}
        <input
          id={id}
          type={type}
          min={min} max={max} step={step}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={hasError}
          className={`w-full py-3 text-sm text-white rounded-xl outline-none transition-all duration-300 bg-white/5 border placeholder:text-slate-300/60 ${
            prefix ? "pl-8 pr-4" : suffix ? "pl-4 pr-8" : "px-4"
          } ${
            hasError
              ? "border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              : "border-white/10 hover:border-white/15 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
          }`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-300 pointer-events-none">{suffix}</span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-400 font-medium" role="alert">{error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════════════ */

export function SavingsClient() {
  /* ── State ── */
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContrib, setMonthlyContrib] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [annualRate, setAnnualRate] = useState("5");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const goalId = useId();
  const targetId = useId();
  const currentId = useId();
  const monthlyId = useId();
  const dateId = useId();
  const rateId = useId();

  /* ── Parsed numbers ── */
  // Clamp parsed inputs to safe ranges to prevent NaN / infinite-loop scenarios
  const targetNum  = safeNum(targetAmount,  0, 100_000_000);
  const currentNum = safeNum(currentSavings, 0, 100_000_000);
  const monthlyNum = safeNum(monthlyContrib, 0, 100_000_000);
  // Rate: allow 0 (no growth) up to 100%; user can type 0 but we use 0 in math safely
  const rateNum    = safeNum(annualRate, 0, 100);
  const remaining  = Math.max(0, targetNum - currentNum);
  const progressPct = targetNum > 0 ? Math.min((currentNum / targetNum) * 100, 100) : 0;

  /* ── Date-based calculations ── */
  const monthsLeft = monthsUntil(targetDate);
  const requiredMonthly = monthsLeft > 0 ? remaining / monthsLeft : 0;

  /* ── Time to reach goal with current monthly contribution ── */
  const monthsToGoal = useMemo(() => {
    if (remaining <= 0) return 0;
    if (monthlyNum <= 0) return Infinity;
    const r = rateNum / 100 / 12;
    if (r <= 0) return Math.ceil(remaining / monthlyNum);
    const monthlyOverR = monthlyNum / r;
    const numerator = targetNum + monthlyOverR;
    const denominator = currentNum + monthlyOverR;
    if (denominator <= 0 || numerator <= 0) return Infinity;
    const ratio = numerator / denominator;
    // Guard: log of non-positive or non-finite ratio is NaN
    if (!Number.isFinite(ratio) || ratio <= 0) return Infinity;
    const n = Math.log(ratio) / Math.log(1 + r);
    if (!Number.isFinite(n)) return Infinity;
    return Math.ceil(Math.max(0, n));
  }, [remaining, monthlyNum, rateNum, targetNum, currentNum]);

  const estimatedDate = useMemo(() => {
    if (monthsToGoal === 0) return "Already reached!";
    if (monthsToGoal === Infinity) return "—";
    const d = new Date();
    d.setMonth(d.getMonth() + monthsToGoal);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [monthsToGoal]);

  /* ── Compound growth projections ── */
  const projections = useMemo(() => {
    return [12, 24, 60, 120].map(m => ({
      months: m,
      label: m < 24 ? `${m} mo` : `${m / 12} yr`,
      value: compoundGrowth(currentNum, monthlyNum, rateNum, m),
    }));
  }, [currentNum, monthlyNum, rateNum]);

  /* ── Validation ── */
  const validate = useCallback((field: string, value: string) => {
    const n = parseFloat(value);
    if (field === "targetAmount" || field === "monthlyContrib") {
      if (!value.trim()) return `This field is required.`;
      if (isNaN(n) || n < 0) return "Enter a valid non-negative number.";
    }
    if (field === "currentSavings") {
      if (value.trim() && (isNaN(n) || n < 0)) return "Enter a valid non-negative number.";
    }
    if (field === "annualRate") {
      if (isNaN(n) || n < 0 || n > 100) return "Enter a rate between 0 and 100.";
    }
    return undefined;
  }, []);

  function setField(field: string, value: string, setter: (v: string) => void) {
    setter(value);
    setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
  }

  function handleReset() {
    setGoalName(""); setTargetAmount(""); setCurrentSavings("");
    setMonthlyContrib(""); setTargetDate(""); setAnnualRate("5");
    setErrors({});
  }

  /* ── Status message ── */
  const statusMessage = useMemo(() => {
    if (targetNum <= 0) return null;
    if (remaining <= 0) return { type: "success", text: "🎉 You've already reached your savings goal!" };
    if (monthlyNum <= 0) return { type: "info", text: "Enter a monthly contribution to see your timeline." };
    if (targetDate && monthsLeft > 0) {
      if (monthlyNum >= requiredMonthly) {
        return { type: "success", text: `On track! You're saving enough to reach your goal by your target date.` };
      } else {
        return {
          type: "warning",
          text: `You need $${fmt(requiredMonthly)}/mo to hit your target date. You're $${fmt(requiredMonthly - monthlyNum)}/mo short.`,
        };
      }
    }
    if (monthsToGoal < Infinity) {
      const years = Math.floor(monthsToGoal / 12);
      const months = monthsToGoal % 12;
      const timeStr = years > 0 ? `${years}y ${months}m` : `${months} months`;
      return { type: "info", text: `At your current rate, you'll reach your goal in ~${timeStr} (${estimatedDate}).` };
    }
    return null;
  }, [targetNum, remaining, monthlyNum, monthsLeft, requiredMonthly, monthsToGoal, estimatedDate, targetDate]);

  const progressColor = progressPct >= 100 ? "#8B5CF6" : progressPct >= 50 ? "#6D5DFB" : "#4F46E5";

  return (
    <div className="min-h-screen text-[#F5F7FF] relative">
      {/* ── Page-level ambient depth ── */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#8B5CF6]/8 rounded-full blur-[120px] -z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-[#4F46E5]/6 rounded-full blur-[100px] -z-10 pointer-events-none" aria-hidden="true" />

      {/* ── Hero / Header ── */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 glass-surface">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                Savings Goals
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white mb-4">
              Turn plans into<br />
              <span className="gradient-text">progress.</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed text-slate-300">
              Set goals, calculate timelines, and visualise the power of compound interest.
              Every dollar saved today is worth more tomorrow.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Inputs ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Goal setup */}
            <ScrollReveal direction="up">
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Savings Goal</h2>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-300 hover:text-rose-400 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Goal name – full width */}
                  <div className="sm:col-span-2">
                    <label htmlFor={goalId} className="text-sm font-semibold text-slate-200 mb-1.5 block">Goal Name</label>
                    <input
                      id={goalId}
                      type="text"
                      value={goalName}
                      onChange={e => setGoalName(e.target.value)}
                      placeholder="e.g. Emergency Fund"
                      className="w-full px-4 py-3 text-sm text-white rounded-xl outline-none transition-all duration-300 bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 placeholder:text-slate-300/60"
                    />
                  </div>

                  <InputBlock id={targetId} label="Target Amount" value={targetAmount}
                    onChange={e => setField("targetAmount", e.target.value, setTargetAmount)}
                    onBlur={() => setErrors(prev => ({ ...prev, targetAmount: validate("targetAmount", targetAmount) }))}
                    error={errors.targetAmount}
                    placeholder="e.g. 10000" min="0" step="0.01" prefix="$" />

                  <InputBlock id={currentId} label="Current Savings" value={currentSavings}
                    onChange={e => setField("currentSavings", e.target.value, setCurrentSavings)}
                    onBlur={() => setErrors(prev => ({ ...prev, currentSavings: validate("currentSavings", currentSavings) }))}
                    error={errors.currentSavings}
                    placeholder="e.g. 2500" min="0" step="0.01" prefix="$" />

                  <InputBlock id={monthlyId} label="Monthly Contribution" value={monthlyContrib}
                    onChange={e => setField("monthlyContrib", e.target.value, setMonthlyContrib)}
                    onBlur={() => setErrors(prev => ({ ...prev, monthlyContrib: validate("monthlyContrib", monthlyContrib) }))}
                    error={errors.monthlyContrib}
                    placeholder="e.g. 500" min="0" step="0.01" prefix="$" />

                  <InputBlock id={rateId} label="Expected Annual Return" value={annualRate}
                    onChange={e => setField("annualRate", e.target.value, setAnnualRate)}
                    onBlur={() => setErrors(prev => ({ ...prev, annualRate: validate("annualRate", annualRate) }))}
                    error={errors.annualRate}
                    placeholder="e.g. 5" min="0" max="50" step="0.1" suffix="%" />

                  <div>
                    <label htmlFor={dateId} className="text-sm font-semibold text-slate-200 mb-1.5 block">Target Date (optional)</label>
                    <input
                      id={dateId}
                      type="date"
                      value={targetDate}
                      onChange={e => setTargetDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 text-sm text-white rounded-xl outline-none transition-all duration-300 bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Status message */}
            {statusMessage && (
              <ScrollReveal direction="up" delay={50}>
                <div
                  role="status"
                  className={`flex items-start gap-3 rounded-2xl px-5 py-4 text-sm font-medium glass-surface ${
                    statusMessage.type === "success" ? "border-emerald-500/30 text-emerald-300" :
                    statusMessage.type === "warning" ? "border-amber-500/30 text-amber-300" :
                    "border-[#8B5CF6]/30 text-[#C4B5FD]"
                  }`}
                >
                  <span className="text-lg flex-shrink-0" aria-hidden="true">
                    {statusMessage.type === "success" ? "✅" : statusMessage.type === "warning" ? "⚠️" : "ℹ️"}
                  </span>
                  <span>{statusMessage.text}</span>
                </div>
              </ScrollReveal>
            )}

            {/* Growth Projection table */}
            <ScrollReveal direction="up" delay={100}>
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-white mb-5">Growth Projection</h2>
                {monthlyNum > 0 || currentNum > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left py-3 text-xs font-bold text-slate-300 uppercase tracking-wider">Period</th>
                          <th className="text-right py-3 text-xs font-bold text-slate-300 uppercase tracking-wider">Contributions</th>
                          <th className="text-right py-3 text-xs font-bold text-slate-300 uppercase tracking-wider">Interest</th>
                          <th className="text-right py-3 text-xs font-bold text-slate-300 uppercase tracking-wider">Total Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projections.map(p => {
                          const totalContrib = currentNum + monthlyNum * p.months;
                          const interest = p.value - totalContrib;
                          return (
                            <tr key={p.months} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                              <td className="py-3 font-semibold text-slate-200">{p.label}</td>
                              <td className="py-3 text-right text-slate-300">${fmtInt(totalContrib)}</td>
                              <td className="py-3 text-right text-[#8B5CF6] font-semibold">+${fmtInt(Math.max(0, interest))}</td>
                              <td className="py-3 text-right font-bold text-white">${fmtInt(p.value)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 text-center py-8">Enter your savings details to see projections.</p>
                )}
                <p className="text-xs text-slate-300/70 mt-4 text-center">
                  Projections assume constant contributions and returns. Not financial advice.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* ── RIGHT: Progress + Summary ── */}
          <div className="space-y-8">

            {/* Circular progress card */}
            <ScrollReveal direction="up" delay={50}>
              <div className="glass-panel rounded-3xl p-6 text-center">
                <h2 className="text-lg font-bold text-white mb-5">
                  {goalName || "Savings Progress"}
                </h2>
                <CircularProgress
                  percentage={progressPct}
                  color={progressColor}
                />

                {/* Progress bar (horizontal, supplementary) */}
                {targetNum > 0 && (
                  <div className="mt-4 mb-5">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, #4F46E5, ${progressColor})` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between text-sm glass-surface rounded-xl px-4 py-2.5">
                    <span className="text-slate-300">Saved</span>
                    <span className="font-bold text-[#8B5CF6]">${fmt(currentNum)}</span>
                  </div>
                  <div className="flex justify-between text-sm glass-surface rounded-xl px-4 py-2.5">
                    <span className="text-slate-300">Remaining</span>
                    <span className="font-bold text-white">${fmt(remaining)}</span>
                  </div>
                  <div className="flex justify-between text-sm glass-surface rounded-xl px-4 py-2.5">
                    <span className="text-slate-300">Target</span>
                    <span className="font-bold text-white">${fmt(targetNum)}</span>
                  </div>
                  {targetDate && monthsLeft > 0 && (
                    <div className="flex justify-between text-sm glass-surface rounded-xl px-4 py-2.5">
                      <span className="text-slate-300">Required/mo</span>
                      <span className="font-bold" style={{ color: monthlyNum >= requiredMonthly ? "#8B5CF6" : "#F59E0B" }}>
                        ${fmt(requiredMonthly)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Timeline summary */}
            <ScrollReveal direction="up" delay={100}>
              <div className="glass-panel rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-5">Timeline</h2>
                <div className="space-y-4">
                  <div className="glass-surface rounded-xl px-4 py-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Estimated Completion</div>
                    <div className="text-xl font-bold text-white">{estimatedDate}</div>
                  </div>
                  {monthsToGoal > 0 && monthsToGoal < Infinity && (
                    <div className="glass-surface rounded-xl px-4 py-3">
                      <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Months Remaining</div>
                      <div className="text-xl font-bold text-[#8B5CF6]">{monthsToGoal}</div>
                    </div>
                  )}
                  {monthlyNum > 0 && targetNum > 0 && remaining > 0 && (
                    <div className="glass-surface rounded-xl px-4 py-3">
                      <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Monthly Contribution</div>
                      <div className="text-xl font-bold text-white">${fmt(monthlyNum)}</div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Compound interest snapshot */}
            <ScrollReveal direction="up" delay={150}>
              <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                     style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }} aria-hidden="true" />
                <h3 className="text-base font-bold mb-2 relative z-10 text-white">The Power of Compound Interest</h3>
                <p className="text-xs leading-relaxed mb-4 relative z-10 text-slate-300">
                  ${fmt(monthlyNum)}/mo at {rateNum}% annual return:
                </p>
                <div className="space-y-2.5 relative z-10">
                  {projections.slice(2).map(p => (
                    <div key={p.months} className="flex justify-between items-center glass-surface rounded-lg px-3 py-2">
                      <span className="text-sm text-slate-300">After {p.label}</span>
                      <span className="text-sm font-bold text-[#8B5CF6]">${fmtInt(p.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
