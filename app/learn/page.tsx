import type { Metadata } from "next";
import { LearnClient } from "./LearnClient";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return <LearnClient />;
}
