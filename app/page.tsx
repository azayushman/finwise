import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[#F5F7FF] pb-24">
      {/* ── Background Elements ── */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] rounded-full blur-[150px] -z-10 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)" }}
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full blur-[120px] -z-10 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06), transparent 70%)" }}
        aria-hidden="true" 
      />

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-32 lg:pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <ScrollReveal direction="up" delay={0}>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 glass-surface">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                Financial Clarity, Simplified
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
              Take control of your money.<br />
              <span className="gradient-text font-semibold">Build better financial habits.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg sm:text-xl text-[#CBD5E1] max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              FinWise makes personal finance simple and practical for young adults. Learn saving, budgeting, and investing without the complex jargon.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/budget" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#6D5DFB]/15 border border-[#8B5CF6]/30 shadow-[0_8px_32px_rgba(109,93,251,0.15)] backdrop-blur-md hover:bg-[#6D5DFB]/25 hover:border-[#8B5CF6]/50 text-white font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_8px_32px_rgba(109,93,251,0.25)] hover:-translate-y-0.5"
              >
                Start Planning
              </Link>
              <Link 
                href="/learn" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-surface hover:bg-white/5 text-[#E2E8F0] hover:text-white font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore FinWise
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero Abstract Graphic / Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-none hidden md:block relative">
          <ScrollReveal direction="up" delay={400}>
            <div className="glass-panel rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-xl glass-surface flex items-center justify-center border border-white/5">
                  <span className="text-2xl" aria-hidden="true">📈</span>
                </div>
                <div className="px-3 py-1 rounded-full glass-surface text-xs font-semibold text-[#C4B5FD]">
                  Net Worth
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-1/3 glass-surface rounded-full" />
                <div className="h-10 w-2/3 bg-[#6D5DFB]/15 border border-[#8B5CF6]/30 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm" />
                <div className="h-4 w-1/2 glass-surface rounded-full" />
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="h-16 rounded-xl glass-surface" />
                <div className="h-16 rounded-xl glass-surface" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Trust / Value Strip ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-32">
        <ScrollReveal direction="up" delay={500}>
          <div className="glass-surface rounded-2xl p-6 sm:p-8 flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm font-semibold text-slate-300 tracking-wider uppercase text-center">
            <span className="flex items-center gap-2"><span className="text-[#8B5CF6]" aria-hidden="true">✦</span> Smart Budgeting</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
            <span className="flex items-center gap-2"><span className="text-[#8B5CF6]" aria-hidden="true">✦</span> Goal-Based Saving</span>
            <span className="hidden lg:block w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
            <span className="flex items-center gap-2"><span className="text-[#8B5CF6]" aria-hidden="true">✦</span> Interactive Learning</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
            <span className="flex items-center gap-2"><span className="text-[#8B5CF6]" aria-hidden="true">✦</span> AI-Powered Guidance</span>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Product Preview Grid ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center lg:text-left">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Everything you need to master your finances.
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Four powerful pillars designed to take you from financial beginner to confident money manager.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Budget */}
          <ScrollReveal direction="up" delay={100} className="h-full">
            <Link href="/budget" className="block h-full group">
              <div className="glass-panel h-full rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] hover:border-white/10 flex flex-col">
                <div className="w-14 h-14 rounded-2xl glass-surface flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
                  💰
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">Budget</h3>
                <p className="text-slate-300 leading-relaxed mb-8 flex-1">
                  Plan where your money goes. Track your income and expenses with our intuitive, visual planner.
                </p>
                <div className="font-semibold text-[#A78BFA] group-hover:text-[#C4B5FD] flex items-center gap-2 transition-colors">
                  Start budgeting <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Savings */}
          <ScrollReveal direction="up" delay={200} className="h-full">
            <Link href="/savings" className="block h-full group">
              <div className="glass-panel h-full rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] hover:border-white/10 flex flex-col">
                <div className="w-14 h-14 rounded-2xl glass-surface flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
                  🏦
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">Savings</h3>
                <p className="text-slate-300 leading-relaxed mb-8 flex-1">
                  Build toward meaningful goals. Set targets, visualise your progress, and see the power of compound interest.
                </p>
                <div className="font-semibold text-[#A78BFA] group-hover:text-[#C4B5FD] flex items-center gap-2 transition-colors">
                  Set a goal <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Learn */}
          <ScrollReveal direction="up" delay={300} className="h-full">
            <Link href="/learn" className="block h-full group">
              <div className="glass-panel h-full rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] hover:border-white/10 flex flex-col">
                <div className="w-14 h-14 rounded-2xl glass-surface flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
                  📚
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">Learn</h3>
                <p className="text-slate-300 leading-relaxed mb-8 flex-1">
                  Understand money without the jargon. Bite-sized lessons on everything from credit scores to investing.
                </p>
                <div className="font-semibold text-[#A78BFA] group-hover:text-[#C4B5FD] flex items-center gap-2 transition-colors">
                  Explore lessons <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* AI Assistant */}
          <ScrollReveal direction="up" delay={400} className="h-full">
            <Link href="/assistant" className="block h-full group">
              <div className="glass-panel h-full rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] hover:border-white/10 flex flex-col relative overflow-hidden">
                {/* Subtle AI gradient background for this specific card */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.05),transparent_60%)] pointer-events-none" aria-hidden="true" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl glass-surface flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
                    ✨
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">AI Assistant</h3>
                  <p className="text-slate-300 leading-relaxed mb-8">
                    Get simple financial guidance instantly. Ask questions about personal finance, safe spending, and smart saving.
                  </p>
                  <div className="font-semibold text-[#A78BFA] group-hover:text-[#C4B5FD] flex items-center gap-2 transition-colors">
                    Ask FinWise AI <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
