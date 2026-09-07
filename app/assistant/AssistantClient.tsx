"use client";

import { useState, useEffect, useRef, useId } from "react";
import { supabase } from "@/src/lib/supabase";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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

// ── Components ─────────────────────────────────────────────────────────────

export function AssistantClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Load User Data Context and Local Storage Messages
  useEffect(() => {
    async function loadContext() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let name = "User";
        let txsData = null;

        if (user) {
          name = user.user_metadata?.full_name || user.email?.split('@')[0] || "User";
          const { data: txs } = await supabase.from("transactions").select("amount, type, category").eq("user_id", user.id);
          if (txs) {
            txsData = txs;
            setUserData({ transactions: txs });
          }
        }

        const savedMessages = localStorage.getItem("finwise_chat_messages");
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              return;
            }
          } catch (e) {
            console.error("Failed to parse saved messages", e);
          }
        }

        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: `Hi ${name !== "User" ? name : 'there'}! I'm your FinWise AI Assistant. I can help you understand personal finance, budgeting, and investing. ${txsData && txsData.length > 0 ? "I can also provide insights based on your recent spending." : ""} How can I help you today?`
          }
        ]);
      } catch (e) {
        console.error("Could not fetch user context", e);
        const savedMessages = localStorage.getItem("finwise_chat_messages");
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              return;
            }
          } catch {}
        }

        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: `Hi there! I'm your FinWise AI Assistant. I can help you understand personal finance, budgeting, and investing. How can I help you today?`
          }
        ]);
      }
    }
    loadContext();
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("finwise_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  // Scroll only inside the chat messages container
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  async function handleSend(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const history = messages
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }));

    let userContext = null;
    if (userData && Array.isArray(userData.transactions)) {
      let totalIncome = 0;
      let totalExpense = 0;
      const categoryTotals: Record<string, number> = {};

      userData.transactions.forEach((tx) => {
        if (tx.type === "income") {
          totalIncome += tx.amount;
        } else if (tx.type === "expense") {
          totalExpense += tx.amount;
          categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        }
      });

      userContext = {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        spendingByCategory: categoryTotals,
      };
    }

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: history,
          userContext: userContext,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.response || data.response.trim() === "") {
        throw new Error(data.error || "AI request failed");
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Gemini request failed:", error);

      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please check your internet connection or try again later.",
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }

  return (
    <div className="min-h-screen text-[#F5F7FF] pb-10 flex flex-col relative">
      {/* ── Page ambient depth ── */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,93,251,0.08), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.06), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* ════════════════ HEADER ════════════════ */}
      <div className="pt-24 pb-8 px-6 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 glass-surface">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                FinWise Assistant
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              Your money questions, <span className="gradient-text">answered.</span>
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-lg mx-auto md:mx-0">
              Ask questions about budgeting, investing, or your own spending habits.
              Always educational, never financial advice.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <button
              onClick={() => {
                const defaultWelcome = {
                  id: "welcome",
                  role: "assistant",
                  content: `Hi there! I'm your FinWise AI Assistant. I can help you understand personal finance, budgeting, and investing. How can I help you today?`
                } as Message;
                setMessages([defaultWelcome]);
                localStorage.removeItem("finwise_chat_messages");
              }}
              className="px-4 py-2 glass-surface hover:bg-white/10 border-white/10 text-white text-xs font-bold rounded-xl transition-all duration-200"
            >
              Clear Chat
            </button>
          </ScrollReveal>
        </div>
      </div>

      {/* ════════════════ CHAT AREA ════════════════ */}
      <div className="max-w-4xl mx-auto w-full px-4 relative z-10 flex-1 flex flex-col">
        <ScrollReveal direction="up" delay={200} className="h-full flex flex-col">
          <div className="glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ minHeight: "500px", height: "calc(100vh - 280px)" }}>

            {/* Messages container */}
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6 space-y-6"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>

                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      msg.role === "user"
                        ? "glass-surface border-white/10 text-white"
                        : "bg-gradient-to-br from-[#6D5DFB] to-[#4F46E5] border-white/20 text-white shadow-md"
                    }`}
                    aria-hidden="true"
                  >
                    {msg.role === "user" ? "👤" : "✨"}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#6D5DFB]/15 border border-[#8B5CF6]/30 text-white rounded-tr-none shadow-[0_4px_16px_rgba(109,93,251,0.1)]"
                      : "glass-surface border-white/10 text-slate-200 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D5DFB] to-[#4F46E5] text-white shadow-md flex items-center justify-center shrink-0" aria-hidden="true">✨</div>
                  <div className="p-4 rounded-2xl glass-surface border-white/10 rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: "0ms" }} aria-hidden="true" />
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: "150ms" }} aria-hidden="true" />
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: "300ms" }} aria-hidden="true" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 glass-surface border-t border-white/10 rounded-b-3xl">
              {/* Suggestions */}
              {messages.length < 3 && (
                <div className="flex flex-wrap gap-2 mb-4 pb-2 overflow-x-auto no-scrollbar">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 glass-surface border-white/5 hover:border-[#8B5CF6]/50 rounded-full text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors whitespace-nowrap shrink-0"
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
                  className="w-full pl-5 pr-14 py-4 glass-surface border-white/10 rounded-2xl outline-none transition-all duration-200 focus:border-[#8B5CF6]/60 focus:bg-[#6D5DFB]/5 text-white placeholder:text-[#94A3B8] text-sm shadow-inner"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-10 h-10 rounded-xl bg-[#6D5DFB] border border-white/10 hover:shadow-[0_4px_16px_rgba(109,93,251,0.4)] hover:-translate-y-0.5 text-white flex items-center justify-center disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
                  aria-label="Send message"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-[#94A3B8] text-center mt-3">
                The AI Finance Assistant provides educational information, not licensed financial advice.
              </p>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
