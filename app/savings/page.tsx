import type { Metadata } from "next";
import { SavingsClient } from "./SavingsClient";

export const metadata: Metadata = { title: "Savings Planner" };

export default function SavingsPage() {
  return <SavingsClient />;
}
