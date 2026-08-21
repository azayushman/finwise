import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function CtaSection() {
  return (
    <section className="py-24 bg-white" aria-label="Call to action">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative rounded-3xl p-16 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
        >
          {/* Decorative orbs */}
          <div aria-hidden="true"
               className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
               style={{ background: "radial-gradient(circle, #00C896, transparent 70%)" }} />
          <div aria-hidden="true"
               className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-20"
               style={{ background: "radial-gradient(circle, #2E5F9A, transparent 70%)" }} />

          <div className="relative z-10">
            <SectionLabel className="justify-center">Get Started Free</SectionLabel>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Your financial future starts today.
            </h2>
            <p className="text-lg max-w-lg mx-auto mb-10" style={{ color: "#A8C5E8" }}>
              Join over 50,000 learners building better money habits with FinWise — completely free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/learn" variant="primary" size="xl" id="cta-start-btn">
                Start Learning — It&apos;s Free
              </Button>
              <Button href="/assistant" variant="ghost" size="xl" id="cta-assistant-btn">
                Ask the AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
