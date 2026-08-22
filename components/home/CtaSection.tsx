import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

export function CtaSection() {
  return (
    <section className="py-24 bg-white" aria-label="Call to action">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div
            className="relative rounded-3xl p-16 text-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
          >
            <AmbientBackground variant="dark" />

            <div className="relative z-10">
              <SectionLabel className="justify-center">Get Started Free</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                Your financial future starts today.
              </h2>
              <p className="text-lg max-w-lg mx-auto mb-10" style={{ color: "#A8C5E8" }}>
                Join over 50,000 learners building better money habits with FinWise — completely free.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticButton>
                  <Button href="/learn" variant="primary" size="xl" id="cta-start-btn">
                    Start Learning — It&apos;s Free
                  </Button>
                </MagneticButton>
                <Button href="/assistant" variant="ghost" size="xl" id="cta-assistant-btn">
                  Ask the AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
