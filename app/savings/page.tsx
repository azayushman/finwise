import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = { title: "Savings Tracker" };

const goals = [
  { name: "Emergency Fund",   target: "$10,000", current: "$7,600", pct: 76, color: "#00C896", icon: "🆘" },
  { name: "Vacation Fund",    target: "$3,000",  current: "$1,350", pct: 45, color: "#F59E0B", icon: "✈️" },
  { name: "New Laptop",       target: "$1,500",  current: "$600",   pct: 40, color: "#8B5CF6", icon: "💻" },
  { name: "Investment Seed",  target: "$5,000",  current: "$1,250", pct: 25, color: "#4A80BF", icon: "📈" },
];

const scenarios = [
  { rate: "4.5%",  label: "High-Yield Savings", years5: "$12,462",  years10: "$15,530" },
  { rate: "7%",    label: "Index Fund (avg)",    years5: "$14,026",  years10: "$19,672" },
  { rate: "10%",   label: "Aggressive Growth",   years5: "$16,105",  years10: "$25,937" },
];

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div
        className="py-20 px-6"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Savings Tracker</SectionLabel>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 font-medium mb-10">
          <span className="text-lg">🚧</span>
          <span>
            <strong>Goal-based savings tracker with compound interest projections</strong> is coming soon.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Savings goals */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Savings Goals</h2>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.name}
                  className="bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-250 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl" aria-hidden="true">{goal.icon}</div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{goal.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Target: {goal.target}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black" style={{ color: goal.color }}>{goal.current}</div>
                      <div className="text-xs font-bold" style={{ color: goal.color }}>{goal.pct}%</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full progress-fill"
                      style={{ width: `${goal.pct}%`, background: goal.color }}
                    />
                  </div>
                </div>
              ))}

              {/* Add goal placeholder */}
              <button
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 text-sm font-semibold text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors"
                disabled
              >
                + Add New Savings Goal
              </button>
            </div>
          </div>

          {/* Compound interest snapshot */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Compound Interest Snapshot</h2>
            <div
              className="rounded-2xl p-6 text-white mb-4"
              style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
            >
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "#A8C5E8" }}>Starting with</div>
              <div className="text-3xl font-black text-white mb-4">$10,000</div>
              <div className="space-y-4">
                {scenarios.map((s) => (
                  <div
                    key={s.rate}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-white">{s.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ color: "#00C896", background: "rgba(0,200,150,0.12)" }}>
                        {s.rate}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="text-xs" style={{ color: "#A8C5E8" }}>After 5 yrs</div>
                        <div className="text-sm font-bold text-white">{s.years5}</div>
                      </div>
                      <div>
                        <div className="text-xs" style={{ color: "#A8C5E8" }}>After 10 yrs</div>
                        <div className="text-sm font-bold" style={{ color: "#00C896" }}>{s.years10}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">
              Projections are for educational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
