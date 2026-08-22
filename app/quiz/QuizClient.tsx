"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";

/* ══════════════════════════════════════════════════════════════════════════
   Question Bank
   ══════════════════════════════════════════════════════════════════════════ */

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number; // index
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

/* ══════════════════════════════════════════════════════════════════════════
   Category metadata
   ══════════════════════════════════════════════════════════════════════════ */

const CATEGORY_COLORS: Record<string, string> = {
  Budgeting: "#4A80BF", Saving: "#00C896", "Compound Interest": "#8B5CF6",
  Inflation: "#F59E0B", "Credit Scores": "#EC4899", Investing: "#2E5F9A",
  Diversification: "#14B8A6", Risk: "#EF4444",
};

/* ══════════════════════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════════════════════ */

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
      color: CATEGORY_COLORS[name] || "#6B7280",
    }));
  }, [answers]);

  /* ── Grade ── */
  const grade = percentage >= 90 ? { label: "Outstanding!", emoji: "🏆", color: "#00C896" }
    : percentage >= 70 ? { label: "Great Job!", emoji: "⭐", color: "#00A87E" }
    : percentage >= 50 ? { label: "Good Start", emoji: "💪", color: "#F59E0B" }
    : { label: "Keep Learning", emoji: "📚", color: "#EF4444" };

  /* ── Handlers ── */
  function handleSelectOption(optIdx: number) {
    if (showFeedback) return; // locked after submit
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

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <AmbientBackground variant="dark" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionLabel>Knowledge Quiz</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Test Your<br />
            <span className="gradient-text">Financial IQ.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#A8C5E8" }}>
            {totalQuestions} questions across {categoryBreakdown.length} topics. Find your gaps,
            reinforce your knowledge, and level up your financial literacy.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ════════════════ INTRO SCREEN ════════════════ */}
        {state === "intro" && (
          <ScrollReveal direction="up">
            <div className="text-center">
              {/* Quiz info card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-10 mb-8">
                <div className="text-6xl mb-4">🧠</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Financial Literacy Quiz</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                  Test your knowledge of budgeting, saving, investing, credit, and more.
                  Each question includes a beginner-friendly explanation.
                </p>
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  {[
                    { value: totalQuestions.toString(), label: "Questions" },
                    { value: categoryBreakdown.length.toString(), label: "Topics" },
                    { value: "~8 min", label: "Duration" },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="text-2xl font-black" style={{ color: "#00C896" }}>{s.value}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Topic coverage */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {categoryBreakdown.map(c => (
                    <span
                      key={c.name}
                      className="px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{ color: c.color, borderColor: c.color + "40", background: c.color + "10" }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="px-10 py-4 rounded-full text-lg font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
                >
                  Start Quiz →
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ════════════════ ACTIVE QUIZ / REVIEW ════════════════ */}
        {(state === "active" || state === "review") && (
          <div>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  {state === "review" ? "Reviewing" : "Question"} {currentIdx + 1} of {totalQuestions}
                </span>
                <span className="text-sm font-semibold" style={{ color: "#00C896" }}>
                  {Math.round(((currentIdx + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                    background: "linear-gradient(90deg, #00C896, #00A87E)",
                  }}
                />
              </div>
            </div>

            {/* Question dots */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {QUESTIONS.map((_, i) => {
                const answered = answers[i] !== null;
                const isCorrect = answered && answers[i] === QUESTIONS[i].correct;
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={i}
                    onClick={() => handleJumpTo(i)}
                    className={`w-7 h-7 rounded-full text-[10px] font-bold transition-all duration-150 border ${
                      isCurrent
                        ? "border-[#00C896] scale-110 shadow-md"
                        : answered
                          ? isCorrect
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-red-300 bg-red-50 text-red-700"
                          : "border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                    style={isCurrent ? { background: "#00C896", color: "#fff", borderColor: "#00C896" } : undefined}
                    aria-label={`Go to question ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Question card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant={
                    q.category === "Budgeting" ? "green"
                    : q.category === "Investing" ? "purple"
                    : q.category === "Credit Scores" ? "amber"
                    : "navy"
                  }
                >
                  {q.category}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-relaxed mb-6">
                {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-3" role="radiogroup" aria-label="Answer options">
                {q.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrectOpt = i === q.correct;
                  const isWrongSelected = showFeedback && isSelected && !isCorrectOpt;
                  const isCorrectShown = showFeedback && isCorrectOpt;

                  let borderColor = "border-slate-200";
                  let bgColor = "bg-white";
                  let textColor = "text-slate-700";
                  let circleStyle: React.CSSProperties = { background: "#F1F5F9", color: "#64748B" };

                  if (isCorrectShown) {
                    borderColor = "border-green-400";
                    bgColor = "bg-green-50";
                    textColor = "text-slate-900";
                    circleStyle = { background: "#00C896", color: "#fff" };
                  } else if (isWrongSelected) {
                    borderColor = "border-red-400";
                    bgColor = "bg-red-50";
                    textColor = "text-slate-900";
                    circleStyle = { background: "#EF4444", color: "#fff" };
                  } else if (isSelected) {
                    borderColor = "border-[#00C896]";
                    bgColor = "bg-[#00C896]/5";
                    textColor = "text-slate-900";
                    circleStyle = { background: "#00C896", color: "#fff" };
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(i)}
                      disabled={showFeedback}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left text-sm font-medium transition-all duration-150 ${borderColor} ${bgColor} ${textColor} ${
                        !showFeedback ? "hover:border-[#00C896] hover:bg-[#00C896]/5 cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-150"
                        style={circleStyle}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isCorrectShown && <span className="text-xs font-bold text-green-600">✓ Correct</span>}
                      {isWrongSelected && <span className="text-xs font-bold text-red-500">✗ Wrong</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showFeedback && (
                <div className="mt-5 p-4 rounded-xl" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5">💡</span>
                    <div>
                      <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Explanation</div>
                      <p className="text-sm text-green-800 leading-relaxed">{q.explanation}</p>
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
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                ← Previous
              </button>
              <div className="flex gap-3">
                {!showFeedback && state === "active" && (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none"
                    style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
                  >
                    Submit Answer
                  </button>
                )}
                {showFeedback && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
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
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center mb-8">
                <div className="text-6xl mb-3">{grade.emoji}</div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">{grade.label}</h2>
                <p className="text-slate-500 text-sm mb-6">You got {score} out of {totalQuestions} questions correct</p>

                {/* Score ring */}
                <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto mb-6" aria-hidden="true">
                  <circle cx="80" cy="80" r="64" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                  <circle
                    cx="80" cy="80" r="64"
                    fill="none"
                    stroke={grade.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 64} ${2 * Math.PI * 64}`}
                    strokeDashoffset={2 * Math.PI * 64 / 4}
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                  <text x="80" y="72" textAnchor="middle" className="fill-slate-900 text-[32px] font-black">{percentage}%</text>
                  <text x="80" y="94" textAnchor="middle" className="fill-slate-400 text-[11px] font-medium">score</text>
                </svg>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
                  >
                    Restart Quiz
                  </button>
                  <button
                    onClick={handleReviewAnswers}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    Review Answers
                  </button>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-5">Performance by Topic</h3>
                <div className="space-y-4">
                  {categoryBreakdown.map(cat => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                          <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: cat.pct >= 70 ? "#00C896" : cat.pct >= 40 ? "#F59E0B" : "#EF4444" }}>
                          {cat.correct}/{cat.total} ({cat.pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full progress-fill"
                          style={{ width: `${cat.pct}%`, background: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div
                className="rounded-2xl p-8 text-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)" }}
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
                     style={{ background: "radial-gradient(circle, #00C896, transparent 70%)" }} aria-hidden="true" />
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Want to learn more?</h3>
                <p className="text-sm mb-5 relative z-10" style={{ color: "#A8C5E8" }}>
                  Explore our learning hub to strengthen the topics where you scored lowest.
                </p>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg relative z-10"
                  style={{ background: "linear-gradient(135deg, #00C896 0%, #00A87E 100%)" }}
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
