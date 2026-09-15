import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientProviders } from "@/components/ClientProviders";
import { WebVitals } from "@/components/WebVitals";

/**
 * Inter — body / UI text
 * Plus Jakarta Sans — display headings (the `gradient-text` hero spans)
 *
 * Both fonts are self-hosted by Next.js (zero external round-trips),
 * display:swap eliminates FOIT, and latin subset keeps the download small.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  // Load only the weights actually used in the design system
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "FinWise — Smart Financial Planning & Literacy",
    template: "%s | FinWise",
  },
  description:
    "Interactive financial calculators, personalized budgeting tools, and AI-guided financial education.",
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
    title: "FinWise — Smart Financial Planning & Literacy",
    description:
      "Interactive financial calculators, personalized budgeting tools, and AI-guided financial education.",
    type: "website",
    locale: "en_US",
    url: "https://finwise.local",
    siteName: "FinWise",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to Supabase so API calls get a head-start on DNS + TLS */}
        <link rel="preconnect" href="https://fpjypwiecgfbxsyutflc.supabase.co" />
        <link rel="dns-prefetch" href="https://fpjypwiecgfbxsyutflc.supabase.co" />
        {/* PWA & Mobile metadata */}
        <meta name="theme-color" content="#10b981" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#07111F] text-[#F5F7FF] relative">
        <div className="fixed inset-0 liquid-glow -z-10" aria-hidden="true" />
        {/* ClientProviders internally lazy-loads the cursor listener (ssr:false)
            so it doesn't block first paint or cause hydration mismatches. */}
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WebVitals />
        </ClientProviders>
      </body>
    </html>
  );
}
