import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = { title: "Budget Planner" };

const categories = [
  {
    icon: "💰",
    label: "Income",
    pct: 100,
    amount: "$4,500",
    color: "#00C896",
    bg: "#E8FFF8",
    items: ["Monthly Salary", "Freelance", "Side Income"],
  },
  {
    icon: "🏠",
    label: "Needs (50%)",
    pct: 50,
    amount: "$2,250",
    color: "#4A80BF",
    bg: "#EEF5FC",
    items: ["Rent", "Groceries", "Utilities", "Transport"],
  },
  {
    icon: "🎮",
    label: "Wants (30%)",
    pct: 30,
    amount: "$1,350",
    color: "#F59E0B",
    bg: "#FEF3C7",
    items: ["Dining Out", "Subscriptions", "Entertainment", "Shopping"],
  },
  {
    icon: "💎",
    label: "Save & Invest (20%)",
    pct: 20,
    amount: "$900",
    color: "#8B5CF6",
    bg: "#EDE9FE",
    items: ["Emergency Fund", "Retirement (401k)", "Investments", "Debt Payoff"],
  },
];

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div
        className="py-20 px-6"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Budget Planner</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Build Your<br />
            <span className="gradient-text">Perfect Budget.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#A8C5E8" }}>
            Create a personalised monthly budget using the 50/30/20 rule. Track where your
            money goes and find areas to save more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 font-medium mb-10">
          <span className="text-lg">🚧</span>
          <span>
            <strong>Interactive budget builder</strong> with real-time tracking and charts is coming soon.
            Below is a preview of the 50/30/20 framework.
          </span>
        </div>

        {/* 50/30/20 explainer banner */}
        <div
          className="rounded-2xl p-8 mb-10 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
               style={{ background: "radial-gradient(circle, #00C896, transparent 70%)" }} aria-hidden="true" />
          <h2 className="text-2xl font-bold mb-2 relative z-10">The 50/30/20 Rule</h2>
          <p className="text-sm max-w-xl leading-relaxed relative z-10" style={{ color: "#A8C5E8" }}>
            Split your after-tax income into three buckets: 50% for needs, 30% for wants, and 20%
            for savings & debt repayment. It&apos;s the simplest, most effective budgeting method
            for beginners.
          </p>
          <div className="flex gap-8 mt-6 relative z-10">
            {[{ pct: "50%", label: "Needs" }, { pct: "30%", label: "Wants" }, { pct: "20%", label: "Save" }].map((b) => (
              <div key={b.label}>
                <div className="text-3xl font-black" style={{ color: "#00C896" }}>{b.pct}</div>
                <div className="text-xs uppercase tracking-wider mt-0.5" style={{ color: "#A8C5E8" }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
          {categories.map((cat) => (
            <article
              key={cat.label}
              role="listitem"
              className="bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-250 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: cat.bg }}
                aria-hidden="true"
              >
                {cat.icon}
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">{cat.label}</h2>
              <div className="text-2xl font-black mb-3" style={{ color: cat.color }}>{cat.amount}</div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full progress-fill"
                  style={{ width: `${cat.pct}%`, background: cat.color }}
                />
              </div>

              <ul className="space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: cat.color }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
