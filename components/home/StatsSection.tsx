"use client";

import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

const progressItems = [
  { name: "Compound Interest",         pct: 94 },
  { name: "Building an Emergency Fund", pct: 87 },
  { name: "Credit Score Basics",        pct: 79 },
  { name: "Index Fund Investing",       pct: 71 },
];

export function StatsSection() {
  /* Animated stat values */
  const stat1 = useAnimatedCounter({ target: 66, suffix: "%", duration: 2000 });
  const stat2 = useAnimatedCounter({ target: 1.5, prefix: "$", suffix: "T", decimals: 1, duration: 2200 });
  const stat3 = useAnimatedCounter({ target: 78, suffix: "%", duration: 1800 });
  const stat4 = useAnimatedCounter({ target: 50, suffix: "K+", duration: 2000 });

  const stats = [
    { counterRef: stat1.ref, display: stat1.display, label: "of adults fail basic financial literacy tests globally" },
    { counterRef: stat2.ref, display: stat2.display, label: "in student loan debt — many unaware of repayment options" },
    { counterRef: stat3.ref, display: stat3.display, label: "of workers live paycheck-to-paycheck without a safety net" },
    { counterRef: stat4.ref, display: stat4.display, label: "FinWise learners have improved their financial confidence" },
  ];

  /* Progress bar scroll-triggered animation */
  const progressRef = useRef<HTMLDivElement>(null);
  const [progressVisible, setProgressVisible] = useState(false);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgressVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgressVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#07111F" }}
      aria-labelledby="stats-title"
    >
      <AmbientBackground variant="subtle-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <ScrollReveal as="header" className="text-center mb-16" direction="up">
          <SectionLabel className="justify-center">By the Numbers</SectionLabel>
          <h2
            id="stats-title"
            className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Financial literacy is a crisis.<br />
            <span className="gradient-text">We&apos;re the solution.</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            Two-thirds of adults worldwide can&apos;t pass a basic financial literacy test. FinWise is changing that.
          </p>
        </ScrollReveal>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" role="list">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 100} as="article" className="h-full">
              <div
                role="listitem"
                className="rounded-2xl p-8 text-center h-full transition-all duration-250 hover:-translate-y-1.5"
                style={{ background: "rgba(11,31,58,0.8)", border: "1px solid rgba(139,92,246,0.18)" }}
              >
                <div
                  ref={stat.counterRef as React.RefObject<HTMLDivElement>}
                  className="text-5xl font-black tracking-tight leading-none mb-3"
                  style={{
                    background: "linear-gradient(135deg, #FFF 0%, #C4B5FD 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.display}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Progress strip */}
        <ScrollReveal direction="up">
          <div
            ref={progressRef}
            className="rounded-2xl p-8"
            style={{ background: "rgba(16,42,76,0.6)", border: "1px solid rgba(139,92,246,0.18)" }}
          >
            <h3 className="text-base font-bold text-white mb-6">Popular topics on FinWise this week</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
              {progressItems.map((item) => (
                <div key={item.name} role="listitem">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: "#94A3B8" }}>{item.name}</span>
                    <span className="text-sm font-bold" style={{ color: "#8B5CF6" }}>{item.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(11,31,58,0.8)" }}>
                    <div
                      className="h-full rounded-full progress-fill"
                      style={{
                        width: progressVisible ? `${item.pct}%` : "0%",
                        background: "linear-gradient(90deg, #4F46E5, #8B5CF6)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
