"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";

/* ══════════════════════════════════════════════════════════════════════════
   Topics Data
   ══════════════════════════════════════════════════════════════════════════ */

interface Lesson {
  title: string;
  content: string[];
  takeaways: string[];
}

interface Topic {
  id: string;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  duration: string;
  lessons: Lesson[];
}

const TOPICS: Topic[] = [
  {
    id: "foundations", icon: "📖", tag: "Foundations",
    title: "What is Personal Finance?",
    desc: "A complete overview of managing your income, expenses, savings, and investments to achieve your financial goals.",
    duration: "8 min read",
    lessons: [
      {
        title: "The Core Pillars",
        content: [
          "Personal finance is about meeting your personal financial goals, whether it's having enough for short-term financial needs, planning for retirement, or saving for your child's college education.",
          "It encompasses all financial decisions and activities of an individual or household, including earning, spending, saving, investing, and protection.",
          "The most important rule of personal finance is simple: spend less than you earn. The gap between your income and expenses is what builds wealth over time.",
        ],
        takeaways: ["Spend less than you earn", "Have clear financial goals", "Focus on all pillars: earning, spending, saving, investing, and protection"],
      },
      {
        title: "Your Net Worth",
        content: [
          "Your net worth is the ultimate measure of your financial health. It is simply the total of everything you own (assets) minus everything you owe (liabilities).",
          "Assets include cash, investments, real estate, and valuable personal property.",
          "Liabilities include mortgages, student loans, credit card debt, and auto loans.",
          "Tracking your net worth over time tells you if you are moving in the right financial direction, regardless of your income level.",
        ],
        takeaways: ["Net Worth = Assets - Liabilities", "Track it regularly (e.g., quarterly)", "Focus on increasing assets and decreasing liabilities"],
      },
    ]
  },
  {
    id: "budgeting", icon: "📊", tag: "Budgeting",
    title: "The 50/30/20 Budget Rule",
    desc: "Learn the most popular budgeting framework and how to adapt it to your personal income and lifestyle.",
    duration: "6 min read",
    lessons: [
      {
        title: "Understanding 50/30/20",
        content: [
          "Coined by Senator Elizabeth Warren, the 50/30/20 rule is an intuitive and simple way to budget your after-tax income.",
          "50% goes to NEEDS: These are bills that you absolutely must pay and are the things necessary for survival. This includes rent or mortgage payments, car payments, groceries, insurance, health care, minimum debt payment, and utilities.",
          "30% goes to WANTS: These are all the things you spend money on that are not absolutely essential. This includes dinner and movies out, that new handbag, tickets to sporting events, vacations, the latest electronic gadget, and ultra-high-speed internet.",
          "20% goes to SAVINGS & DEBT: This category is for adding money to an emergency fund, making IRA contributions to a mutual fund account, and investing in the stock market. You should have at least three months of emergency savings on hand.",
        ],
        takeaways: ["50% Needs", "30% Wants", "20% Savings/Debt", "Use after-tax income"],
      },
      {
        title: "Adapting the Rule",
        content: [
          "The 50/30/20 rule is a starting point, not a strict law. In high-cost-of-living areas, needs might easily consume 60% of your income.",
          "If you're aggressively paying down high-interest debt, you might shift your ratios to 50/10/40.",
          "The key is intentionality: assigning a job to every dollar before the month begins.",
        ],
        takeaways: ["Adjust ratios based on your reality", "Prioritize high-interest debt", "Give every dollar a job"],
      },
    ]
  },
  {
    id: "savings", icon: "⚡", tag: "Savings",
    title: "Power of Compound Interest",
    desc: "See how money grows exponentially over time and why starting early makes an enormous difference.",
    duration: "7 min read",
    lessons: [
      {
        title: "The 8th Wonder of the World",
        content: [
          "Compound interest is interest calculated on the initial principal, which also includes all of the accumulated interest of previous periods of a deposit or loan.",
          "Simply put, it's making your money work for you. You earn interest on the money you save, and then you earn interest on that interest.",
          "Albert Einstein allegedly called compound interest the 'eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.'",
        ],
        takeaways: ["Interest on interest", "Accelerates growth over time", "Works for savings, works against you with debt"],
      },
      {
        title: "Time is Your Best Friend",
        content: [
          "When it comes to compound interest, time is the most important variable. Starting to save at age 25 rather than 35 can literally double your retirement portfolio, even if you invest less money overall.",
          "This is because the earlier you start, the more cycles of compounding your money undergoes.",
          "If you haven't started yet, don't panic. The second best time to start is today.",
        ],
        takeaways: ["Start as early as possible", "Consistency beats timing the market", "Time > Amount invested"],
      },
    ]
  },
  {
    id: "credit", icon: "💳", tag: "Credit",
    title: "Understanding Credit Scores",
    desc: "How your credit score is calculated, why it matters, and proven strategies to build and protect it over time.",
    duration: "10 min read",
    lessons: [
      {
        title: "The Anatomy of a Credit Score",
        content: [
          "In the US, the FICO score is the standard. It ranges from 300 to 850.",
          "35% is Payment History: Do you pay your bills on time? One late payment can severely damage your score.",
          "30% is Amounts Owed (Credit Utilization): How much of your available credit are you using? Keep this below 30%.",
          "15% is Length of Credit History: How long have your accounts been open? Don't close your oldest credit card.",
          "10% is New Credit: Opening several new accounts in a short period hurts your score.",
          "10% is Credit Mix: Having different types of credit (credit cards, auto loan, mortgage) helps.",
        ],
        takeaways: ["Pay on time, every time (35%)", "Keep utilization under 30% (30%)", "Keep old accounts open (15%)"],
      },
    ]
  },
  {
    id: "investing", icon: "📈", tag: "Investing",
    title: "Stocks, ETFs & Index Funds",
    desc: "A jargon-free introduction to investing — what different assets are and how to choose the right ones for you.",
    duration: "12 min read",
    lessons: [
      {
        title: "Owning a Piece of the Pie",
        content: [
          "When you buy a stock, you are buying a tiny piece of ownership in a real company.",
          "If the company grows and becomes more profitable, the value of your piece goes up. If the company fails, your piece becomes worthless.",
          "Picking individual stocks is extremely risky. Even professionals struggle to consistently pick winners.",
        ],
        takeaways: ["Stocks = ownership", "High risk, high potential reward", "Individual stock picking is difficult"],
      },
      {
        title: "The Magic of Index Funds",
        content: [
          "An index fund is a basket of stocks designed to mimic the performance of a financial market index, like the S&P 500.",
          "Instead of trying to find the needle in the haystack, an index fund buys the whole haystack.",
          "They offer instant diversification, low fees, and historically strong returns. They are the recommended investment vehicle for most retail investors.",
        ],
        takeaways: ["Buys the whole market", "Low fees", "Instant diversification"],
      },
    ]
  },
  {
    id: "protection", icon: "🛡️", tag: "Protection",
    title: "Insurance Fundamentals",
    desc: "Health, car, renters, and life insurance explained simply — what you need, what you don't, and how to save.",
    duration: "9 min read",
    lessons: [
      {
        title: "Transferring Risk",
        content: [
          "Insurance is a way to manage your risk. When you buy insurance, you transfer the cost of a potential loss to the insurance company in exchange for a fee, known as the premium.",
          "You should insure against catastrophic losses that you cannot afford to cover out of pocket (e.g., major medical issues, a house fire, liability in a car crash).",
          "You do not necessarily need insurance for small losses you could comfortably cover with your emergency fund.",
        ],
        takeaways: ["Insurance = transferring risk", "Insure against catastrophes", "Rely on emergency fund for minor issues"],
      },
    ]
  },
  {
    id: "taxes", icon: "🧾", tag: "Taxes",
    title: "Taxes for Beginners",
    desc: "Understand how income tax works, what deductions you can claim, and how to file your first tax return.",
    duration: "11 min read",
    lessons: [
      {
        title: "Marginal vs. Effective Tax Rates",
        content: [
          "The most common misunderstanding about taxes is how tax brackets work.",
          "If you move into a higher tax bracket, ONLY the income above that bracket's threshold is taxed at the higher rate, not your entire income.",
          "Your marginal tax rate is the rate paid on your last dollar of income. Your effective tax rate is the actual percentage of your total income paid in taxes.",
        ],
        takeaways: ["Higher bracket only affects income in that bracket", "Never refuse a raise to avoid a higher bracket", "Effective rate < Marginal rate"],
      },
    ]
  },
  {
    id: "goals", icon: "🎯", tag: "Goals",
    title: "Setting SMART Financial Goals",
    desc: "A framework for setting realistic, actionable financial goals that you'll actually stick to and achieve.",
    duration: "5 min read",
    lessons: [
      {
        title: "The SMART Framework",
        content: [
          "Vague goals ('I want to save money') rarely succeed. SMART goals do.",
          "Specific: Define exactly what you want to achieve ('Save for a down payment').",
          "Measurable: Put a number on it ('Save $40,000').",
          "Achievable: Ensure it's realistic for your income.",
          "Relevant: Make sure it aligns with your long-term values.",
          "Time-bound: Set a deadline ('By December 2028').",
        ],
        takeaways: ["Be specific", "Put a number on it", "Set a deadline"],
      },
    ]
  },
];

const tagVariant: Record<string, "green" | "navy" | "amber" | "purple"> = {
  Foundations: "navy",
  Credit:      "amber",
  Budgeting:   "green",
  Investing:   "purple",
  Savings:     "green",
  Protection:  "navy",
  Taxes:       "amber",
  Goals:       "purple",
};

const CATEGORIES = ["All", "Foundations", "Budgeting", "Savings", "Investing", "Credit", "Taxes"];

export function LearnClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const filteredTopics = activeCategory === "All"
    ? TOPICS
    : TOPICS.filter(t => t.tag === activeCategory);

  const activeTopic = activeTopicId ? TOPICS.find(t => t.id === activeTopicId) : null;

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F5F7FF]">
      {/* ════════════════ HERO ════════════════ */}
      <div
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #07111F 0%, #0B1F3A 100%)" }}
      >
        <AmbientBackground variant="dark" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionLabel>Learning Hub</SectionLabel>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-4">
            Financial Literacy<br />
            <span className="gradient-text">Made Simple.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed text-[#94A3B8]">
            Explore structured lessons across every financial topic. No prior knowledge needed —
            we start from the very basics and build up from there.
          </p>

          {/* Stats row */}
          {!activeTopicId && (
            <ScrollReveal direction="up" delay={100}>
              <div className="flex flex-wrap gap-8 mt-10">
                {[
                  { value: TOPICS.length.toString(),  label: "Core Topics" },
                  { value: TOPICS.reduce((acc, t) => acc + t.lessons.length, 0).toString(), label: "Lessons" },
                  { value: "Free",  label: "Always" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs uppercase tracking-wider mt-0.5 text-[#94A3B8]">{s.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ════════════════ TOPIC DETAIL VIEW ════════════════ */}
        {activeTopic ? (
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <button
                onClick={() => setActiveTopicId(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors mb-6"
              >
                ← Back to all topics
              </button>

              {/* Topic header */}
              <div className="bg-[#0B1F3A]/90 border border-[#8B5CF6]/20 rounded-3xl p-10 mb-8 shadow-xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-6xl" aria-hidden="true">{activeTopic.icon}</div>
                  <Badge variant={tagVariant[activeTopic.tag]}>{activeTopic.tag}</Badge>
                </div>
                <h2 className="text-3xl font-black text-white mb-4">{activeTopic.title}</h2>
                <p className="text-lg text-[#94A3B8] leading-relaxed">{activeTopic.desc}</p>
                <div className="mt-6 flex items-center gap-4 text-sm font-semibold text-[#A78BFA]">
                  <span>⏱ {activeTopic.duration}</span>
                  <span>📚 {activeTopic.lessons.length} lessons</span>
                </div>
              </div>

              {/* Lessons */}
              <div className="space-y-8 mb-10">
                {activeTopic.lessons.map((lesson, idx) => (
                  <div key={idx} className="bg-[#0B1F3A]/80 border border-[#8B5CF6]/20 rounded-3xl p-8 lg:p-10 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#102A4C] text-[#C4B5FD] border border-[#8B5CF6]/30">
                        {idx + 1}
                      </span>
                      {lesson.title}
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                      {lesson.content.map((p, pIdx) => (
                        <p key={pIdx} className="text-[15px] leading-loose text-slate-200">
                          {p}
                        </p>
                      ))}
                    </div>

                    {/* Key takeaways */}
                    <div className="rounded-2xl p-6 bg-[#102A4C]/70 border border-[#8B5CF6]/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] mb-4">Key Takeaways</h4>
                      <ul className="space-y-3">
                        {lesson.takeaways.map((takeaway, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-3">
                            <span className="text-[#8B5CF6] mt-0.5 font-bold">✓</span>
                            <span className="text-sm font-semibold text-slate-200 leading-relaxed">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* End of topic CTA */}
              <div
                className="rounded-3xl p-10 text-center relative overflow-hidden border border-[#8B5CF6]/30 shadow-2xl"
                style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)" }}
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
                     style={{ background: "radial-gradient(circle, #6D5DFB, transparent 70%)" }} aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Topic Completed!</h3>
                <p className="text-base mb-8 max-w-lg mx-auto relative z-10 text-[#94A3B8]">
                  Ready to test your knowledge? Take a quiz to reinforce what you&apos;ve just learned.
                </p>
                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(109,93,251,0.4)]"
                    style={{ background: "linear-gradient(135deg, #6D5DFB 0%, #4F46E5 100%)" }}
                  >
                    Test Your Knowledge →
                  </Link>
                  <button
                    onClick={() => setActiveTopicId(null)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-slate-200 transition-all border border-[#8B5CF6]/30 hover:bg-[#102A4C]"
                  >
                    Next Topic
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* ════════════════ TOPICS GRID ════════════════ */
          <div>
            {/* Filter pills */}
            <ScrollReveal direction="up">
              <div className="flex flex-wrap gap-2 mb-10" role="list" aria-label="Topic filters">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 border ${
                        isActive
                          ? "text-white border-[#8B5CF6] shadow-[0_0_15px_rgba(109,93,251,0.35)]"
                          : "bg-[#0B1F3A]/90 text-[#94A3B8] border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 hover:text-white"
                      }`}
                      style={isActive ? { background: "linear-gradient(135deg, #6D5DFB, #4F46E5)" } : undefined}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Topic cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
              {filteredTopics.map((topic, i) => (
                <ScrollReveal key={topic.id} delay={i * 50} as="article" className="h-full">
                  <button
                    role="listitem"
                    onClick={() => setActiveTopicId(topic.id)}
                    className="w-full text-left group bg-[#0B1F3A]/80 border border-[#8B5CF6]/20 rounded-3xl p-7 transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(109,93,251,0.2)] hover:border-[#8B5CF6]/50 flex flex-col h-full cursor-pointer"
                  >
                    <div className="text-4xl mb-5" aria-hidden="true">{topic.icon}</div>
                    <Badge variant={tagVariant[topic.tag]} className="mb-4">{topic.tag}</Badge>
                    <h2 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#C4B5FD] transition-colors">{topic.title}</h2>
                    <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 flex-1">{topic.desc}</p>
                    <div className="flex items-center justify-between w-full pt-4 border-t border-[#8B5CF6]/15">
                      <span className="text-xs text-[#94A3B8] font-semibold">{topic.duration}</span>
                      <span className="text-sm font-bold transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[#A78BFA]">
                        Read Lesson →
                      </span>
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-white mb-2">No topics found</h3>
                <p className="text-sm text-[#94A3B8]">Try selecting a different category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
