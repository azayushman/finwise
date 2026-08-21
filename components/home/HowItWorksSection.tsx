import { SectionLabel } from "@/components/ui/SectionLabel";

const steps = [
  {
    number: "1",
    style:  { background: "#0A1628", color: "#fff" },
    title:  "Create Your Profile",
    description:
      "Tell us your financial goals, current knowledge level, and what matters most to you. Takes under 2 minutes.",
  },
  {
    number: "2",
    style:  { background: "#1E3A5F", color: "#fff" },
    title:  "Follow Your Path",
    description:
      "Get a personalised learning path with curated lessons ordered from foundational to advanced financial concepts.",
  },
  {
    number: "3",
    style:  { background: "#00C896", color: "#040D1A" },
    title:  "Use the Tools",
    description:
      "Apply what you learn with interactive calculators, budget planners, and savings trackers built for real decisions.",
  },
  {
    number: "4",
    style:  { background: "#5EECC5", color: "#040D1A" },
    title:  "Track Your Growth",
    description:
      "Watch your financial knowledge score climb as you complete lessons, quizzes, and set real money milestones.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-slate-50" aria-labelledby="how-title">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center max-w-2xl mx-auto mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2
            id="how-title"
            className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Go from zero to financially literate in 4 steps
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            A structured journey built around your pace, your goals, and your lifestyle.
          </p>
        </header>

        {/* Connector line (desktop only) */}
        <div className="relative">
          <div
            className="hidden lg:block absolute top-6 left-[calc(100%/8)] right-[calc(100%/8)] h-px z-0"
            style={{ background: "linear-gradient(90deg, #D6E8F7, #CFFAEE)" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10" role="list">
            {steps.map((step, i) => (
              <article
                key={step.title}
                role="listitem"
                className="bg-white border border-slate-200 rounded-2xl p-8 text-center transition-all duration-250 hover:-translate-y-1.5 hover:shadow-lg"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-black"
                  style={step.style}
                  aria-label={`Step ${step.number}`}
                >
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
