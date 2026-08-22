import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

const steps = [
  {
    number: "1",
    style:  { background: "#102A4C", color: "#F5F7FF", border: "1px solid rgba(139,92,246,0.3)" } as const,
    title:  "Create Your Profile",
    description:
      "Tell us your financial goals, current knowledge level, and what matters most to you. Takes under 2 minutes.",
  },
  {
    number: "2",
    style:  { background: "#1E3A5F", color: "#F5F7FF", border: "1px solid rgba(139,92,246,0.4)" } as const,
    title:  "Follow Your Path",
    description:
      "Get a personalised learning path with curated lessons ordered from foundational to advanced financial concepts.",
  },
  {
    number: "3",
    style:  { background: "linear-gradient(135deg, #6D5DFB, #4F46E5)", color: "#FFFFFF", boxShadow: "0 0 15px rgba(109,93,251,0.4)" } as const,
    title:  "Use the Tools",
    description:
      "Apply what you learn with interactive calculators, budget planners, and savings trackers built for real decisions.",
  },
  {
    number: "4",
    style:  { background: "linear-gradient(135deg, #8B5CF6, #6D5DFB)", color: "#FFFFFF", boxShadow: "0 0 20px rgba(139,92,246,0.5)" } as const,
    title:  "Track Your Growth",
    description:
      "Watch your financial knowledge score climb as you complete lessons, quizzes, and set real money milestones.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#0B1F3A" }}
      aria-labelledby="how-title"
    >
      <AmbientBackground variant="subtle-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <ScrollReveal as="header" className="text-center max-w-2xl mx-auto mb-16" direction="up">
          <SectionLabel className="justify-center">How It Works</SectionLabel>
          <h2
            id="how-title"
            className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Go from zero to financially literate in 4 steps
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#94A3B8" }}>
            A structured journey built around your pace, your goals, and your lifestyle.
          </p>
        </ScrollReveal>

        {/* Connector line (desktop only) */}
        <div className="relative">
          <div
            className="hidden lg:block absolute top-6 left-[calc(100%/8)] right-[calc(100%/8)] h-px z-0"
            style={{ background: "linear-gradient(90deg, rgba(109,93,251,0.15), rgba(139,92,246,0.4), rgba(109,93,251,0.15))" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10" role="list">
            {steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 120} as="article" className="h-full">
                <div
                  role="listitem"
                  className="rounded-2xl p-8 text-center h-full transition-all duration-250 hover:-translate-y-1.5"
                  style={{ background: "rgba(16,42,76,0.6)", border: "1px solid rgba(139,92,246,0.18)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-black step-glow"
                    style={step.style}
                    aria-label={`Step ${step.number}`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
