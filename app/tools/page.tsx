import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

export const metadata: Metadata = { title: "Financial Tools" };

const tools = [
  {
    icon: "💰",
    tag: "Budgeting" as const,
    title: "Budget Planner",
    desc: "Build a personalised monthly budget. Track income, expenses, savings allocation, and see a visual spending breakdown.",
    color: "#E8FFF8",
    href: "/budget",
    live: true,
  },
  {
    icon: "🏦",
    tag: "Savings" as const,
    title: "Savings Planner",
    desc: "Set savings goals, calculate timelines, and visualise the power of compound interest with interactive projections.",
    color: "#EDE9FE",
    href: "/savings",
    live: true,
  },
  {
    icon: "🔢",
    tag: "Calculator" as const,
    title: "Compound Interest Calculator",
    desc: "See how your savings grow with different interest rates, contribution amounts, and time horizons.",
    color: "#E8FFF8",
    href: "#",
    live: false,
  },
  {
    icon: "💸",
    tag: "Debt" as const,
    title: "Debt Payoff Calculator",
    desc: "Find the fastest way to pay off your debt using the avalanche or snowball repayment methods.",
    color: "#FEF3C7",
    href: "#",
    live: false,
  },
  {
    icon: "🏠",
    tag: "Planning" as const,
    title: "Home Affordability Tool",
    desc: "Calculate how much house you can realistically afford based on your income and down payment.",
    color: "#EDE9FE",
    href: "#",
    live: false,
  },
  {
    icon: "🎓",
    tag: "Loans" as const,
    title: "Student Loan Analyser",
    desc: "Compare repayment plans, calculate total interest paid, and find the best strategy for your loans.",
    color: "#EEF5FC",
    href: "#",
    live: false,
  },
  {
    icon: "📅",
    tag: "Retirement" as const,
    title: "Retirement Planner",
    desc: "Project your retirement savings based on your current age, income, and contribution rate.",
    color: "#E8FFF8",
    href: "#",
    live: false,
  },
  {
    icon: "⚖️",
    tag: "Comparison" as const,
    title: "Investment Return Comparer",
    desc: "Compare returns across different asset classes: savings accounts, bonds, stocks, real estate, and more.",
    color: "#FEF3C7",
    href: "#",
    live: false,
  },
];

const tagVariant: Record<string, "green" | "navy" | "amber" | "purple"> = {
  Budgeting:   "green",
  Savings:     "purple",
  Calculator:  "green",
  Debt:        "amber",
  Planning:    "purple",
  Loans:       "navy",
  Retirement:  "green",
  Comparison:  "amber",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <AmbientBackground variant="dark" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionLabel>Interactive Tools</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Financial Tools<br />
            <span className="gradient-text">That Work for You.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#A8C5E8" }}>
            Powerful calculators and planners that help you apply financial concepts to your real life.
            No spreadsheets required.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {tools.map((tool, i) => (
            <ScrollReveal key={tool.title} delay={i * 80} as="article" className="h-full">
              <TiltCard maxTilt={4} scale={1.01} className="h-full">
                <div
                  role="listitem"
                  className="feature-card bg-white border border-slate-200 rounded-2xl p-8 h-full transition-all duration-250 hover:shadow-xl hover:border-slate-300 cursor-default flex flex-col"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: tool.color }}
                      aria-hidden="true"
                    >
                      {tool.icon}
                    </div>
                    {tool.live && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{ background: "rgba(0,200,150,0.1)", color: "#00A87E", border: "1px solid rgba(0,200,150,0.2)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                  <Badge variant={tagVariant[tool.tag]} className="mb-3">{tool.tag}</Badge>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">{tool.desc}</p>
                  {tool.live ? (
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
                    >
                      Open Tool →
                    </Link>
                  ) : (
                    <button
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 cursor-default opacity-60"
                      style={{ background: "linear-gradient(135deg, #0A1628, #1E3A5F)" }}
                      disabled
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
