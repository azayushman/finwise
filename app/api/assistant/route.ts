import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const geminiApiKey = process.env.GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const SYSTEM_INSTRUCTION = `
You are FinWise, a friendly and practical financial literacy assistant designed primarily for Indian college students.

Your goal is to explain personal finance clearly, simply, accurately, and concisely.

Response style & Quality Rules:
- Answer the user's actual question directly first.
- Provide concise, useful explanations.
- Use simple language suitable for a college student.
- Prefer short paragraphs and bullet points.
- Do not repeat the user's question.
- Avoid unnecessary greetings, introductions, or excessive emojis.
- Avoid promotional language; do not recommend a specific financial product unless explicitly asked.
- Do not invent statistics, regulations, rates, or facts.
- Do not claim certainty about future financial outcomes. If information is uncertain or depends on current rules/rates, explicitly say so.
- Clearly distinguish between saving, spending, borrowing, and investing.
- Always mention risks when investment topics are discussed.
- Use ₹ (INR) and Indian examples when money examples are appropriate.
- For calculations, show the important steps clearly.
- For comparisons, use a compact bullet list or table when useful.
- If the user asks a simple question, keep the answer short. No unnecessary disclaimers on simple educational questions.
- If the user asks for a detailed explanation, provide more detail.
- Provide practical takeaways.

Financial safety:
- You provide general financial education, not personalized financial, investment, tax, legal, or medical advice.
- Do not guarantee investment returns or financial outcomes.
- For personalized or high-stakes financial decisions, encourage the user to verify the information with a qualified professional.
- Never ask the user for passwords, API keys, bank account numbers, card numbers, or other sensitive financial credentials.

Keep the tone friendly, natural, encouraging, and useful — like a knowledgeable senior helping a college student understand money.
`;

function normalizeResponse(text: string): string {
  if (!text) return "";
  let normalized = text.trim();
  // Remove 3 or more consecutive newlines and replace with 2
  normalized = normalized.replace(/\n{3,}/g, '\n\n');
  return normalized;
}

function selectProvider(message: string): "gemini" | "openai" {
  const m = message.toLowerCase();
  
  // Deterministic keyword checks for complex requests
  if (
    m.includes("compare") ||
    m.includes("calculate") ||
    m.includes("plan") ||
    m.includes("analyze") ||
    m.includes("analysis") ||
    m.includes("vs") ||
    m.includes("versus") ||
    m.includes("detailed") ||
    m.includes("step by step")
  ) {
    return "openai";
  }
  
  // Default for normal financial education queries
  return "gemini";
}

function applyFinancialSafety(message: string): { blocked: boolean; response?: string } {
  const m = message.toLowerCase();

  const unsafePatterns = [
    "guaranteed return",
    "guaranteed profit",
    "definitely make money",
    "sure return",
    "evade tax",
    "hide money",
    "steal money",
    "commit fraud",
    "api key",
    "password",
    "bank account number",
    "card number",
    "credit card number",
    "otp",
    "pin number"
  ];

  const isUnsafe = unsafePatterns.some((pattern) => m.includes(pattern));

  if (isUnsafe) {
    return {
      blocked: true,
      response:
        "FinWise provides general financial education. I cannot guarantee investment returns, assist with illegal activities, or handle sensitive data like passwords, OTPs, or bank credentials. Please protect your personal information.",
    };
  }

  return { blocked: false };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;
    const history = body?.history;
    const userContext = body?.userContext;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A valid message is required." },
        { status: 400 }
      );
    }

    const safetyCheck = applyFinancialSafety(message);
    if (safetyCheck.blocked) {
      return NextResponse.json({
        response: safetyCheck.response,
      });
    }

    const provider = selectProvider(message);

    const parsedHistory: { role: string; content: string }[] = [];
    if (Array.isArray(history)) {
      history.forEach((msg) => {
        if (msg && typeof msg === "object" && typeof msg.content === "string") {
          parsedHistory.push({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content.substring(0, 2000),
          });
        }
      });
    }

    let dynamicSystemInstruction = SYSTEM_INSTRUCTION;
    if (userContext && typeof userContext === "object") {
      const safeContext = {
        totalIncome: typeof userContext.totalIncome === "number" ? userContext.totalIncome : undefined,
        totalExpense: typeof userContext.totalExpense === "number" ? userContext.totalExpense : undefined,
        balance: typeof userContext.balance === "number" ? userContext.balance : undefined,
        spendingByCategory: typeof userContext.spendingByCategory === "object" ? userContext.spendingByCategory : undefined,
      };

      dynamicSystemInstruction += `\n\n--- User Financial Context ---
The user has provided the following high-level financial summary:
${JSON.stringify(safeContext, null, 2)}
Important Rules regarding this context:
1. Use this data ONLY if it is directly relevant to answering the user's specific question.
2. Do NOT mention or list this data unprompted.
3. This is aggregated summary data. Do NOT use it to provide guaranteed, high-stakes, or highly personalized investment advice.
4. If the user asks about their spending, use this data to provide a helpful, educational overview.`;
    }

    const tryGemini = async () => {
      if (!geminiApiKey) throw new Error("Gemini API key is not configured.");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      
      const contents = parsedHistory.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));
      contents.push({
        role: "user",
        parts: [{ text: message.trim() }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: dynamicSystemInstruction,
        },
      });
      return response.text ?? "I couldn't generate a response.";
    };

    const tryOpenAI = async () => {
      if (!openaiApiKey) throw new Error("OpenAI API key is not configured.");
      const openai = new OpenAI({ apiKey: openaiApiKey });
      const openAiModel = process.env.OPENAI_MODEL || "gpt-4o";
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: dynamicSystemInstruction },
        ...parsedHistory.map(msg => ({
          role: (msg.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
          content: msg.content,
        })),
        { role: "user", content: message.trim() },
      ];

      const response = await openai.chat.completions.create({
        model: openAiModel,
        messages: messages,
      });
      return response.choices[0]?.message?.content ?? "I couldn't generate a response.";
    };

    let textResponse: string | null = null;

    if (provider === "openai") {
      try {
        textResponse = await tryOpenAI();
      } catch (openaiError) {
        console.error("OpenAI failed, falling back to Gemini:", openaiError);
        textResponse = await tryGemini();
      }
    } else {
      try {
        textResponse = await tryGemini();
      } catch (geminiError) {
        console.error("Gemini failed, falling back to OpenAI:", geminiError);
        textResponse = await tryOpenAI();
      }
    }

    if (textResponse) {
      textResponse = normalizeResponse(textResponse);
    }

    return NextResponse.json({
      response: textResponse,
    });
  } catch (error) {
    console.error("AI API error:", error);

    return NextResponse.json(
      { error: "Unable to contact the AI assistant right now." },
      { status: 500 }
    );
  }
}