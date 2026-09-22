import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Landmark,
} from "lucide-react";
import { LEARNING_MODULES, LearningModule } from "../data/learningModules";

interface LearnViewProps {
  onAskAboutTopic: (topicTitle: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onAskAboutTopic }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("budgeting-50-30-20");

  const categories = ["All", "Budgeting", "Investing", "Savings", "Debt & Credit", "Economics"];

  const filteredModules =
    selectedCategory === "All"
      ? LEARNING_MODULES
      : LEARNING_MODULES.filter((m) => m.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 bg-amber-500/10 border border-amber-500/25">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-wallstreet">
            Capital Markets Curriculum
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-wallstreet tracking-tight">
          Financial Fundamentals, <span className="gold-gradient-text">Empirical Models</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Master personal finance principles with rigorous empirical frameworks, Wall Street market history, and practical balance sheet rules.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-white bg-[#0E121B] border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Module Accordions / Cards */}
      <div className="space-y-4">
        {filteredModules.map((module) => {
          const isExpanded = expandedId === module.id;

          return (
            <div
              key={module.id}
              className={`glass-panel rounded-3xl transition-all duration-300 border ${
                isExpanded ? "border-amber-500/40 shadow-xl" : "border-slate-800 hover:border-slate-700"
              } overflow-hidden`}
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(module.id)}
                className="p-6 cursor-pointer flex items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-400 font-wallstreet">
                    <span>{module.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400 font-sans">
                      <Clock className="w-3 h-3" /> {module.readTime}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-sans">{module.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-wallstreet leading-snug">{module.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{module.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAboutTopic(module.title);
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 hover:border-amber-500/50 transition-colors"
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Transcribe to Ledger</span>
                  </button>
                  <div className="p-2 rounded-xl glass-surface border-slate-700 text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-6 animate-in fade-in duration-200">
                  {/* Key Takeaways Callout */}
                  <div className="p-4 rounded-2xl bg-[#0E121B] border border-amber-500/20 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-wallstreet block">
                      Core Institutional Takeaways:
                    </span>
                    <ul className="space-y-1.5">
                      {module.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Body Sections */}
                  {module.content.map((sec, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-sm font-bold text-white font-wallstreet">{sec.sectionTitle}</h4>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {p}
                        </p>
                      ))}
                      {sec.example && (
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/20 to-transparent border-l-2 border-amber-400 text-xs text-amber-200/90 leading-relaxed mt-2">
                          <strong>Empirical Case Study:</strong> {sec.example}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Action footer */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => onAskAboutTopic(module.title)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] flex items-center gap-2 transition-all cursor-pointer shadow-md font-data"
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Transcribe Topic to Advisory Ledger</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
