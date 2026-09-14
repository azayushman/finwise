import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TiltCard } from "@/components/ui/TiltCard";

const features = [
  {
    icon: "📚",
    iconBg: "linear-gradient(135deg, #102A4C 0%, #1A365D 100%)",
    title: "Learn",
    description:
      "Bite-sized lessons on every financial topic — from compound interest to credit scores — written in plain English for real people.",
    cta: "Explore lessons →",
    href: "/learn",
  },
  {
    icon: "💰",
    iconBg: "linear-gradient(135deg, #102A4C 0%, #1A365D 100%)",
    title: "Budget",
    description:
      "Build a personalised budget with our visual planner. Track income, expenses, and savings goals with an intuitive interface.",
    cta: "Start budgeting →",
    href: "/budget",
  },
  {
    icon: "🏦",
    iconBg: "linear-gradient(135deg, #102A4C 0%, #1A365D 100%)",
    title: "Save",
    description:
      "Set savings goals, calculate how long it takes to reach them, and visualise the power of compound interest over time.",
    cta: "Set a goal →",
    href: "/savings",
  },
  {
    icon: "📈",
    iconBg: "linear-gradient(135deg, #102A4C 0%, #1A365D 100%)",
    title: "Invest",
    description:
      "Demystify the stock market, ETFs, and index funds. Learn what risk tolerance means and how to start investing with any amount.",
    cta: "Learn to invest →",
    href: "/tools",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#07111F]" aria-labelledby="features-title">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal as="header" className="text-center max-w-2xl mx-auto mb-16" direction="up">
          <SectionLabel className="justify-center">Core Features</SectionLabel>
          <h2
            id="features-title"
            className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Everything you need to master your finances
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Four powerful pillars designed to take you from financial beginner to confident money manager.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 100} as="article" className="h-full">
              <TiltCard maxTilt={5} scale={1.01} className="h-full">
                <div
                  role="listitem"
                  className="feature-card bg-[#0B1F3A]/80 border border-[#8B5CF6]/20 rounded-2xl p-8 h-full transition-all duration-250 hover:shadow-[0_10px_30px_rgba(109,93,251,0.15)] hover:border-[#8B5CF6]/50 cursor-default flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-5 flex-shrink-0 border border-[#8B5CF6]/30 shadow-sm"
                      style={{ background: feature.iconBg }}
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-5">{feature.description}</p>
                  </div>
                  <Link
                    href={feature.href}
                    className="inline-flex items-center text-sm font-semibold transition-all duration-150 hover:gap-2 group text-[#A78BFA] hover:text-[#C4B5FD]"
                  >
                    <span>{feature.cta}</span>
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
