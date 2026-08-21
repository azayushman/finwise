import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your FinWise account to continue learning and tracking your financial progress.",
};

export default function LoginPage() {
  return <LoginClient />;
}
