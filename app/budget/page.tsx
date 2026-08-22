import type { Metadata } from "next";
import { BudgetClient } from "./BudgetClient";

export const metadata: Metadata = { title: "Budget Planner" };

export default function BudgetPage() {
  return <BudgetClient />;
}
