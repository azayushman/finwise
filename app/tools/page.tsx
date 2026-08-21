import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Financial Tools" };

const tools = [
  {
    icon: "🔢",
    tag: "Calculator" as const,
    title: "Compound Interest Calculator",
    desc: "See how your savings grow with different interest rates, contribution amounts, and time horizons.",
    color: "#E8FFF8",
  },
  {
    icon: "💸",
    tag: "Debt" as const,
    title: "Debt Payoff Calculator",
    desc: "Find the fastest way to pay off your debt using the avalanche or snowball repayment methods.",
    color: "#FEF3C7",
  },
  {
    icon: "🏠",
    tag: "Planning" as const,
    title: "Home Affordability Tool",
    desc: "Calculate how much house you can realistically afford based on your income and down payment.",
    color: "#EDE9FE",
  },
  {
    icon: "🎓",
    tag: "Loans" as const,
    title: "Student Loan Analyser",
    desc: "Compare repayment plans, calculate total interest paid, and find the best strategy for your loans.",
    color: "#EEF5FC",
  },
  {
    icon: "📅",
    tag: "Retirement" as const,
    title: "Retirement Planner",
    desc: "Project your retirement savings based on your current age, income, and contribution rate.",
    color: "#E8FFF8",
  },
  {
    icon: "⚖️",
    tag: "Comparison" as const,
    title: "Investment Return Comparer",
    desc: "Compare returns across different asset classes: savings accounts, bonds, stocks, real estate, and more.",
    color: "#FEF3C7",
  },
];

const tagVariant: Record<string, "green" | "navy" | "amber" | "purple"> = {
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
        className="py-20 px-6"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 font-medium mb-8">
          <span className="text-lg">🚧</span>
          <span>
            <strong>Full interactive calculators with charts</strong> are under development.
            The cards below preview what&apos;s coming.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {tools.map((tool, i) => (
            <article
              key={tool.title}
              role="listitem"
              className="bg-white border border-slate-200 rounded-2xl p-8 transition-all duration-250 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300 cursor-default"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
                style={{ background: tool.color }}
                aria-hidden="true"
              >
                {tool.icon}
              </div>
              <Badge variant={tagVariant[tool.tag]} className="mb-3">{tool.tag}</Badge>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{tool.desc}</p>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "linear-gradient(135deg, #0A1628, #1E3A5F)" }}
                disabled
              >
                Coming Soon
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
