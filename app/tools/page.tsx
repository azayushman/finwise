import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = { title: "Financial Tools" };

const TAG_COLORS: Record<string, string> = {
  Budgeting:  "#8B5CF6",
  Savings:    "#34D399",
  Calculator: "#60A5FA",
  Debt:       "#F59E0B",
  Planning:   "#A78BFA",
  Loans:      "#38BDF8",
  Retirement: "#C084FC",
  Comparison: "#FB923C",
};

const tools = [
  {
    icon: "💰",
    tag: "Budgeting" as const,
    title: "Budget Planner",
    desc: "Build a personalised monthly budget. Track income, expenses, savings allocation, and see a visual spending breakdown.",
    href: "/budget",
    live: true,
  },
  {
    icon: "🏦",
    tag: "Savings" as const,
    title: "Savings Planner",
    desc: "Set savings goals, calculate timelines, and visualise the power of compound interest with interactive projections.",
    href: "/savings",
    live: true,
  },
  {
    icon: "🔢",
    tag: "Calculator" as const,
    title: "Compound Interest Calculator",
    desc: "See how your savings grow with different interest rates, contribution amounts, and time horizons.",
    href: "#",
    live: false,
  },
  {
    icon: "💸",
    tag: "Debt" as const,
    title: "Debt Payoff Calculator",
    desc: "Find the fastest way to pay off your debt using the avalanche or snowball repayment methods.",
    href: "#",
    live: false,
  },
  {
    icon: "🏠",
    tag: "Planning" as const,
    title: "Home Affordability Tool",
    desc: "Calculate how much house you can realistically afford based on your income and down payment.",
    href: "#",
    live: false,
  },
  {
    icon: "🎓",
    tag: "Loans" as const,
    title: "Student Loan Analyser",
    desc: "Compare repayment plans, calculate total interest paid, and find the best strategy for your loans.",
    href: "#",
    live: false,
  },
  {
    icon: "📅",
    tag: "Retirement" as const,
    title: "Retirement Planner",
    desc: "Project your retirement savings based on your current age, income, and contribution rate.",
    href: "#",
    live: false,
  },
  {
    icon: "⚖️",
    tag: "Comparison" as const,
    title: "Investment Return Comparer",
    desc: "Compare returns across different asset classes: savings accounts, bonds, stocks, real estate, and more.",
    href: "#",
    live: false,
  },
];

export default function ToolsPage() {
  const liveCount  = tools.filter(t => t.live).length;
  const totalCount = tools.length;

  return (
    <div className="min-h-screen text-[#F5F7FF] relative">
      {/* ── Page ambient depth ── */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[120px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,93,251,0.08), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[40%] left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.06), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* ════════════════ HERO ════════════════ */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 glass-surface">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                Financial Tools
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white mb-4">
              Make better<br />
              <span className="gradient-text">money decisions.</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed text-slate-300">
              Powerful calculators and planners that help you apply financial concepts to your real life.
              No spreadsheets required.
            </p>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-4 mt-10">
              {[
                { value: liveCount.toString(),  label: "Live Tools" },
                { value: totalCount.toString(), label: "Total Tools" },
                { value: "Free",                label: "Always" },
              ].map((s, i) => (
                <div key={i} className="glass-surface rounded-xl px-5 py-3 min-w-[80px] text-center">
                  <div className="text-2xl font-bold text-[#8B5CF6]">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider mt-0.5 text-slate-300">{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ════════════════ TOOLS GRID ════════════════ */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {tools.map((tool, i) => {
            const tagColor = TAG_COLORS[tool.tag] ?? "#C4B5FD";
            return (
              <ScrollReveal key={tool.title} delay={i * 70} as="article" className="h-full">
                <div
                  role="listitem"
                  className={`glass-panel rounded-3xl p-7 h-full flex flex-col justify-between transition-all duration-300 ${
                    tool.live
                      ? "hover:-translate-y-1"
                      : "opacity-75"
                  }`}
                >
                  <div>
                    {/* Icon row */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl glass-surface border-white/10 flex-shrink-0"
                        aria-hidden="true"
                      >
                        {tool.icon}
                      </div>

                      {tool.live && (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider glass-surface"
                          style={{ color: "#C4B5FD", borderColor: "rgba(139,92,246,0.35)" }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
                          Live
                        </span>
                      )}
                    </div>

                    {/* Category tag */}
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 glass-surface"
                      style={{ color: tagColor }}
                    >
                      {tool.tag}
                    </span>

                    <h2 className="text-lg font-bold text-white mb-2 leading-snug">{tool.title}</h2>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">{tool.desc}</p>
                  </div>

                  {/* CTA */}
                  {tool.live ? (
                    <Link
                      href={tool.href}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 glass-control"
                    >
                      Open Tool →
                    </Link>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 cursor-default glass-surface border-white/5 opacity-50"
                      disabled
                      aria-disabled="true"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
