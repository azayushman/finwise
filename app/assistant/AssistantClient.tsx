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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          userData: userData,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.message) {
        throw new Error(data.error || "AI request failed");
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
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
    <div className="min-h-screen bg-[#07111F] text-[#F5F7FF] pb-10 flex flex-col">
      {/* Header */}
      <div
        className="pt-24 pb-12 px-6 relative shrink-0"
        style={{ background: "linear-gradient(160deg, #07111F 0%, #0B1F3A 100%)" }}
      >
        <AmbientBackground variant="dark" />
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <SectionLabel>AI Finance Assistant</SectionLabel>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              Your Personal <span className="gradient-text">Finance Guide</span>
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-lg">
              Ask questions about budgeting, investing, or your own spending habits. 
              Always educational, never financial advice.
            </p>
          </div>
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
            className="px-4 py-2 bg-[#102A4C] hover:bg-[#1A365D] text-[#C4B5FD] text-xs font-bold rounded-xl backdrop-blur-md transition-colors border border-[#8B5CF6]/30"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto w-full px-4 -mt-6 relative z-20 flex-1 flex flex-col">
        <div className="bg-[#0B1F3A]/90 border border-[#8B5CF6]/25 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl" style={{ minHeight: "500px", height: "calc(100vh - 280px)" }}>
          
          {/* Messages container */}
          <div
  ref={messagesContainerRef}
  className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6"
>
            {messages.map((msg) => (
              <ScrollReveal key={msg.id} direction="up" delay={0}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.role === "user" ? "bg-[#102A4C] border-[#8B5CF6]/30 text-white" : "bg-gradient-to-br from-[#6D5DFB] to-[#4F46E5] border-white/20 text-white shadow-md"
                  }`}>
                    {msg.role === "user" ? "👤" : "✨"}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-[#6D5DFB] to-[#4F46E5] text-white rounded-tr-none shadow-md" 
                      : "bg-[#102A4C]/80 border border-[#8B5CF6]/20 text-slate-200 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D5DFB] to-[#4F46E5] text-white shadow-md flex items-center justify-center shrink-0">✨</div>
                <div className="p-4 rounded-2xl bg-[#102A4C]/80 border border-[#8B5CF6]/20 rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#0B1F3A] border-t border-[#8B5CF6]/15">
            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 mb-4 pb-2 overflow-x-auto no-scrollbar">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="px-3 py-1.5 bg-[#102A4C]/80 hover:bg-[#102A4C] border border-[#8B5CF6]/25 rounded-full text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap shrink-0 hover:border-[#8B5CF6]"
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
                className="w-full pl-5 pr-14 py-4 bg-[#102A4C]/80 border border-[#8B5CF6]/25 rounded-2xl outline-none transition-all duration-200 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-white placeholder:text-[#94A3B8] text-sm"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 w-10 h-10 rounded-xl bg-[#6D5DFB] hover:bg-[#8B5CF6] text-white flex items-center justify-center disabled:opacity-40 transition-colors shadow-md"
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      </div>
    </div>
  );
}
