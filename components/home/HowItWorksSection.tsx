import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

const steps = [
  {
    number: "1",
    style:  { background: "#0A1628", color: "#fff" } as const,
    title:  "Create Your Profile",
    description:
      "Tell us your financial goals, current knowledge level, and what matters most to you. Takes under 2 minutes.",
  },
  {
    number: "2",
    style:  { background: "#1E3A5F", color: "#fff" } as const,
    title:  "Follow Your Path",
    description:
      "Get a personalised learning path with curated lessons ordered from foundational to advanced financial concepts.",
  },
  {
    number: "3",
    style:  { background: "#00C896", color: "#040D1A" } as const,
    title:  "Use the Tools",
    description:
      "Apply what you learn with interactive calculators, budget planners, and savings trackers built for real decisions.",
  },
  {
    number: "4",
    style:  { background: "#5EECC5", color: "#040D1A" } as const,
    title:  "Track Your Growth",
    description:
      "Watch your financial knowledge score climb as you complete lessons, quizzes, and set real money milestones.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#0A1628" }}
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
          <p className="text-lg leading-relaxed" style={{ color: "#A8C5E8" }}>
            A structured journey built around your pace, your goals, and your lifestyle.
          </p>
        </ScrollReveal>

        {/* Connector line (desktop only) */}
        <div className="relative">
          <div
            className="hidden lg:block absolute top-6 left-[calc(100%/8)] right-[calc(100%/8)] h-px z-0"
            style={{ background: "linear-gradient(90deg, rgba(0,200,150,0.15), rgba(94,236,197,0.30), rgba(0,200,150,0.15))" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10" role="list">
            {steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 120} as="article" className="h-full">
                <div
                  role="listitem"
                  className="rounded-2xl p-8 text-center h-full transition-all duration-250 hover:-translate-y-1.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-black step-glow"
                    style={step.style}
                    aria-label={`Step ${step.number}`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#A8C5E8" }}>
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
