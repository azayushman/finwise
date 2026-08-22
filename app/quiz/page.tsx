import type { Metadata } from "next";
import { QuizClient } from "./QuizClient";

export const metadata: Metadata = { title: "Finance Quiz" };

export default function QuizPage() {
  return <QuizClient />;
}
