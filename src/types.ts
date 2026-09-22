export type ExpenseCategory =
  | "Housing"
  | "Food"
  | "Transport"
  | "Utilities"
  | "Entertainment"
  | "Healthcare"
  | "Education"
  | "Subscriptions"
  | "Personal Care"
  | "Debt Payment"
  | "Other";

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: "income" | "expense";
  category: ExpenseCategory;
  date: string;
}

export interface BudgetGoal {
  id: string;
  category: ExpenseCategory;
  monthlyLimit: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: "Emergency" | "Education" | "Travel" | "Tech" | "Investment" | "Other";
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: "Budgeting" | "Investing" | "Debt & Credit" | "Savings" | "Economics";
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers: Record<number, number>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface UserFinancialContext {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  spendingByCategory: Record<string, number>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
  currencySymbol: string;
}
