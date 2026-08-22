"use client";

import { useState, useEffect, useRef, useId } from "react";
import { supabase } from "@/src/lib/supabase";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
}

interface UserData {
  transactions: Transaction[];
}

// ── Local AI Engine (Fallback) ─────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "How can I save more money?",
  "Explain the 50/30/20 rule",
  "Am I spending too much?",
  "What is compound interest?",
  "What is an emergency fund?",
  "What is SIP?",
  "What is the difference between stocks and mutual funds?",
  "How does a credit score work?",
];

function generateLocalResponse(query: string, data: UserData | null): string {
  const q = query.toLowerCase();

  // 1. Personalized Context
  if (data && (q.includes("spending too much") || q.includes("reduce expenses") || q.includes("reduce my expenses"))) {
    const expenses = data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    
    if (income === 0 && expenses === 0) {
      return "I can see you haven't logged any income or expenses yet. Start tracking your spending in the Budget tool so I can give you personalized advice!";
    }
    if (income === 0) {
      return `You have logged $${expenses.toFixed(2)} in expenses, but no income yet. Tracking your income will help me calculate your spending ratio!`;
    }
    
    const ratio = (expenses / income) * 100;
    const categoryTotals: Record<string, number> = {};
    data.transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categoryTotals).sort((a,b) => b[1]-a[1])[0];

    if (ratio > 80) {
      return `You are spending ${ratio.toFixed(0)}% of your income, which is on the higher side. Your top expense category is ${topCategory[0]} at $${topCategory[1].toFixed(2)}. I recommend reviewing the 50/30/20 rule to see where you can cut back.`;
    } else {
      return `You are spending ${ratio.toFixed(0)}% of your income, which is a healthy ratio! Your highest expense is ${topCategory[0]} at $${topCategory[1].toFixed(2)}. Keep up the good work and consider directing any surplus to your savings goals.`;
    }
  }
  
  if (data && (q.includes("my net worth") || q.includes("my balance"))) {
    const expenses = data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    return `Based on your tracked transactions, your current net worth is $${(income - expenses).toFixed(2)}.`;
  }

  if (!data && (q.includes("my ") || q.includes("am i "))) {
    return "I would love to give you personalized advice, but it seems you aren't logged in, or you haven't added any data yet. Log in and add some transactions to get personalized insights!";
  }

  // 2. Educational Knowledge Base
  if (q.includes("50/30/20")) {
    return "The 50/30/20 rule is a simple budgeting framework. It suggests spending 50% of your after-tax income on Needs (rent, groceries, bills), 30% on Wants (entertainment, dining out), and 20% on Savings or Debt repayment.";
  }
  if (q.includes("compound interest") || q.includes("compound growth")) {
    return "Compound interest is the interest you earn on both your original money and on the interest you keep accumulating. It's often called 'interest on interest' and helps your wealth grow exponentially over time!";
  }
  if (q.includes("emergency fund")) {
    return "An emergency fund is a bank account with money set aside to cover large, unexpected expenses (like medical bills or car repairs). Financial experts usually recommend saving 3 to 6 months' worth of living expenses.";
  }
  if (q.includes("sip") || q.includes("systematic investment plan")) {
    return "SIP stands for Systematic Investment Plan. It's a method where you invest a fixed amount of money at regular intervals (like monthly) into a mutual fund. It helps in averaging the cost of investment over time and reduces market timing risks.";
  }
  if (q.includes("mutual fund") || q.includes("stock")) {
    return "A stock represents a single share of ownership in a specific company. A mutual fund is a pool of money collected from many investors to invest in a diversified portfolio of stocks, bonds, or other assets, which lowers your individual risk.";
  }
  if (q.includes("credit score")) {
    return "A credit score is a number (usually between 300 and 850) that represents your creditworthiness. It's based on your history of borrowing and repaying debt. A higher score helps you get better interest rates on loans and mortgages.";
  }
  if (q.includes("save") || q.includes("saving") || q.includes("reduce expenses")) {
    return "To save more money, start by tracking your expenses to identify unnecessary 'Wants'. Consider the 'pay yourself first' method—automatically transferring a set amount to savings as soon as you get paid, before paying any bills.";
  }
  if (q.includes("budget") || q.includes("budgeting")) {
    return "Budgeting is the process of creating a plan to spend your money. It ensures you have enough for things you need and things important to you. A good budget keeps you out of debt and helps you build wealth.";
  }
  if (q.includes("debt") || q.includes("loan")) {
    return "Not all debt is equal. High-interest debt (like credit cards) should be paid off as quickly as possible. Low-interest debt (like a manageable mortgage) can sometimes be balanced with investing. Always aim to minimize high-interest liabilities.";
  }
  if (q.includes("inflation")) {
    return "Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling. Investing is a key strategy to ensure your money grows faster than inflation.";
  }
  if (q.includes("tax")) {
    return "Taxes are mandatory contributions levied by a government. Understanding tax brackets and utilizing tax-advantaged accounts (like a 401(k) or IRA) is crucial for keeping more of your hard-earned money. (Note: I am not a tax professional).";
  }
  if (q.includes("invest") || q.includes("investing")) {
    return "Investing is the act of allocating resources, usually money, with the expectation of generating an income or profit. Beginners often start with broad market index funds or ETFs because they offer instant diversification.";
  }
  if (q.includes("goal")) {
    return "Setting financial goals is the first step to building wealth. Use the SMART framework: Specific, Measurable, Achievable, Relevant, and Time-bound. Use our Savings tool to track them!";
  }
  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return "Hello! I am your FinWise AI Assistant. How can I help you with your financial journey today?";
  }
  
  return "I am an educational personal finance assistant. I can help explain concepts like budgeting, compound interest, emergency funds, stocks, and the 50/30/20 rule. What would you like to learn about today? (Note: I cannot provide professional financial or legal advice).";
}

// ── Components ─────────────────────────────────────────────────────────────

export function AssistantClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Load User Data Context
  useEffect(() => {
    async function loadContext() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "User");
          const { data: txs } = await supabase.from("transactions").select("amount, type, category").eq("user_id", user.id);
          if (txs) {
            setUserData({ transactions: txs });
          }
        }
      } catch (e) {
        console.error("Could not fetch user context", e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadContext();
  }, []);

  // Initial Welcome Message
  useEffect(() => {
    if (isLoaded && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hi ${userName ? userName : 'there'}! I'm your FinWise AI Assistant. I can help you understand personal finance, budgeting, and investing. ${userData && userData.transactions.length > 0 ? "I can also provide insights based on your recent spending." : ""} How can I help you today?`
        }
      ]);
    }
  }, [isLoaded, messages.length, userName, userData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  async function handleSend(text: string) {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      const responseContent = generateLocalResponse(text, userData);
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: responseContent };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10 flex flex-col">
      {/* Header */}
      <div
        className="pt-24 pb-12 px-6 relative shrink-0"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #1E3A5F 100%)" }}
      >
        <AmbientBackground variant="dark" />
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <SectionLabel>AI Finance Assistant</SectionLabel>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              Your Personal <span className="gradient-text">Finance Guide</span>
            </h1>
            <p className="text-sm text-[#A8C5E8] max-w-lg">
              Ask questions about budgeting, investing, or your own spending habits. 
              Always educational, never financial advice.
            </p>
          </div>
          <button 
            onClick={() => setMessages(messages.slice(0, 1))}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors border border-white/10"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto w-full px-4 -mt-6 relative z-20 flex-1 flex flex-col">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden" style={{ minHeight: "500px", height: "calc(100vh - 280px)" }}>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg) => (
              <ScrollReveal key={msg.id} direction="up" delay={0}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-[#00C896] to-[#00A87E] text-white shadow-md"
                  }`}>
                    {msg.role === "user" ? "👤" : "✨"}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-[#0F172A] text-white rounded-tr-none" 
                      : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C896] to-[#00A87E] text-white shadow-md flex items-center justify-center shrink-0">✨</div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 mb-4 pb-2 overflow-x-auto no-scrollbar">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 transition-colors whitespace-nowrap shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex items-center">
              <label htmlFor={inputId} className="sr-only">Type your message</label>
              <input
                id={inputId}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about budgeting, investing, or your spending..."
                className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none transition-all duration-200 focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/15 focus:bg-white text-sm"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 w-10 h-10 rounded-xl bg-[#00C896] hover:bg-[#00A87E] text-white flex items-center justify-center disabled:opacity-50 disabled:hover:bg-[#00C896] transition-colors"
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3">
              The AI Finance Assistant provides educational information, not licensed financial advice.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
