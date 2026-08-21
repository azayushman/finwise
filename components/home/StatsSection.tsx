import { SectionLabel } from "@/components/ui/SectionLabel";

const stats = [
  { value: "66%",  label: "of adults fail basic financial literacy tests globally" },
  { value: "$1.5T", label: "in student loan debt — many unaware of repayment options" },
  { value: "78%",  label: "of workers live paycheck-to-paycheck without a safety net" },
  { value: "50K+", label: "FinWise learners have improved their financial confidence" },
];

const progressItems = [
  { name: "Compound Interest",         pct: 94 },
  { name: "Building an Emergency Fund", pct: 87 },
  { name: "Credit Score Basics",        pct: 79 },
  { name: "Index Fund Investing",       pct: 71 },
];

export function StatsSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#0A1628" }}
      aria-labelledby="stats-title"
    >
      {/* Background radial overlays */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #00C896, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15"
             style={{ background: "radial-gradient(circle, #2E5F9A, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
          <SectionLabel className="justify-center">By the Numbers</SectionLabel>
          <h2
            id="stats-title"
            className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Financial literacy is a crisis.<br />
            <span className="gradient-text">We&apos;re the solution.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#A8C5E8" }}>
            Two-thirds of adults worldwide can&apos;t pass a basic financial literacy test. FinWise is changing that.
          </p>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" role="list">
          {stats.map((stat, i) => (
            <article
              key={i}
              role="listitem"
              className="rounded-2xl p-8 text-center transition-all duration-250 hover:-translate-y-1.5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="text-5xl font-black tracking-tight leading-none mb-3"
                style={{
                  background: "linear-gradient(135deg, #fff 0%, #5EECC5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#A8C5E8" }}>
                {stat.label}
              </p>
            </article>
          ))}
        </div>

        {/* Progress strip */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h3 className="text-base font-bold text-white mb-6">Popular topics on FinWise this week</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
            {progressItems.map((item) => (
              <div key={item.name} role="listitem">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: "#A8C5E8" }}>{item.name}</span>
                  <span className="text-sm font-bold" style={{ color: "#00C896" }}>{item.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full progress-fill"
                    style={{ width: `${item.pct}%`, background: "linear-gradient(90deg, #00A87E, #00C896)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
