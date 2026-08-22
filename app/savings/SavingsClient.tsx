"use client";

import { useState, useCallback, useId, useMemo } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SectionLabel } from "@/components/ui/SectionLabel";

/* ══════════════════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════════════════ */

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
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
      <circle cx="90" cy="90" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
      {/* Progress arc */}
      <circle
        cx="90" cy="90" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${dashLen} ${circumference - dashLen}`}
        strokeDashoffset={circumference / 4}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* Center text */}
      <text x="90" y="82" textAnchor="middle" className="fill-slate-900 text-[28px] font-black">
        {clampedPct.toFixed(0)}%
      </text>
      <text x="90" y="102" textAnchor="middle" className="fill-slate-400 text-[11px] font-medium">
        complete
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Compound Interest Projection
   ══════════════════════════════════════════════════════════════════════════ */

function compoundGrowth(principal: number, monthlyAdd: number, annualRate: number, months: number): number {
  // FV = P(1+r)^n + PMT * [((1+r)^n - 1) / r]
  // where r = monthly rate, n = months
  if (months <= 0) return principal;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal + monthlyAdd * months;
  const factor = Math.pow(1 + r, months);
  return principal * factor + monthlyAdd * ((factor - 1) / r);
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
  const targetNum = parseFloat(targetAmount) || 0;
  const currentNum = parseFloat(currentSavings) || 0;
  const monthlyNum = parseFloat(monthlyContrib) || 0;
  const rateNum = parseFloat(annualRate) || 0;
  const remaining = Math.max(0, targetNum - currentNum);
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
    // Solve: current*(1+r)^n + monthly*((1+r)^n - 1)/r = target
    // => (1+r)^n * (current + monthly/r) = target + monthly/r
    // => n = log((target + monthly/r) / (current + monthly/r)) / log(1+r)
    const monthlyOverR = monthlyNum / r;
    const numerator = targetNum + monthlyOverR;
    const denominator = currentNum + monthlyOverR;
    if (denominator <= 0 || numerator <= 0) return Infinity;
    const n = Math.log(numerator / denominator) / Math.log(1 + r);
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
      if (isNaN(n) || n < 0 || n > 50) return "Enter a rate between 0 and 50.";
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

  /* ── Input field helper ── */
  function InputBlock({ id, label, value, setter, field, type = "number", placeholder, min, max, step, prefix, suffix }: {
    id: string; label: string; value: string; setter: (v: string) => void;
    field: string; type?: string; placeholder: string;
    min?: string; max?: string; step?: string; prefix?: string; suffix?: string;
  }) {
    return (
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 mb-1.5 block">{label}</label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">{prefix}</span>
          )}
          <input
            id={id}
            type={type}
            min={min} max={max} step={step}
            value={value}
            onChange={e => setField(field, e.target.value, setter)}
            onBlur={() => setErrors(prev => ({ ...prev, [field]: validate(field, value) }))}
            placeholder={placeholder}
            aria-invalid={Boolean(errors[field])}
            className={`w-full py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 ${
              prefix ? "pl-8 pr-4" : suffix ? "pl-4 pr-8" : "px-4"
            } ${
              errors[field]
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
            }`}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">{suffix}</span>
          )}
        </div>
        {errors[field] && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors[field]}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <AmbientBackground variant="dark" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionLabel>Savings Planner</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Watch Your<br />
            <span className="gradient-text">Savings Grow.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#A8C5E8" }}>
            Set goals, calculate timelines, and visualise the power of compound interest.
            Every dollar saved today is worth more tomorrow.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Inputs ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Goal setup */}
            <ScrollReveal direction="up">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900">Savings Goal</h2>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label htmlFor={goalId} className="text-sm font-semibold text-slate-700 mb-1.5 block">Goal Name</label>
                    <input
                      id={goalId}
                      type="text"
                      value={goalName}
                      onChange={e => setGoalName(e.target.value)}
                      placeholder="e.g. Emergency Fund"
                      className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
                    />
                  </div>
                  <InputBlock id={targetId} label="Target Amount" value={targetAmount} setter={setTargetAmount}
                    field="targetAmount" placeholder="e.g. 10000" min="0" step="0.01" prefix="$" />
                  <InputBlock id={currentId} label="Current Savings" value={currentSavings} setter={setCurrentSavings}
                    field="currentSavings" placeholder="e.g. 2500" min="0" step="0.01" prefix="$" />
                  <InputBlock id={monthlyId} label="Monthly Contribution" value={monthlyContrib} setter={setMonthlyContrib}
                    field="monthlyContrib" placeholder="e.g. 500" min="0" step="0.01" prefix="$" />
                  <InputBlock id={rateId} label="Expected Annual Return" value={annualRate} setter={setAnnualRate}
                    field="annualRate" placeholder="e.g. 5" min="0" max="50" step="0.1" suffix="%" />
                  <div>
                    <label htmlFor={dateId} className="text-sm font-semibold text-slate-700 mb-1.5 block">Target Date (optional)</label>
                    <input
                      id={dateId}
                      type="date"
                      value={targetDate}
                      onChange={e => setTargetDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-150 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Status message */}
            {statusMessage && (
              <ScrollReveal direction="up" delay={50}>
                <div className={`flex items-start gap-3 rounded-2xl px-5 py-4 text-sm font-medium ${
                  statusMessage.type === "success" ? "bg-green-50 border border-green-200 text-green-800" :
                  statusMessage.type === "warning" ? "bg-amber-50 border border-amber-200 text-amber-800" :
                  "bg-blue-50 border border-blue-200 text-blue-800"
                }`}>
                  <span className="text-lg">{statusMessage.type === "success" ? "✅" : statusMessage.type === "warning" ? "⚠️" : "ℹ️"}</span>
                  <span>{statusMessage.text}</span>
                </div>
              </ScrollReveal>
            )}

            {/* Projection table */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Growth Projection</h2>
                {monthlyNum > 0 || currentNum > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Period</th>
                          <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Contributions</th>
                          <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Interest</th>
                          <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projections.map(p => {
                          const totalContrib = currentNum + monthlyNum * p.months;
                          const interest = p.value - totalContrib;
                          return (
                            <tr key={p.months} className="border-b border-slate-50">
                              <td className="py-3 font-semibold text-slate-700">{p.label}</td>
                              <td className="py-3 text-right text-slate-500">${fmtInt(totalContrib)}</td>
                              <td className="py-3 text-right" style={{ color: "#00C896" }}>+${fmtInt(Math.max(0, interest))}</td>
                              <td className="py-3 text-right font-bold text-slate-900">${fmtInt(p.value)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-8">Enter your savings details to see projections.</p>
                )}
                <p className="text-xs text-slate-400 mt-4 text-center">
                  Projections assume constant contributions and returns. Not financial advice.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* ── RIGHT: Progress + Summary ── */}
          <div className="space-y-8">
            {/* Circular progress */}
            <ScrollReveal direction="up" delay={50}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  {goalName || "Savings Progress"}
                </h2>
                <CircularProgress
                  percentage={progressPct}
                  color={progressPct >= 100 ? "#00C896" : progressPct >= 50 ? "#00A87E" : "#4A80BF"}
                />
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Saved</span>
                    <span className="font-bold" style={{ color: "#00C896" }}>${fmt(currentNum)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Remaining</span>
                    <span className="font-bold text-slate-900">${fmt(remaining)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Target</span>
                    <span className="font-bold text-slate-900">${fmt(targetNum)}</span>
                  </div>
                  {targetDate && monthsLeft > 0 && (
                    <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                      <span className="text-slate-500">Required/mo</span>
                      <span className="font-bold" style={{ color: monthlyNum >= requiredMonthly ? "#00C896" : "#F59E0B" }}>
                        ${fmt(requiredMonthly)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Timeline summary */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Timeline</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estimated Completion</div>
                    <div className="text-xl font-bold text-slate-900">{estimatedDate}</div>
                  </div>
                  {monthsToGoal > 0 && monthsToGoal < Infinity && (
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Months Remaining</div>
                      <div className="text-xl font-bold" style={{ color: "#00C896" }}>{monthsToGoal}</div>
                    </div>
                  )}
                  {monthlyNum > 0 && targetNum > 0 && remaining > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Monthly Contribution</div>
                      <div className="text-xl font-bold text-slate-900">${fmt(monthlyNum)}</div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Compound interest snapshot */}
            <ScrollReveal direction="up" delay={150}>
              <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
                     style={{ background: "radial-gradient(circle, #00C896, transparent 70%)" }} aria-hidden="true" />
                <h3 className="text-base font-bold mb-3 relative z-10">The Power of Compound Interest</h3>
                <p className="text-xs leading-relaxed mb-3 relative z-10" style={{ color: "#A8C5E8" }}>
                  ${fmt(monthlyNum)}/mo at {rateNum}% annual return:
                </p>
                <div className="space-y-2 relative z-10">
                  {projections.slice(2).map(p => (
                    <div key={p.months} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "#A8C5E8" }}>After {p.label}</span>
                      <span className="text-sm font-bold" style={{ color: "#00C896" }}>${fmtInt(p.value)}</span>
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
