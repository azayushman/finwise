import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Finance Quiz" };

const quizzes = [
  {
    icon: "📖",
    tag: "Beginner" as const,
    title: "Finance Fundamentals Quiz",
    desc: "Test your knowledge of the core concepts: budgeting, saving, credit, and investing. 10 questions, 5 minutes.",
    questions: 10,
    time: "~5 min",
    color: "#E8FFF8",
  },
  {
    icon: "💳",
    tag: "Credit" as const,
    title: "Credit & Debt Challenge",
    desc: "How well do you understand credit scores, APR, and smart debt management? 12 questions.",
    questions: 12,
    time: "~6 min",
    color: "#FEF3C7",
  },
  {
    icon: "📈",
    tag: "Investing" as const,
    title: "Investing IQ Test",
    desc: "From index funds to asset allocation — a challenging quiz for those ready to level up their knowledge.",
    questions: 15,
    time: "~8 min",
    color: "#EDE9FE",
  },
  {
    icon: "🧮",
    tag: "Math" as const,
    title: "Financial Maths Quiz",
    desc: "Can you calculate compound interest, ROI, and debt payoff periods? Put your maths to the test.",
    questions: 10,
    time: "~7 min",
    color: "#EEF5FC",
  },
];

const tagVariant: Record<string, "green" | "navy" | "amber" | "purple"> = {
  Beginner:  "green",
  Credit:    "amber",
  Investing: "purple",
  Math:      "navy",
};

const sampleQuestion = {
  question: "If you invest $1,000 at a 7% annual interest rate, how much will you have after 10 years with compound interest?",
  options: ["$1,700", "$1,838", "$1,967", "$2,105"],
  correct: 1,
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div
        className="py-20 px-6"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel>Knowledge Quizzes</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Test Your<br />
            <span className="gradient-text">Financial IQ.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#A8C5E8" }}>
            Challenging quizzes across every financial topic. Find your gaps, reinforce your
            knowledge, and earn your FinWise certification badge.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 font-medium mb-10">
          <span className="text-lg">🚧</span>
          <span>
            <strong>Interactive quiz engine with instant feedback</strong> is under development.
            A sample question preview is shown below.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5" role="list">
            {quizzes.map((quiz) => (
              <article
                key={quiz.title}
                role="listitem"
                className="bg-white border border-slate-200 rounded-2xl p-7 transition-all duration-250 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                  style={{ background: quiz.color }}
                  aria-hidden="true"
                >
                  {quiz.icon}
                </div>
                <Badge variant={tagVariant[quiz.tag]} className="mb-3">{quiz.tag}</Badge>
                <h2 className="text-base font-bold text-slate-900 mb-2">{quiz.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{quiz.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>📝 {quiz.questions} questions</span>
                    <span>⏱ {quiz.time}</span>
                  </div>
                  <button
                    className="text-xs font-bold px-3 py-1.5 rounded-full text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #0A1628, #1E3A5F)" }}
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Sample question preview */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Sample Question</h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#00A87E" }}>
                Finance Fundamentals · Q3
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed mb-5">
                {sampleQuestion.question}
              </p>
              <div className="space-y-3" role="list">
                {sampleQuestion.options.map((opt, i) => (
                  <div
                    key={opt}
                    role="listitem"
                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all cursor-default ${
                      i === sampleQuestion.correct
                        ? "border-[#00C896]/40 text-slate-900"
                        : "border-slate-200 text-slate-500"
                    }`}
                    style={i === sampleQuestion.correct ? { background: "#E8FFF8" } : {}}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={
                        i === sampleQuestion.correct
                          ? { background: "#00C896", color: "#fff" }
                          : { background: "#F1F5F9", color: "#64748B" }
                      }
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {i === sampleQuestion.correct && (
                      <span className="ml-auto text-xs font-bold" style={{ color: "#00A87E" }}>✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Using the compound interest formula: $1,000 × (1.07)^10 = $1,967.15
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
