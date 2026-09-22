import React from "react";
import { Landmark, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="border-t border-amber-500/15 bg-[#080B10]/95 backdrop-blur-xl mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white font-wallstreet tracking-wide">
                FIN<span className="text-amber-400">WISE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Wall Street grade financial literacy and capital allocation intelligence. Engineered to empower students and professionals with empirical cashflow models, mathematical budgeting, and disciplined compounding.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent Financial Principles • Zero Sponsored Bias</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-amber-300 font-wallstreet uppercase tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigateTab("learn")} className="hover:text-white transition-colors cursor-pointer">
                  Foundations Curriculum
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab("tools")} className="hover:text-white transition-colors cursor-pointer">
                  Capital Calculators
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab("budget")} className="hover:text-white transition-colors cursor-pointer">
                  Budget Blueprint (50/30/20)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab("quiz")} className="hover:text-white transition-colors cursor-pointer">
                  Literacy Benchmark Exam
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-amber-300 font-wallstreet uppercase tracking-wider mb-3">
              Institutional Notice
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Educational Disclaimer:</strong> FinWise provides conceptual financial education and empirical mathematical calculators. It does not provide certified financial advisory, brokerage execution, or tax counsel. All portfolio models are for educational evaluation.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} FinWise. Wall Street Heritage Intelligence & Client-Side Privacy.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Empirical Models</span>
            <span>•</span>
            <span>Audited Calculations</span>
            <span>•</span>
            <span>Zero Tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
