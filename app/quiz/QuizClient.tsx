"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ══════════════════════════════════════════════════════════════════════════
   Question Bank
   ══════════════════════════════════════════════════════════════════════════ */

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1, category: "Budgeting",
    question: "In the popular 50/30/20 budgeting rule, what does the \"50\" represent?",
    options: ["50% for savings", "50% for wants", "50% for needs", "50% for investments"],
    correct: 2,
    explanation: "The 50/30/20 rule suggests allocating 50% of after-tax income to needs (rent, groceries, utilities), 30% to wants, and 20% to savings and debt repayment.",
  },
  {
    id: 2, category: "Saving",
    question: "How many months of expenses should an emergency fund ideally cover?",
    options: ["1–2 months", "3–6 months", "12 months", "24 months"],
    correct: 1,
    explanation: "Financial experts generally recommend keeping 3–6 months of essential expenses in an easily accessible emergency fund to cover unexpected events like job loss or medical bills.",
  },
  {
    id: 3, category: "Compound Interest",
    question: "If you invest $1,000 at 7% annual compound interest, approximately how much will you have after 10 years?",
    options: ["$1,700", "$1,838", "$1,967", "$2,105"],
    correct: 2,
    explanation: "Using the compound interest formula: $1,000 × (1.07)¹⁰ = $1,967.15. Compound interest earns interest on interest, making your money grow exponentially over time.",
  },
  {
    id: 4, category: "Inflation",
    question: "If inflation is 3% per year, what happens to the purchasing power of $100 after one year?",
    options: ["It increases to $103", "It stays at $100", "It falls to about $97", "It falls to $90"],
    correct: 2,
    explanation: "Inflation erodes purchasing power. At 3% inflation, $100 today can only buy about $97 worth of goods next year. This is why saving in accounts that beat inflation is important.",
  },
  {
    id: 5, category: "Credit Scores",
    question: "Which factor has the LARGEST impact on your credit score?",
    options: ["Length of credit history", "Payment history", "Types of credit", "New credit inquiries"],
    correct: 1,
    explanation: "Payment history accounts for roughly 35% of your FICO score — the single largest factor. Consistently paying bills on time is the most important thing you can do for your credit.",
  },
  {
    id: 6, category: "Investing",
    question: "What is an index fund?",
    options: [
      "A fund managed by a single stock picker",
      "A fund that tracks a specific market index like the S&P 500",
      "A savings account with a fixed interest rate",
      "A government bond with guaranteed returns",
    ],
    correct: 1,
    explanation: "An index fund passively tracks a market index (like the S&P 500), giving you broad market exposure with low fees. Warren Buffett famously recommends them for most investors.",
  },
  {
    id: 7, category: "Diversification",
    question: "What is the primary purpose of diversification in investing?",
    options: ["To guarantee profits", "To reduce risk by spreading investments", "To maximise returns", "To avoid paying taxes"],
    correct: 1,
    explanation: "Diversification reduces risk by spreading your money across different asset classes, sectors, and geographies. If one investment drops, others may hold steady or rise, cushioning your portfolio.",
  },
  {
    id: 8, category: "Saving",
    question: "What is the \"pay yourself first\" strategy?",
    options: [
      "Spending on wants before needs",
      "Automatically setting aside savings before spending on anything else",
      "Paying off debt before saving",
      "Investing only in yourself through education",
    ],
    correct: 1,
    explanation: "\"Pay yourself first\" means automatically transferring a portion of income to savings or investments before spending on bills or wants. It ensures saving isn't an afterthought.",
  },
  {
    id: 9, category: "Investing",
    question: "What does SIP stand for in investing?",
    options: [
      "Savings Interest Plan",
      "Systematic Investment Plan",
      "Standard Income Policy",
      "Strategic Investment Portfolio",
    ],
    correct: 1,
    explanation: "A Systematic Investment Plan (SIP) lets you invest a fixed amount regularly (e.g., monthly) into mutual funds. It uses rupee/dollar cost averaging to reduce the impact of market volatility.",
  },
  {
    id: 10, category: "Risk",
    question: "Generally, which type of investment carries the HIGHEST risk and potential return?",
    options: ["Government bonds", "Savings account", "Individual stocks", "Certificate of deposit"],
    correct: 2,
    explanation: "Individual stocks can offer high returns but also carry the highest risk since a single company's value can drop significantly. Bonds and savings accounts are safer but offer lower returns.",
  },
  {
    id: 11, category: "Budgeting",
    question: "What is the difference between a \"need\" and a \"want\"?",
    options: [
      "Needs are expensive, wants are cheap",
      "Needs are essential for survival, wants are nice to have",
      "Needs are monthly, wants are annual",
      "There is no real difference",
    ],
    correct: 1,
    explanation: "Needs are expenses essential for basic living — housing, food, healthcare, transport. Wants are non-essential items that improve quality of life — dining out, entertainment, subscriptions.",
  },
  {
    id: 12, category: "Compound Interest",
    question: "The \"Rule of 72\" is a quick way to estimate:",
    options: [
      "How much tax you'll pay",
      "How long it takes to double your money at a given interest rate",
      "The ideal savings rate",
      "The maximum credit card limit",
    ],
    correct: 1,
    explanation: "Divide 72 by the annual interest rate to estimate doubling time. At 8% interest: 72 ÷ 8 = 9 years to double your money. It's a quick mental math shortcut for compound growth.",
  },
  {
    id: 13, category: "Credit Scores",
    question: "What credit score range is generally considered \"good\" (FICO)?",
    options: ["300–500", "500–600", "670–739", "800–850"],
    correct: 2,
    explanation: "FICO scores range from 300–850. Scores of 670–739 are considered \"good,\" 740–799 \"very good,\" and 800+ \"exceptional.\" A good score helps you get lower interest rates on loans.",
  },
  {
    id: 14, category: "Inflation",
    question: "If a savings account pays 2% interest but inflation is 4%, what is happening to your real wealth?",
    options: [
      "Your wealth is growing at 2%",
      "Your wealth is growing at 6%",
      "Your wealth is shrinking by about 2% per year",
      "Nothing, inflation doesn't affect savings",
    ],
    correct: 2,
    explanation: "Real return = nominal return − inflation. With 2% interest and 4% inflation, you're losing about 2% of purchasing power annually. Your money amount grows, but buys less.",
  },
  {
    id: 15, category: "Diversification",
    question: "Which portfolio is MOST diversified?",
    options: [
      "100% in a single tech company",
      "50% stocks in one industry, 50% bonds",
      "Mix of domestic stocks, international stocks, bonds, and real estate",
      "100% in a high-yield savings account",
    ],
    correct: 2,
    explanation: "True diversification means spreading across multiple asset classes (stocks, bonds, real estate) AND geographies (domestic, international). This provides the best risk reduction.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Budgeting: "#8B5CF6", Saving: "#6D5DFB", "Compound Interest": "#A78BFA",
  Inflation: "#F59E0B", "Credit Scores": "#EC4899", Investing: "#3B82F6",
  Diversification: "#60A5FA", Risk: "#EF4444",
};

type QuizState = "intro" | "active" | "review" | "results";

export function QuizClient() {
  const [state, setState] = useState<QuizState>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const q = QUESTIONS[currentIdx];
  const totalQuestions = QUESTIONS.length;

  /* ── Score calculation ── */
  const score = useMemo(() => {
    let correct = 0;
    answers.forEach((a, i) => { if (a === QUESTIONS[i].correct) correct++; });
    return correct;
  }, [answers]);

  const percentage = Math.round((score / totalQuestions) * 100);

  /* ── Category breakdown ── */
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, { total: number; correct: number }> = {};
    QUESTIONS.forEach((q, i) => {
      if (!cats[q.category]) cats[q.category] = { total: 0, correct: 0 };
      cats[q.category].total++;
      if (answers[i] === q.correct) cats[q.category].correct++;
    });
    return Object.entries(cats).map(([name, data]) => ({
      name,
      ...data,
      pct: Math.round((data.correct / data.total) * 100),
      color: CATEGORY_COLORS[name] || "#6D5DFB",
    }));
  }, [answers]);

  /* ── Grade ── */
  const grade = percentage >= 90 ? { label: "Outstanding!", emoji: "🏆", color: "#8B5CF6" }
    : percentage >= 70 ? { label: "Great Job!", emoji: "⭐", color: "#6D5DFB" }
    : percentage >= 50 ? { label: "Good Start", emoji: "💪", color: "#F59E0B" }
    : { label: "Keep Learning", emoji: "📚", color: "#EF4444" };

  /* ── Handlers ── */
  function handleSelectOption(optIdx: number) {
    if (showFeedback) return;
    setSelectedOption(optIdx);
  }

  function handleSubmitAnswer() {
    if (selectedOption === null) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = selectedOption;
    setAnswers(newAnswers);
    setShowFeedback(true);
  }

  function handleNext() {
    if (currentIdx < totalQuestions - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedOption(answers[nextIdx]);
      setShowFeedback(answers[nextIdx] !== null);
    } else {
      setState("results");
    }
  }

  function handlePrev() {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setSelectedOption(answers[prevIdx]);
      setShowFeedback(answers[prevIdx] !== null);
    }
  }

  function handleJumpTo(idx: number) {
    setCurrentIdx(idx);
    setSelectedOption(answers[idx]);
    setShowFeedback(answers[idx] !== null);
  }

  function handleStartQuiz() {
    setState("active");
    setCurrentIdx(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSelectedOption(null);
    setShowFeedback(false);
  }

  function handleReviewAnswers() {
    setState("review");
    setCurrentIdx(0);
    setSelectedOption(answers[0]);
    setShowFeedback(true);
  }

  function handleRestart() {
    handleStartQuiz();
  }

  const catColor = CATEGORY_COLORS[q?.category] ?? "#8B5CF6";

  return (
    <div className="min-h-screen text-[#F5F7FF] relative">
      {/* ── Page ambient depth ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6D5DFB]/8 rounded-full blur-[120px] -z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4F46E5]/6 rounded-full blur-[100px] -z-10 pointer-events-none" aria-hidden="true" />

      {/* ════════════════ HERO ════════════════ */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 glass-surface">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                FinWise Quiz
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
              Test what you know<br />
              <span className="gradient-text">about money.</span>
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed text-[#94A3B8]">
              {totalQuestions} questions across {categoryBreakdown.length} topics. Find your gaps,
              reinforce your knowledge, and level up your financial literacy.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">

        {/* ════════════════ INTRO SCREEN ════════════════ */}
        {state === "intro" && (
          <ScrollReveal direction="up">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10 pointer-events-none"
                   style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }} aria-hidden="true" />

              <div className="text-6xl mb-5 relative z-10" aria-hidden="true">🧠</div>
              <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Financial Literacy Quiz</h2>
              <p className="text-sm text-[#94A3B8] max-w-md mx-auto mb-8 leading-relaxed relative z-10">
                Test your knowledge of budgeting, saving, investing, credit, and more.
                Each question includes a beginner-friendly explanation.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10">
                {[
                  { value: totalQuestions.toString(), label: "Questions" },
                  { value: categoryBreakdown.length.toString(), label: "Topics" },
                  { value: "~8 min", label: "Duration" },
                ].map(s => (
                  <div key={s.label} className="glass-surface rounded-xl px-5 py-3 min-w-[80px]">
                    <div className="text-2xl font-black text-[#8B5CF6]">{s.value}</div>
                    <div className="text-xs text-[#94A3B8] uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Topic coverage pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
                {categoryBreakdown.map(c => (
                  <span
                    key={c.name}
                    className="px-3 py-1 rounded-full text-xs font-semibold glass-surface"
                    style={{ color: c.color, borderColor: c.color + "40" }}
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              <button
                onClick={handleStartQuiz}
                className="px-10 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(109,93,251,0.5)] bg-[#6D5DFB] border border-white/10 relative z-10"
              >
                Start Quiz →
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* ════════════════ ACTIVE QUIZ / REVIEW ════════════════ */}
        {(state === "active" || state === "review") && (
          <div>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-300">
                  {state === "review" ? "Reviewing" : "Question"} {currentIdx + 1} of {totalQuestions}
                </span>
                <span className="text-sm font-bold text-[#8B5CF6]">
                  {Math.round(((currentIdx + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden glass-surface"
                role="progressbar"
                aria-valuenow={currentIdx + 1}
                aria-valuemin={1}
                aria-valuemax={totalQuestions}
                aria-label={`Question ${currentIdx + 1} of ${totalQuestions}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                    background: "linear-gradient(90deg, #6D5DFB, #8B5CF6)",
                    boxShadow: "0 0 8px rgba(109,93,251,0.5)",
                  }}
                />
              </div>
            </div>

            {/* Question dots navigator */}
            <div className="flex flex-wrap gap-1.5 mb-6" role="group" aria-label="Question navigation">
              {QUESTIONS.map((_, i) => {
                const answered = answers[i] !== null;
                const isCorrect = answered && answers[i] === QUESTIONS[i].correct;
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={i}
                    onClick={() => handleJumpTo(i)}
                    className={`w-7 h-7 rounded-full text-[10px] font-bold transition-all duration-200 border ${
                      isCurrent
                        ? "border-[#8B5CF6] scale-110 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                        : answered
                          ? isCorrect
                            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                            : "border-rose-500/50 bg-rose-500/20 text-rose-300"
                          : "glass-surface border-white/10 text-[#94A3B8] hover:border-white/20"
                    }`}
                    style={isCurrent ? { background: "#8B5CF6", color: "#fff", borderColor: "#8B5CF6" } : undefined}
                    aria-label={`Go to question ${i + 1}${answered ? (isCorrect ? " (correct)" : " (incorrect)") : ""}`}
                    aria-current={isCurrent ? "true" : undefined}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Question card */}
            <div className="glass-panel rounded-3xl p-7 sm:p-9 mb-6">
              {/* Category tag */}
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider glass-surface"
                  style={{ color: catColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: catColor }} aria-hidden="true" />
                  {q.category}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed mb-7">
                {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-3" role="radiogroup" aria-label="Answer options">
                {q.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrectOpt = i === q.correct;
                  const isWrongSelected = showFeedback && isSelected && !isCorrectOpt;
                  const isCorrectShown = showFeedback && isCorrectOpt;

                  let wrapperCls = "glass-surface border-white/10 text-slate-200";
                  let circleStyle: React.CSSProperties = { background: "rgba(255,255,255,0.06)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.1)" };
                  let hoverCls = !showFeedback ? "hover:-translate-y-0.5 hover:border-[#8B5CF6]/50 hover:shadow-[0_4px_16px_rgba(109,93,251,0.2)] cursor-pointer" : "cursor-default";

                  if (isCorrectShown) {
                    wrapperCls = "bg-emerald-950/30 border-emerald-400/50 text-white";
                    circleStyle = { background: "#10B981", color: "#fff", border: "none" };
                  } else if (isWrongSelected) {
                    wrapperCls = "bg-rose-950/30 border-rose-400/50 text-white";
                    circleStyle = { background: "#EF4444", color: "#fff", border: "none" };
                  } else if (isSelected) {
                    wrapperCls = "bg-[#6D5DFB]/15 border-[#8B5CF6]/60 text-white shadow-[0_0_16px_rgba(109,93,251,0.2)]";
                    circleStyle = { background: "#8B5CF6", color: "#fff", border: "none" };
                    hoverCls = "cursor-pointer";
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(i)}
                      disabled={showFeedback}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left text-sm font-medium transition-all duration-200 ${wrapperCls} ${hoverCls}`}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200"
                        style={circleStyle}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isCorrectShown && (
                        <span className="text-xs font-bold text-emerald-400 flex-shrink-0" aria-label="Correct answer">✓ Correct</span>
                      )}
                      {isWrongSelected && (
                        <span className="text-xs font-bold text-rose-400 flex-shrink-0" aria-label="Wrong answer">✗ Wrong</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showFeedback && (
                <div className="mt-6 p-5 rounded-2xl glass-surface border-[#8B5CF6]/20" role="status" aria-live="polite">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">💡</span>
                    <div>
                      <div className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider mb-1.5">Explanation</div>
                      <p className="text-sm text-slate-200 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 glass-surface border-white/10 hover:text-white hover:border-white/20 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
              >
                ← Previous
              </button>
              <div className="flex gap-3">
                {!showFeedback && state === "active" && (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(109,93,251,0.4)] disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0 bg-[#6D5DFB] border border-white/10"
                  >
                    Submit Answer
                  </button>
                )}
                {showFeedback && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(109,93,251,0.4)] bg-[#6D5DFB] border border-white/10"
                  >
                    {currentIdx < totalQuestions - 1 ? "Next →" : state === "review" ? "Back to Results" : "See Results →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ RESULTS SCREEN ════════════════ */}
        {state === "results" && (
          <ScrollReveal direction="up">
            <div>
              {/* Score card */}
              <div className="glass-panel rounded-3xl p-8 sm:p-10 text-center mb-8 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10 pointer-events-none"
                     style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }} aria-hidden="true" />
                <div className="text-6xl mb-4 relative z-10" aria-hidden="true">{grade.emoji}</div>
                <h2 className="text-3xl font-black text-white mb-2 relative z-10">{grade.label}</h2>
                <p className="text-[#94A3B8] text-sm mb-8 relative z-10">
                  You got <strong className="text-white">{score}</strong> out of <strong className="text-white">{totalQuestions}</strong> questions correct
                </p>

                {/* Score ring */}
                <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto mb-8 relative z-10" aria-hidden="true">
                  <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="80" cy="80" r="64"
                    fill="none"
                    stroke={grade.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 64} ${2 * Math.PI * 64}`}
                    strokeDashoffset={2 * Math.PI * 64 / 4}
                    style={{ transition: "stroke-dasharray 1s ease", filter: `drop-shadow(0 0 8px ${grade.color}88)` }}
                  />
                  <text x="80" y="72" textAnchor="middle" className="fill-white text-[32px] font-black">{percentage}%</text>
                  <text x="80" y="94" textAnchor="middle" className="fill-[#94A3B8] text-[11px] font-medium">score</text>
                </svg>

                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(109,93,251,0.4)] bg-[#6D5DFB] border border-white/10"
                  >
                    Restart Quiz
                  </button>
                  <button
                    onClick={handleReviewAnswers}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 glass-surface border-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    Review Answers
                  </button>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="glass-panel rounded-3xl p-7 sm:p-8 mb-8">
                <h3 className="text-lg font-bold text-white mb-6">Performance by Topic</h3>
                <div className="space-y-5">
                  {categoryBreakdown.map(cat => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} aria-hidden="true" />
                          <span className="text-sm font-medium text-slate-300">{cat.name}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: cat.pct >= 70 ? "#8B5CF6" : cat.pct >= 40 ? "#F59E0B" : "#EF4444" }}>
                          {cat.correct}/{cat.total} ({cat.pct}%)
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden glass-surface"
                        role="progressbar"
                        aria-valuenow={cat.pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${cat.name}: ${cat.pct}%`}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${cat.pct}%`, background: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                     style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }} aria-hidden="true" />
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Want to learn more?</h3>
                <p className="text-sm mb-6 relative z-10 text-[#94A3B8]">
                  Explore our learning hub to strengthen the topics where you scored lowest.
                </p>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(109,93,251,0.4)] relative z-10 bg-[#6D5DFB] border border-white/10"
                >
                  Browse Lessons →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
