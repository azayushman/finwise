import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const features = [
  {
    icon: "📚",
    iconBg: "#EEF5FC",
    title: "Learn",
    description:
      "Bite-sized lessons on every financial topic — from compound interest to credit scores — written in plain English for real people.",
    cta: "Explore lessons →",
    href: "/learn",
  },
  {
    icon: "💰",
    iconBg: "#E8FFF8",
    title: "Budget",
    description:
      "Build a personalised budget with our visual planner. Track income, expenses, and savings goals with an intuitive interface.",
    cta: "Start budgeting →",
    href: "/budget",
  },
  {
    icon: "🏦",
    iconBg: "#FEF3C7",
    title: "Save",
    description:
      "Set savings goals, calculate how long it takes to reach them, and visualise the power of compound interest over time.",
    cta: "Set a goal →",
    href: "/savings",
  },
  {
    icon: "📈",
    iconBg: "#EDE9FE",
    title: "Invest",
    description:
      "Demystify the stock market, ETFs, and index funds. Learn what risk tolerance means and how to start investing with any amount.",
    cta: "Learn to invest →",
    href: "/tools",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white" aria-labelledby="features-title">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center max-w-2xl mx-auto mb-16">
          <SectionLabel>Core Features</SectionLabel>
          <h2
            id="features-title"
            className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Everything you need to master your finances
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Four powerful pillars designed to take you from financial beginner to confident money manager.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              role="listitem"
              className="group bg-white border border-slate-200 rounded-2xl p-8 transition-all duration-250 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300 cursor-default"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-5 flex-shrink-0"
                style={{ background: feature.iconBg }}
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{feature.description}</p>
              <Link
                href={feature.href}
                className="inline-flex items-center text-sm font-semibold transition-all duration-150 group-hover:gap-2"
                style={{ color: "#00A87E" }}
              >
                {feature.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
