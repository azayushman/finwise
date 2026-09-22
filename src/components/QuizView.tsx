import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Star,
  Landmark,
} from "lucide-react";
import { QUIZ_QUESTIONS } from "../data/quizData";
import { QuizQuestion, UserProfile } from "../types";

interface QuizViewProps {
  user: UserProfile;
  onScoreSaved?: (score: number, total: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ user, onScoreSaved }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const total = QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: index,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers({});
    setIsCompleted(false);
  };

  useEffect(() => {
    if (isCompleted) {
      localStorage.setItem(
        "finwise_quiz_progress",
        JSON.stringify({ score, total, completedAt: new Date().toISOString() })
      );
      if (onScoreSaved) {
        onScoreSaved(score, total);
      }
    }
  }, [isCompleted, score, total, onScoreSaved]);

  const getRankBadge = (scoreRatio: number) => {
    if (scoreRatio >= 0.85) {
      return {
        title: "Institutional Wealth Strategist",
        desc: "Superior capital allocation mastery! You possess sharp risk discernment, compounding arithmetic intuition, and debt defense.",
        color: "text-amber-300",
        border: "border-amber-500/50",
        bg: "bg-amber-950/30",
      };
    }
    if (scoreRatio >= 0.65) {
      return {
        title: "Disciplined Capital Allocator",
        desc: "Strong financial foundation! You understand the 50/30/20 balance sheet, defensive reserves, and dollar-cost averaging well.",
        color: "text-amber-200",
        border: "border-amber-500/30",
        bg: "bg-slate-900/60",
      };
    }
    return {
      title: "Market Apprentice",
      desc: "Promising start! Build further depth by examining the Foundations Curriculum and consulting the Wall Street Advisor.",
      color: "text-slate-300",
      border: "border-slate-800",
      bg: "bg-[#0E121B]",
    };
  };

  const rank = getRankBadge(score / total);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 bg-amber-500/10 border border-amber-500/25">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-wallstreet">
            15-Question Institutional Benchmark
          </span>
        </div>
        <h1 className="text-3xl font-black text-white font-wallstreet tracking-tight">
          Financial Acumen <span className="gold-gradient-text">Examination</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Evaluate your understanding of capital preservation, compound durations, systematic equity allocation, and credit liabilities.
        </p>
      </div>

      {!isCompleted ? (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-amber-500/20">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-wallstreet">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Benchmark Question {currentIndex + 1} of {total}
              </span>
              <span className="text-white font-data">Cumulative Score: {score}</span>
            </div>
            <div className="w-full h-2 bg-[#080B10] rounded-full overflow-hidden border border-slate-800">
              <div
                style={{ width: `${Math.round(((currentIndex + 1) / total) * 100)}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
              />
            </div>
          </div>

          {/* Question Tag */}
          <div className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-3 font-wallstreet">
            {currentQ.category}
          </div>

          {/* Question Prompt */}
          <h2 className="text-lg sm:text-xl font-bold text-white font-wallstreet mb-6 leading-snug">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              let optionStyle = "bg-[#0E121B] border-slate-800 hover:border-amber-500/40 text-slate-200";

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  optionStyle = "bg-emerald-950/60 border-emerald-400/80 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                } else if (idx === selectedOption) {
                  optionStyle = "bg-rose-950/60 border-rose-500/80 text-rose-200";
                } else {
                  optionStyle = "opacity-40 border-slate-900";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all duration-200 flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-data">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback section when answered */}
          {isAnswered && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121B] border border-slate-800 mb-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 font-wallstreet">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Analysis
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Flawed Strategy
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md"
                id="quiz-next-btn"
              >
                <span>{currentIndex < total - 1 ? "Next Inflow Query" : "Calculate Benchmark Grade"}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-300 border border-amber-500/25">
          <div className="inline-flex p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Award className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold font-wallstreet">
              Benchmark Completed
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-wallstreet mt-1">
              Final Score: <span className="text-amber-300 font-data">{score} / {total}</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400 block mt-1 font-data">
              ({Math.round((score / total) * 100)}% Proficiency Benchmark)
            </span>
          </div>

          {/* Rank Badge */}
          <div className={`p-6 rounded-2xl border ${rank.border} ${rank.bg} max-w-md mx-auto`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className={`text-base font-bold font-wallstreet ${rank.color}`}>{rank.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              {rank.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-200 glass-surface border-slate-700 hover:border-amber-400 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Retake Benchmark</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
