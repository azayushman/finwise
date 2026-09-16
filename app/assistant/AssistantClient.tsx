"use client";

import { useState, useEffect, useRef, useId } from "react";
import { supabase } from "@/src/lib/supabase";
import {
  safeGetJson,
  safeSetJson,
  safeRemoveItem,
  isValidMessageArray,
  type PersistedMessage,
} from "@/src/lib/storage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import ReactMarkdown from "react-markdown";

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Message is the runtime type used by the chat UI.
 * It re-uses PersistedMessage so the shapes stay in sync: any value safely
 * loaded from storage is directly assignable to this type.
 */
type Message = PersistedMessage;

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

// ── Helpers ────────────────────────────────────────────────────────────────

/** Construct the initial welcome message array shown to a fresh session. */
function buildWelcome(name: string, hasTxData: boolean): Message[] {
  const greeting = name !== "User" ? name : "there";
  const txHint = hasTxData
    ? " I can also provide insights based on your recent spending."
    : "";
  return [
    {
      id: "welcome",
      role: "assistant",
      content: `Hi ${greeting}! I'm your FinWise AI Assistant. I can help you understand personal finance, budgeting, and investing.${txHint} How can I help you today?`,
    },
  ];
}

// ── Components ─────────────────────────────────────────────────────────────

export function AssistantClient() {
  const { isOnline } = useNetworkStatus();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Load User Data Context and Local Storage Messages
  useEffect(() => {
    // Shared constant: key used to persist chat messages.
    const MESSAGES_KEY = "finwise_chat_messages";

    async function loadContext() {
      // ── Try to restore persisted messages first (fast path) ───────────────
      // safeGetJson validates every item's shape and auto-clears the key on
      // corruption so future loads start fresh.
      const saved = safeGetJson(MESSAGES_KEY, isValidMessageArray, null);
      if (saved) {
        setMessages(saved);
        // Still fetch user context in the background so userData is populated
        // for the contextual prompts, but don't overwrite messages.
        void fetchUserContext();
        return;
      }

      // ── No valid persisted messages — load fresh welcome ─────────────────
      await fetchUserContext();
    }

    async function fetchUserContext() {
      try {
        // No Supabase client → skip auth/data fetch; show generic welcome.
        if (!supabase) {
          setMessages(buildWelcome("User", false));
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        let name = "User";
        let hasTxData = false;

        if (user) {
          name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
          const { data: txs } = await supabase
            .from("transactions")
            .select("amount, type, category")
            .eq("user_id", user.id);
          if (txs && txs.length > 0) {
            hasTxData = true;
            setUserData({ transactions: txs });
          }
        }

        setMessages(buildWelcome(name, hasTxData));
      } catch (e) {
        // Auth or network failure — show generic welcome, don’t crash.
        if (process.env.NODE_ENV === "development") {
          console.warn("[AssistantClient] Could not fetch user context", e);
        }
        setMessages(buildWelcome("User", false));
      }
    }

    loadContext();
  }, []);

  // Save messages to localStorage whenever they change.
  // safeSetJson handles quota-exceeded errors silently.
  useEffect(() => {
    if (messages.length > 0) {
      safeSetJson("finwise_chat_messages", messages);
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
    if (e.key === "Enter" && !e.shiftKey && isOnline) {
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
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-2">
              Your money questions, <span className="gradient-text">answered.</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto md:mx-0">
              Ask questions about budgeting, investing, or your own spending habits.
              Always educational, never financial advice.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <button
              onClick={() => {
                setMessages(buildWelcome("User", false));
                safeRemoveItem("finwise_chat_messages");
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
                        : "glass-surface border-[#8B5CF6]/20 text-white"
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
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 leading-relaxed last:mb-0" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-400" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                          li: ({ node, ...props }) => <li className="pl-1" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full glass-surface border-[#8B5CF6]/20 text-white flex items-center justify-center shrink-0" aria-hidden="true">✨</div>
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

              {/* Offline notice strip */}
              {!isOnline && (
                <div
                  className="flex items-center gap-2 mb-3 px-4 py-2.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    color: "#FCD34D",
                  }}
                  role="status"
                  aria-live="polite"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
                    <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
                    <path d="M10.71 5.05A16 16 0 0122.56 9" />
                    <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
                    <path d="M8.53 16.11a6 6 0 016.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                  AI Assistant requires an internet connection
                </div>
              )}

              {/* Suggestions */}
              {messages.length < 3 && (
                <div className="flex flex-wrap gap-2 mb-4 pb-2 overflow-x-auto no-scrollbar">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => isOnline && handleSend(q)}
                      disabled={!isOnline}
                      className="px-3 py-1.5 glass-surface border-white/5 hover:border-[#8B5CF6]/50 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/5 disabled:hover:text-slate-300"
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
                  placeholder={isOnline ? "Ask about budgeting, investing, or your spending..." : "Go online to use the AI Assistant"}
                  className="w-full pl-5 pr-14 py-4 glass-surface border-white/10 rounded-2xl outline-none transition-all duration-200 focus:border-[#8B5CF6]/60 focus:bg-[#6D5DFB]/5 text-white placeholder:text-slate-300 text-sm shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isTyping || !isOnline}
                  aria-disabled={!isOnline}
                />

                {/* Send button — tooltip injected via title when offline */}
                <div
                  title={!isOnline ? "AI Assistant requires an internet connection" : undefined}
                  style={{ position: "absolute", right: "8px" }}
                >
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isTyping || !isOnline}
                    className="w-10 h-10 rounded-xl glass-control text-white flex items-center justify-center disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
                    aria-label={!isOnline ? "AI Assistant requires an internet connection" : "Send message"}
                    aria-disabled={!isOnline}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-300 text-center mt-3">
                The AI Finance Assistant provides educational information, not licensed financial advice.
              </p>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
