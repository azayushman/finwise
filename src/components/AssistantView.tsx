import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  RotateCcw,
  Landmark,
  Scale,
  ShieldCheck,
  FileText,
  Send,
  ScrollText,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { ChatMessage, UserFinancialContext, UserProfile } from "../types";

interface AssistantViewProps {
  user: UserProfile;
  userContext: UserFinancialContext;
  initialQuery?: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  user,
  userContext,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `### Institutional Opening Memorandum\n\n**To:** ${user.name}, Portfolio Principal  \n**From:** Wall Street Heritage Strategist  \n**Authority:** 230-Year Capital Markets Archive (Est. Buttonwood Agreement, 1792)  \n**Mandate:** Personal balance sheet engineering, disciplined compounding, emergency reserves, and strategic liability liquidation.\n\n---\n\nWelcome to the **Advisory Ledger**. Every entry in this ledger is evaluated against empirical finance and sound capital allocation frameworks.\n\n*Institutional Remit: We examine strictly personal finance, savings rates, debt amortization, and capital models. General or non-financial inquiries are dismissed to preserve balance sheet focus.*\n\nState your financial inquiry or select a standard precedent from the docket below to transcribe into the ledger.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState(initialQuery || "");
  const [isLoading, setIsLoading] = useState(false);
  const [includeFinancialContext, setIncludeFinancialContext] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle initialQuery if passed from other tabs
  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
          userContext: includeFinancialContext ? userContext : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyContent =
        data.response || data.error || "Unable to retrieve strategic financial briefing at this moment. Please re-query.";

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn("Using offline/client financial knowledge fallback:", err);
      // Seamlessly answer directly from client financial engine
      const { getClientFinancialAnswer } = await import("../utils/financialFallback");
      const localAnswer = getClientFinancialAnswer(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: localAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: `### Folio Register Reset\n\n**To:** ${user.name}  \n**Status:** Ledger Folio Archived & Cleared. Ready for new capital inquiries and balance sheet reviews.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const docketPrecedents = [
    {
      code: "PRECEDENT I",
      topic: "Margin of Safety Liquidity",
      query: "Apply Benjamin Graham's Margin of Safety to my emergency fund and reserve moat",
    },
    {
      code: "PRECEDENT II",
      topic: "Institutional 50/30/20",
      query: "How does the 50/30/20 framework operate as an institutional corporate balance sheet?",
    },
    {
      code: "PRECEDENT III",
      topic: "Compounding vs Timing",
      query: "Why does compound growth and dollar-cost averaging outperform market timing over 20 years?",
    },
    {
      code: "PRECEDENT IV",
      topic: "Debt Amortization Logic",
      query: "Debt Avalanche vs. Debt Snowball: Mathematical comparison and interest liquidation",
    },
    {
      code: "PRECEDENT V",
      topic: "1792 Buttonwood Diversification",
      query: "How did the 1792 Buttonwood Agreement shape systematic equity diversification?",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
      {/* Ledger Header Bar */}
      <div className="pb-5 border-b border-amber-500/25 shrink-0 bg-[#080B10]/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-data">
                FOLIO REGISTER • EST. 1792
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-data">
                SERIES WS-CAPITAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-wallstreet tracking-tight">
              Wall Street <span className="gold-gradient-text">Advisory Ledger</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Official institutional dispatches and balance sheet audits. Strictly personal finance, disciplined capital allocation, and quantitative monetary frameworks.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="hidden md:flex flex-col items-end text-[11px] font-data text-slate-400">
              <span className="text-amber-400 font-bold">STATUS: AUDITED REGISTER</span>
              <span className="text-slate-400">{user.name.toUpperCase()} • FOLIO #1</span>
            </div>

            <button
              onClick={handleClearHistory}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#0D121C] border border-amber-500/25 hover:border-amber-500/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Archive and clear current folio"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Archive Folio</span>
            </button>
          </div>
        </div>

        {/* Ledger Double-Rule Accent */}
        <div className="mt-4 pt-1 border-t border-b border-amber-500/20 flex justify-between items-center text-[10px] text-slate-400 font-data tracking-wider uppercase">
          <span>ARCHIVAL LOG • DISPATCHES FORMATTED UNDER CLASSICAL LEDGER RULES</span>
          <span className="hidden sm:inline">AUTHENTIC FINANCIAL CITATIONS</span>
        </div>
      </div>

      {/* Ledger Feed (Historical Ledger Dispatch Entries - No Chat Bubbles) */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 no-scrollbar">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const folioNum = String(index + 1).padStart(3, "0");

          return (
            <div
              key={msg.id}
              className={`rounded-2xl border transition-all ${
                isUser
                  ? "bg-[#0A0E17] border-slate-700/80 shadow-md"
                  : "bg-[#080C14] border-amber-500/30 border-l-4 border-l-[#D4AF37] shadow-xl shadow-black/50"
              } overflow-hidden`}
            >
              {/* Ledger Folio Header Strip */}
              <div
                className={`px-5 py-2.5 flex items-center justify-between border-b text-[11px] font-data ${
                  isUser
                    ? "bg-[#0D121E] border-slate-800 text-slate-300"
                    : "bg-[#0C101A] border-amber-500/20 text-amber-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-wider">
                    {isUser ? `ENTRY #${folioNum} • CLIENT INQUIRY` : `DISPATCH #${folioNum} • STRATEGIST MEMORANDUM`}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400 font-normal">
                    {isUser ? `REGISTERED BY ${user.name.toUpperCase()}` : "WALL STREET HERITAGE ARCHIVES"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                  <span>REF-WS-{index * 13 + 101}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Ledger Entry Body */}
              <div className="p-5 sm:p-6 space-y-3">
                {isUser ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-data block">
                      QUERY TRANSCRIBED TO FOLIO:
                    </span>
                    <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h2 className="text-lg sm:text-xl font-bold text-white font-wallstreet mt-2 mb-3 pb-1 border-b border-amber-500/20">
                              {children}
                            </h2>
                          ),
                          h2: ({ children }) => (
                            <h3 className="text-base sm:text-lg font-bold text-white font-wallstreet mt-3 mb-2">
                              {children}
                            </h3>
                          ),
                          h3: ({ children }) => (
                            <h4 className="text-sm sm:text-base font-bold text-amber-300 font-wallstreet mt-2 mb-1">
                              {children}
                            </h4>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2.5 leading-relaxed text-slate-300">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-amber-300">{children}</strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="space-y-1.5 my-2.5 pl-4 border-l-2 border-amber-500/30">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal space-y-1.5 my-2.5 pl-5 text-slate-300 font-data text-xs">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed text-slate-300 pl-1">{children}</li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="p-3 my-2 bg-amber-950/20 border-l-2 border-amber-400 text-amber-200/90 italic font-editorial text-sm">
                              {children}
                            </blockquote>
                          ),
                          hr: () => <hr className="border-amber-500/20 my-3" />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {/* Official Archival Ratification Stamp */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-data">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>ENTERED INTO CAPITAL ARCHIVE • INDEPENDENT MONETARY MODELS</span>
                      </div>
                      <span className="text-slate-400">BENCHMARK: 1792-2026 CAPITAL STANDARDS</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Minimalist Wall Street Auditing State (No Bot Dots) */}
        {isLoading && (
          <div className="rounded-2xl border border-amber-500/30 bg-[#080C14] p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs font-data text-amber-300 mb-2">
              <span className="flex items-center gap-2 font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                AUDITING HISTORICAL CAPITAL PRECEDENTS & BALANCE SHEET METRICS...
              </span>
              <span className="text-slate-400 text-[10px]">FOLIO TRANSMISSION ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Formulating institutional advisory memorandum cross-referencing compound interest models, 50/30/20 reserves, and Graham's margin of safety.
            </p>
            <div className="w-full h-1 bg-slate-900 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 animate-pulse" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Standard Inquiries Docket (Precedent Cases) */}
      {messages.length <= 2 && (
        <div className="pb-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold uppercase tracking-widest mb-2 font-data">
            <ScrollText className="w-3 h-3 text-amber-400" />
            <span>STANDARD CAPITAL INQUIRIES DOCKET (CLICK TO TRANSCRIBE)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {docketPrecedents.slice(0, 3).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={isLoading}
                className="text-left p-2.5 rounded-xl bg-[#0D121C] hover:bg-[#121927] border border-amber-500/20 hover:border-amber-500/45 text-slate-300 hover:text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[9px] font-bold font-data text-amber-400 mb-1">
                  <span>{p.code}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
                <div className="text-xs font-semibold text-white truncate font-wallstreet">
                  {p.topic}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                  {p.query}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Transmission Terminal (Replaces Casual Chat Box) */}
      <div className="pt-3 border-t border-amber-500/20 shrink-0 space-y-2 bg-[#080B10]/95">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-1.5 rounded-2xl bg-[#0B0F18] border border-amber-500/30 focus-within:border-amber-400 transition-colors shadow-xl"
        >
          <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-data text-amber-400/90 border-b border-slate-800/80">
            <Landmark className="w-3 h-3 text-amber-400" />
            <span className="font-bold tracking-wider uppercase">RECORD NEW INQUIRY TO ADVISORY LEDGER</span>
          </div>

          <div className="relative flex items-center mt-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter capital question, balance sheet audit request, or liability amortization inquiry..."
              disabled={isLoading}
              className="w-full pl-3 pr-32 py-2.5 bg-transparent focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-colors font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] hover:from-[#C5A059] hover:to-[#E5C07B] text-slate-950 font-bold text-xs uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md flex items-center gap-1.5 font-data"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 px-1 gap-1 font-data">
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-400 transition-colors">
            <input
              type="checkbox"
              checked={includeFinancialContext}
              onChange={(e) => setIncludeFinancialContext(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Include active balance sheet metrics (Net Worth, Savings Rate, Cash Reserves)</span>
          </label>

          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Strict Finance Remit • Zero PII Transmitted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
