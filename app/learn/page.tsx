import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Learn" };

const topics = [
  {
    icon: "📖",
    tag: "Foundations" as const,
    title: "What is Personal Finance?",
    desc: "A complete overview of managing your income, expenses, savings, and investments to achieve your financial goals.",
    duration: "8 min read",
  },
  {
    icon: "💳",
    tag: "Credit" as const,
    title: "Understanding Credit Scores",
    desc: "How your credit score is calculated, why it matters, and proven strategies to build and protect it over time.",
    duration: "10 min read",
  },
  {
    icon: "📊",
    tag: "Budgeting" as const,
    title: "The 50/30/20 Budget Rule",
    desc: "Learn the most popular budgeting framework and how to adapt it to your personal income and lifestyle.",
    duration: "6 min read",
  },
  {
    icon: "📈",
    tag: "Investing" as const,
    title: "Stocks, ETFs & Index Funds",
    desc: "A jargon-free introduction to investing — what different assets are and how to choose the right ones for you.",
    duration: "12 min read",
  },
  {
    icon: "⚡",
    tag: "Savings" as const,
    title: "Power of Compound Interest",
    desc: "See how money grows exponentially over time and why starting early makes an enormous difference.",
    duration: "7 min read",
  },
  {
    icon: "🛡️",
    tag: "Protection" as const,
    title: "Insurance Fundamentals",
    desc: "Health, car, renters, and life insurance explained simply — what you need, what you don't, and how to save.",
    duration: "9 min read",
  },
  {
    icon: "🧾",
    tag: "Taxes" as const,
    title: "Taxes for Beginners",
    desc: "Understand how income tax works, what deductions you can claim, and how to file your first tax return.",
    duration: "11 min read",
  },
  {
    icon: "🎯",
    tag: "Goals" as const,
    title: "Setting SMART Financial Goals",
    desc: "A framework for setting realistic, actionable financial goals that you'll actually stick to and achieve.",
    duration: "5 min read",
  },
];

const tagVariant: Record<string, "green" | "navy" | "amber" | "purple"> = {
  Foundations: "navy",
  Credit:      "amber",
  Budgeting:   "green",
  Investing:   "purple",
  Savings:     "green",
  Protection:  "navy",
  Taxes:       "amber",
  Goals:       "green",
};

const categories = ["All", "Foundations", "Budgeting", "Savings", "Investing", "Credit", "Taxes"];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page hero */}
      <div
        className="py-20 px-6"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Learning Hub</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Financial Literacy<br />
            <span className="gradient-text">Made Simple.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#A8C5E8" }}>
            Explore 120+ lessons across every financial topic. No prior knowledge needed —
            we start from the very basics and build up from there.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: "120+",  label: "Lessons" },
              { value: "8",     label: "Topic Areas" },
              { value: "Free",  label: "Always" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs uppercase tracking-wider mt-0.5" style={{ color: "#A8C5E8" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 font-medium mb-8">
          <span className="text-lg">🚧</span>
          <span>
            <strong>Interactive lessons with progress tracking</strong> are under active development.
            The cards below show what&apos;s coming — click any to explore.
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="Topic filters">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 border ${
                i === 0
                  ? "text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
              style={i === 0 ? { background: "#0A1628" } : undefined}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topic cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" role="list">
          {topics.map((topic, i) => (
            <article
              key={topic.title}
              role="listitem"
              className="group bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-250 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300 cursor-default"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-3xl mb-4" aria-hidden="true">{topic.icon}</div>
              <Badge variant={tagVariant[topic.tag]} className="mb-3">{topic.tag}</Badge>
              <h2 className="text-base font-bold text-slate-900 mb-2 leading-snug">{topic.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{topic.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{topic.duration}</span>
                <span className="text-xs font-semibold transition-all duration-150 group-hover:gap-2" style={{ color: "#00A87E" }}>
                  Read →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
