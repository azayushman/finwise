import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomeView } from "./components/HomeView";
import { LearnView } from "./components/LearnView";
import { ToolsView } from "./components/ToolsView";
import { QuizView } from "./components/QuizView";
import { AssistantView } from "./components/AssistantView";
import { BudgetView } from "./components/BudgetView";
import { SavingsView } from "./components/SavingsView";
import { DashboardView } from "./components/DashboardView";
import { AuthModal } from "./components/AuthModal";
import { Transaction, SavingsGoal, UserProfile, UserFinancialContext } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("finwise_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
    return {
      id: "demo-alex",
      name: "Alex",
      email: "alex@finwise.app",
      isDemo: true,
      currencySymbol: "₹",
    };
  });

  // Financial data state
  const [income, setIncome] = useState<number>(45000);
  const [expenses, setExpenses] = useState<Transaction[]>([
    { id: "1", name: "Apartment Rent & Society", amount: 15000, type: "expense", category: "Housing", date: "2026-09-01" },
    { id: "2", name: "Groceries & Food", amount: 6500, type: "expense", category: "Food", date: "2026-09-03" },
    { id: "3", name: "Metro / Transport", amount: 3000, type: "expense", category: "Transport", date: "2026-09-05" },
    { id: "4", name: "Internet & WiFi", amount: 1200, type: "expense", category: "Utilities", date: "2026-09-07" },
    { id: "5", name: "Streaming & OTT", amount: 800, type: "expense", category: "Subscriptions", date: "2026-09-08" },
    { id: "6", name: "Dining Out & Hangouts", amount: 3500, type: "expense", category: "Entertainment", date: "2026-09-10" },
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      title: "6-Month Emergency Fund",
      targetAmount: 120000,
      currentAmount: 75000,
      targetDate: "2026-12-31",
      category: "Emergency",
    },
    {
      id: "2",
      title: "Laptop for College Project",
      targetAmount: 95000,
      currentAmount: 62000,
      targetDate: "2026-10-15",
      category: "Tech",
    },
  ]);

  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(() => {
    const saved = localStorage.getItem("finwise_quiz_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.score === "number") return parsed;
      } catch (e) {
        console.error("Failed to parse quiz progress", e);
      }
    }
    return null;
  });

  // Persist user profile
  useEffect(() => {
    localStorage.setItem("finwise_user_profile", JSON.stringify(user));
  }, [user]);

  // Handle budget updates from BudgetView
  const handleBudgetUpdated = (newIncome: number, newExpenses: Transaction[]) => {
    setIncome(newIncome);
    setExpenses(newExpenses);
  };

  // Compute aggregated user financial context for AI Assistant
  const spendingByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    spendingByCategory[e.category] = (spendingByCategory[e.category] || 0) + e.amount;
  });
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  const userContext: UserFinancialContext = {
    totalIncome: income,
    totalExpense,
    balance: Math.max(0, income - totalExpense),
    spendingByCategory,
  };

  const handleAskAboutTopic = (topic: string) => {
    setAssistantInitialQuery(`Analyze the financial mechanics and historical precedents of "${topic}" for balance sheet optimization.`);
    setActiveTab("assistant");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScoreSaved = (score: number, total: number) => {
    setQuizScore({ score, total });
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-amber-500/25 selection:text-amber-200">
      {/* Subtle architectural top vignette */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-950/15 to-transparent pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        {activeTab === "home" && (
          <HomeView
            user={user}
            onNavigateTab={setActiveTab}
            onAskAboutTopic={handleAskAboutTopic}
          />
        )}

        {activeTab === "learn" && (
          <LearnView onAskAboutTopic={handleAskAboutTopic} />
        )}

        {activeTab === "tools" && <ToolsView user={user} />}

        {activeTab === "quiz" && (
          <QuizView user={user} onScoreSaved={handleScoreSaved} />
        )}

        {activeTab === "assistant" && (
          <AssistantView
            user={user}
            userContext={userContext}
            initialQuery={assistantInitialQuery}
          />
        )}

        {activeTab === "budget" && (
          <BudgetView
            user={user}
            onBudgetUpdated={handleBudgetUpdated}
            onNavigateToAssistant={() => {
              setAssistantInitialQuery("Audit my monthly budget allocation and calculate optimal reserves under the 50/30/20 framework.");
              setActiveTab("assistant");
            }}
          />
        )}

        {activeTab === "savings" && <SavingsView user={user} />}

        {activeTab === "dashboard" && (
          <DashboardView
            user={user}
            income={income}
            expenses={expenses}
            savingsGoals={savingsGoals}
            quizScore={quizScore}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} />

      {/* Auth / Preferences Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={user}
        onUpdateUser={setUser}
      />
    </div>
  );
}

export default App;
