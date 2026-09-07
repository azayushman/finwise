import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FinWise – Understand Money. Make Better Decisions.",
    template: "%s · FinWise",
  },
  description:
    "FinWise makes financial literacy simple and practical for college students and young adults. Learn saving, budgeting, investing, and more.",
  keywords: [
    "financial literacy",
    "budgeting",
    "saving",
    "investing",
    "personal finance",
    "compound interest",
    "credit score",
  ],
  openGraph: {
    title: "FinWise – Understand Money. Make Better Decisions.",
    description:
      "FinWise makes personal finance simple and practical for the next generation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#07111F] text-[#F5F7FF] relative">
        <div className="fixed inset-0 liquid-glow -z-10" aria-hidden="true" />
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
