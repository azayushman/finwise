import type { Metadata } from "next";
import { AssistantClient } from "./AssistantClient";

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "Chat with your FinWise personal finance assistant.",
};

export default function AssistantPage() {
  return <AssistantClient />;
}
