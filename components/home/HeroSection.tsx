"use client";

import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

export function HeroSection() {
  /* Animated trust stats — hooks at top level, rendered in map below */
  const learnerCount = useAnimatedCounter({ target: 50, suffix: "K+", duration: 2200 });
  const topicCount = useAnimatedCounter({ target: 120, suffix: "+", duration: 1800 });
  const ratingCount = useAnimatedCounter({ target: 4.9, suffix: "★", decimals: 1, duration: 1600 });

  const trustStats = [
    { counterRef: learnerCount.ref, display: learnerCount.display, label: "Active Learners" },
    { counterRef: topicCount.ref, display: topicCount.display, label: "Finance Topics" },
    { counterRef: ratingCount.ref, display: ratingCount.display, label: "User Rating" },
  ];

  return (
    <section
      className="relative min-h-[calc(100vh-68px)] flex items-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #040D1A 0%, #0A1628 45%, #122040 100%)" }}
      aria-labelledby="hero-title"
    >
      {/* Ambient orbs + grid */}
      <AmbientBackground variant="dark" showGrid />

      {/* Floating decorative elements */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: "14%", right: "11%",
            width: "72px", height: "72px",
            border: "1px solid rgba(0, 200, 150, 0.07)",
            borderRadius: "50%",
            animationDelay: "0.8s",
          }}
        />
        <div
          className="absolute animate-float"
          style={{
            bottom: "22%", left: "7%",
            width: "18px", height: "18px",
            border: "1px solid rgba(94, 236, 197, 0.10)",
            transform: "rotate(45deg)",
            animationDelay: "1.6s",
          }}
        />
        <div
          className="absolute animate-float"
          style={{
            top: "62%", right: "24%",
            width: "5px", height: "5px",
            borderRadius: "50%",
            background: "rgba(0, 200, 150, 0.15)",
            animationDelay: "2.2s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

        {/* ── Left: Copy ── */}
        <div>
          {/* Kicker pill */}
          <div
            className="inline-flex items-center gap-2 px-1 pr-4 py-1 rounded-full mb-8 animate-slide-up"
            style={{ background: "rgba(0,200,150,0.10)", border: "1px solid rgba(0,200,150,0.20)" }}
          >
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: "#00C896", color: "#040D1A" }}
            >
              New
            </span>
            <span className="text-sm font-medium" style={{ color: "#5EECC5" }}>
              Financial literacy, reimagined for Gen Z
            </span>
          </div>

          <h1
            id="hero-title"
            className="text-5xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.08] text-white mb-6 animate-slide-up delay-100"
          >
            Understand Money.<br />
            Make{" "}
            <span className="gradient-text">Better Decisions.</span>
          </h1>

          <p className="text-lg leading-relaxed mb-10 max-w-[480px] animate-slide-up delay-200"
             style={{ color: "#A8C5E8" }}>
            FinWise makes personal finance simple and practical — no jargon, no spreadsheets.
            Learn saving, budgeting, investing, and more at your own pace.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-14 animate-slide-up delay-300">
            <MagneticButton>
              <Button href="/learn" variant="primary" size="xl" id="hero-cta-learn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start Learning
              </Button>
            </MagneticButton>
            <Button href="/tools" variant="ghost" size="xl" id="hero-cta-tools">
              Explore Tools →
            </Button>
          </div>

          {/* Trust stats — animated counters */}
          <div className="flex flex-wrap items-center gap-6 animate-slide-up delay-400" aria-label="Platform statistics">
            {trustStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-9 bg-white/15" aria-hidden="true" />}
                <div>
                  <div
                    ref={stat.counterRef as React.RefObject<HTMLDivElement>}
                    className="text-xl font-bold text-white leading-none"
                  >
                    {stat.display}
                  </div>
                  <div className="text-xs mt-0.5 uppercase tracking-wider" style={{ color: "#A8C5E8" }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Dashboard mockup ── */}
        <div className="flex justify-center lg:justify-end animate-slide-up delay-200" aria-hidden="true">
          <TiltCard className="w-full max-w-[460px]">
            <div
              className="w-full rounded-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(20px)" }}
            >
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-white">My Financial Overview</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ color: "#00C896", background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.2)" }}>
                  Live Preview
                </span>
              </div>

              {/* Balance */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#A8C5E8" }}>Net Worth</div>
                <div className="text-4xl font-bold text-white tracking-tight leading-none">$24,830</div>
                <div className="flex items-center gap-1 mt-2 text-sm font-semibold" style={{ color: "#00C896" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  +12.4% this month
                </div>
              </div>

              {/* Sparkline — animated draw */}
              <div className="h-16 mb-6 rounded-lg overflow-hidden">
                <svg viewBox="0 0 380 70" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#00C896" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00C896" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,55 C30,50 50,45 80,38 C110,31 130,35 160,28 C190,21 210,30 240,18 C270,6 300,12 330,8 C355,4 370,10 380,5"
                        fill="none" stroke="#00C896" strokeWidth="2" strokeLinecap="round"
                        className="sparkline-animate" />
                  <path d="M0,55 C30,50 50,45 80,38 C110,31 130,35 160,28 C190,21 210,30 240,18 C270,6 300,12 330,8 C355,4 370,10 380,5 L380,70 L0,70 Z"
                        fill="url(#sparkGrad)"
                        className="sparkline-fill-animate" />
                  <circle cx="240" cy="18" r="3" fill="#00C896" className="sparkline-fill-animate" />
                  <circle cx="380" cy="5"  r="4" fill="#00C896" className="sparkline-fill-animate" />
                </svg>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Savings",     value: "$8,400",  change: "↑ 5.2%",  up: true },
                  { label: "Investments", value: "$12,100", change: "↑ 18.7%", up: true },
                  { label: "Monthly",     value: "$4,330",  change: "↓ 1.3%",  up: false },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 transition-colors duration-200"
                       style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#A8C5E8" }}>{s.label}</div>
                    <div className="text-sm font-bold text-white">{s.value}</div>
                    <div className={`text-[10px] mt-0.5 font-semibold ${s.up ? "text-[#00C896]" : "text-red-400"}`}>{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Goals */}
              <div className="space-y-3">
                {[
                  { name: "Emergency Fund",  pct: 76, color: "#00C896" },
                  { name: "Vacation Fund",   pct: 45, color: "#F59E0B" },
                ].map((goal) => (
                  <div key={goal.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs" style={{ color: "#A8C5E8" }}>{goal.name}</span>
                      <span className="text-xs font-bold" style={{ color: goal.color }}>{goal.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full progress-fill" style={{ width: `${goal.pct}%`, background: goal.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
