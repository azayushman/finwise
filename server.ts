import express from "express";
import path from "node:path";
import fs from "node:fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

// System instructions for FinWise Wall Street Heritage Strategist
const SYSTEM_INSTRUCTION = `You are the Wall Street Heritage Strategist for FinWise — an institutional-grade financial analyst, wealth advisor, and market historian.
Your persona blends 230+ years of Wall Street market discipline (from the 1792 Buttonwood Agreement under 68 Wall Street, Alexander Hamilton's foundational treasury principles, Benjamin Graham's value and margin-of-safety doctrines, and J.P. Morgan's liquidity rules, to modern quantitative portfolio allocation and compounding).

STRICT DOMAIN LIMITATION:
You are specialized EXCLUSIVELY in personal finance, capital allocation, money management, budgeting frameworks (such as 50/30/20), compound growth arithmetic, debt liquidation strategies, emergency liquidity reserves, index funds, and financial market history.
You MUST NOT answer any questions outside the personal finance, economic, and market history domain (such as coding, programming, recipes, cooking, entertainment, sports, gaming, romantic advice, poetry, casual chit-chat, or general trivia).

If the user asks about anything unrelated to finance, you must politely decline with authoritative Wall Street composure:
"As a Wall Street capital strategist and wealth preservation advisor, my advisory remit is strictly confined to personal finance, capital allocation, market economics, budgeting, and financial fundamentals. Let us direct our focus to your financial balance sheet, capital reserves, debt strategy, or long-term compounding plan."

Tone & Response Rules:
- Authoritative, disciplined, erudite, objective, and mature.
- Answer the core financial inquiry directly and practically first.
- Weave in relevant Wall Street history or institutional principles where enlightening (e.g. Benjamin Graham's Margin of Safety, J.P. Morgan's 1907 liquidity crisis rules, John Bogle's compounding arithmetic, or the 1792 Buttonwood diversification principle).
- Distinguish strictly between guaranteed liquid reserves (cash, high-yield bank deposits, short-term treasury bills) and market-risk equity instruments.
- Structure replies with clean, scannable formatting (bullet points, bold highlights, 100-220 words).
- You provide conceptual educational intelligence and empirical models, not certified individualized legal or tax advisory.
- Never ask for or store passwords, PINs, OTPs, card numbers, or bank account credentials.`;

function normalizeResponse(text: string): string {
  if (!text) return "";
  let normalized = text.trim();
  normalized = normalized.replace(/\n{3,}/g, "\n\n");
  return normalized;
}

// B7 Hardened Deterministic Safety Filter & Finance Topic Validator
function applyFinancialSafety(message: string): { blocked: boolean; response?: string } {
  const m = message.toLowerCase().trim();

  const unsafePhrases = [
    "guaranteed return",
    "guaranteed profit",
    "definitely make money",
    "sure return",
    "100% risk free",
    "double my money guaranteed",
    "evade tax",
    "tax evasion",
    "hide money from tax",
    "steal money",
    "commit fraud",
    "money laundering",
    "insider trading",
    "api key",
    "secret key",
    "private key",
    "password",
    "netbanking password",
    "bank account number",
    "card number",
    "credit card",
    "debit card",
    "cvv",
    "cvv2",
    "otp",
    "pin number",
    "atm pin",
    "upi pin",
    "aadhaar",
    "pan card number",
  ];

  const hasUnsafePhrase = unsafePhrases.some((phrase) => m.includes(phrase));

  const cardPattern = /\b(?:\d[ -]*?){13,19}\b/;
  const cvvPattern = /\b(?:cvv|cvv2|security code)\s*[:=]?\s*\d{3,4}\b/i;
  const otpPattern = /\b(?:otp|one time password)\s*[:=]?\s*\d{4,8}\b/i;

  if (hasUnsafePhrase || cardPattern.test(message) || cvvPattern.test(message) || otpPattern.test(message)) {
    return {
      blocked: true,
      response:
        "FinWise provides general financial education. I cannot guarantee investment returns, assist with illegal activities, or handle sensitive credentials such as passwords, OTPs, PINs, bank details, card numbers, or government IDs. Please keep your personal financial information safe and private.",
    };
  }

  // Non-Finance Topic Gating
  const explicitNonFinance = [
    "write code",
    "python",
    "javascript",
    "html",
    "css",
    "react",
    "java",
    "c++",
    "sql query",
    "programming",
    "debug this",
    "write a script",
    "recipe",
    "how to cook",
    "how to bake",
    "ingredients for",
    "quantum physics",
    "gravity",
    "biology",
    "chemistry",
    "who is napoleon",
    "world war",
    "history of",
    "write a poem",
    "write a story",
    "write an essay",
    "lyrics to",
    "movie recommendations",
    "who won the match",
    "cricket score",
    "football match",
    "weather today",
    "capital of",
    "translate to",
    "dating advice",
    "workout routine",
    "tell me a joke",
  ];

  if (explicitNonFinance.some((term) => m.includes(term)) || (!isFinanceOrGreeting(m) && m.length > 5)) {
    return {
      blocked: true,
      response:
        "As a Wall Street capital strategist and wealth preservation advisor, my advisory remit is strictly confined to personal finance, capital allocation, market economics, budgeting, and financial fundamentals. Let us direct our focus to your financial balance sheet, capital reserves, debt strategy, or long-term compounding plan.",
    };
  }

  return { blocked: false };
}

function isFinanceOrGreeting(query: string): boolean {
  const q = query.toLowerCase().trim();
  const greetings = ["hi", "hello", "hey", "good morning", "good evening", "who are you", "what can you do", "help", "thanks", "thank you"];
  if (greetings.some((g) => q === g || q.startsWith(g + " ") || q.endsWith(" " + g))) {
    return true;
  }

  const financeKeywords = [
    "finance", "financial", "money", "budget", "save", "saving", "invest", "investing", "investment",
    "stock", "equity", "share", "mutual fund", "sip", "fd", "fixed deposit", "ppf", "nps", "compound",
    "interest", "debt", "loan", "emi", "credit", "card", "cibil", "score", "mortgage", "tax", "emergency fund",
    "salary", "income", "expense", "spend", "inflation", "wealth", "cash", "bank", "pension", "retirement",
    "index fund", "etf", "rupee", "dollar", "asset", "liability", "net worth", "portfolio", "dividend",
    "gold", "real estate", "insurance", "premium", "liquidity", "cost", "price", "afford", "bill", "pay",
    "earn", "wallet", "rich", "frugal", "borrow", "lend", "yield", "bonds", "50/30/20", "rule of 72",
    "amc", "nav", "lumpsum", "broker", "capital", "purchasing power"
  ];

  return financeKeywords.some((kw) => q.includes(kw));
}

function isValidPositiveNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && val >= 0 && val <= 1e12;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "FinWise", version: "1.0.0", b7_hardened: true });
});

// Hardened B7 AI Assistant Endpoint
app.post("/api/assistant", async (req, res) => {
  try {
    const { message, history, userContext } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A valid message is required." });
    }

    // B7 Check: Payload ceiling to prevent token exhaustion & DoS
    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message is too long. Please limit your question to 2,000 characters.",
      });
    }

    // B7 Deterministic Safety Guardrail
    const safetyCheck = applyFinancialSafety(message);
    if (safetyCheck.blocked) {
      return res.json({ response: safetyCheck.response });
    }

    // Validate and limit conversation history (max 10 recent messages)
    const parsedHistory: { role: string; content: string }[] = [];
    if (Array.isArray(history)) {
      history.slice(-10).forEach((msg) => {
        if (msg && typeof msg === "object" && typeof msg.content === "string") {
          parsedHistory.push({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content.substring(0, 2000),
          });
        }
      });
    }

    let dynamicSystemInstruction = SYSTEM_INSTRUCTION;

    // B7 Check: Sanitize userContext numbers against NaN and Infinity
    if (userContext && typeof userContext === "object") {
      const sanitizedCategories: Record<string, number> = {};
      if (userContext.spendingByCategory && typeof userContext.spendingByCategory === "object") {
        for (const [cat, amt] of Object.entries(userContext.spendingByCategory)) {
          if (typeof cat === "string" && cat.length <= 40 && isValidPositiveNumber(amt)) {
            sanitizedCategories[cat.substring(0, 40)] = Math.round(amt * 100) / 100;
          }
        }
      }

      const safeContext = {
        totalIncome: isValidPositiveNumber(userContext.totalIncome) ? Math.round(userContext.totalIncome * 100) / 100 : undefined,
        totalExpense: isValidPositiveNumber(userContext.totalExpense) ? Math.round(userContext.totalExpense * 100) / 100 : undefined,
        balance: (isValidPositiveNumber(userContext.totalIncome) && isValidPositiveNumber(userContext.totalExpense))
          ? Math.round((userContext.totalIncome - userContext.totalExpense) * 100) / 100
          : undefined,
        spendingByCategory: Object.keys(sanitizedCategories).length > 0 ? sanitizedCategories : undefined,
      };

      dynamicSystemInstruction += `\n\n--- User Financial Context ---
The user has provided this high-level financial summary:
${JSON.stringify(safeContext, null, 2)}
Important Rules regarding this context:
1. Use this data ONLY if it is directly relevant to answering the user's specific question.
2. Do NOT mention or list this data unprompted.
3. This is aggregated summary data. Do NOT use it to provide guaranteed, high-stakes, or highly personalized investment advice.
4. If the user asks about their spending or budget, use this data to provide a helpful, educational overview.`;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Generating intelligent fallback response.");
      return res.json({
        response: generateEducationalFallback(message.trim()),
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = parsedHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: dynamicSystemInstruction,
      },
    });

    const responseText = geminiResponse.text || "I was unable to generate an explanation at this moment.";
    return res.json({ response: normalizeResponse(responseText) });
  } catch (error) {
    console.error("AI API route error:", error instanceof Error ? error.message : error);
    // Provide safe fallback educational response instead of failing
    const userMsg = typeof req.body?.message === "string" ? req.body.message : "";
    return res.json({
      response: generateEducationalFallback(userMsg),
    });
  }
});

function generateEducationalFallback(query: string): string {
  const q = query.toLowerCase().trim();

  // If clearly non-financial, decline politely
  if (!isFinanceOrGreeting(q)) {
    return "As a Wall Street capital strategist and wealth preservation advisor, my advisory remit is strictly confined to personal finance, capital allocation, market economics, budgeting, and financial fundamentals. Let us direct our focus to your financial balance sheet, capital reserves, debt strategy, or long-term compounding plan.";
  }

  if (q.includes("50/30/20") || q.includes("budget") || q.includes("rule")) {
    return "The **50/30/20 Capital Allocation Framework** is the individual investor's operating balance sheet:\n\n• **50% Essential Liabilities (Needs)**: Fixed obligations like housing, nutrition, and basic utilities. In Wall Street terms, these are non-discretionary operating expenses (OPEX).\n• **30% Discretionary Consumption (Wants)**: Lifestyle expenditure, dining, and recreation.\n• **20% Capital Accumulation & Reserve (Savings & Debt)**: Liquidity buffers, debt liquidation, and long-term equity accumulation (e.g. broad-market SIPs).\n\n*Historical Context*: Much like Benjamin Graham's emphasis on maintaining a margin of safety, adhering to this ratio ensures unexpected economic recessions never force fire-sales of your assets.";
  }

  if (q.includes("compound") || q.includes("interest") || q.includes("growth")) {
    return "The **Mechanics of Compound Growth** represent what Albert Einstein reportedly characterized as the eighth wonder of the world:\n\n• **Mathematical Formula**: A = P(1 + r/n)^(nt)\n• **The Wall Street Principle**: Capital compounding relies on duration rather than speculative market timing. In 200+ years of US stock market history, no rolling 20-year period in diversified equities has ever suffered a negative return.\n• **The Takeaway**: Investing $100 or ₹2,500 monthly at age 20 compounds to multiples of what an investor starting at age 35 with quadruple the capital could accumulate.";
  }

  if (q.includes("sip") || q.includes("dollar cost") || q.includes("averaging") || q.includes("invest")) {
    return "**Systematic Capital Allocation (SIP / Dollar-Cost Averaging)**:\n\n• **Empirical Advantage**: By committing fixed capital at regular intervals, you systematically accumulate more asset units during market drawdowns and fewer at cyclical peaks.\n• **Historical Precedent**: From the 1792 Buttonwood Agreement to modern automated clearing houses, the single greatest determinant of retail portfolio success has not been stock selection, but continuous liquidity deployment into low-cost, productive assets.\n• **Execution**: Automate your monthly allocation on salary day before lifestyle expenses deplete surplus.";
  }

  if (q.includes("emergency") || q.includes("fund") || q.includes("reserve") || q.includes("cushion")) {
    return "**Institutional Emergency Liquidity Reserves**:\n\n• **Target Horizon**: 3 to 6 months of absolute baseline survival expenditures.\n• **Instrument**: High-yield risk-free savings or liquid treasury instruments — strictly segregated from volatile equities.\n• **Historical Precedent**: The Panic of 1907 taught Wall Street that solvency without immediate liquidity causes catastrophic liquidations. Your emergency reserve is your balance sheet's defensive covenant.";
  }

  if (q.includes("debt") || q.includes("loan") || q.includes("credit card")) {
    return "**Debt Liquidation Strategy — Avalanche vs. Snowball**:\n\n• **Debt Avalanche (Mathematical Optimum)**: Direct all surplus cash flow toward the highest interest debt (e.g., 36-42% APR credit cards) while servicing minimums on remaining liabilities. Maximizes preserved capital.\n• **Debt Snowball (Behavioral Momentum)**: Liquidate smallest outstanding balances first to build psychological momentum.\n• **The Golden Rule**: No historical market investment reliably outpaces a 36% annualized credit card interest drag. Eradicate toxic debt before aggressive capital deployment.";
  }

  return "**Four Cardinal Rules of Wall Street Wealth Preservation**:\n\n1. **Maintain Positive Cash Flow**: Outflow must never exceed inflow.\n2. **Preserve Liquid Reserves**: Maintain 3-6 months of defensive reserves before undertaking equity risks.\n3. **Eliminate High-Interest Leverage**: Credit card liabilities compound exponentially against your net worth.\n4. **Automate Compounding**: Deploy surplus capital steadily into diversified broad-market indices.";
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinWise server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
