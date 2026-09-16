import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const geminiApiKey = process.env.GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

/** Maximum character length for any single user message */
const MAX_MESSAGE_LENGTH = 4000;

const SYSTEM_INSTRUCTION = `You are FinWise, a sharp, empathetic, and conversational financial advisor.
Tone guidelines:
- Answer questions directly and concisely (maximum 2-3 short paragraphs).
- Avoid lecturing, textbook definitions, or condescending phrases like "Think of it as...".
- Use clean bullet points only when listing items or steps.
- If asked what finance is, explain it practically in 2 clear sentences focused on cash flow and freedom, then ask the user what specific goal they want to calculate or plan today.`;

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

const UNSAFE_PATTERNS = [
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
  "pin number",
  "cvv",
];

function applyFinancialSafety(message: string): { blocked: boolean; response?: string } {
  const m = message.toLowerCase();

  const isUnsafe = UNSAFE_PATTERNS.some((pattern) => m.includes(pattern));

  if (isUnsafe) {
    return {
      blocked: true,
      response: "FinWise provides general financial literacy and cannot handle sensitive credentials (passwords, PINs, OTPs, card numbers) or guarantee investment returns.",
    };
  }

  return { blocked: false };
}

export async function POST(request: Request) {
  // Parse JSON body with explicit error handling for malformed requests
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request: malformed JSON body." },
      { status: 400 }
    );
  }

  try {
    const message = body?.message;
    const history = body?.history;
    const userContext = body?.userContext;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A valid message is required." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long (max 2,000 characters)." },
        { status: 400 }
      );
    }

    // Truncate message to prevent excessively large inputs
    const trimmedMessage = message.trim().substring(0, MAX_MESSAGE_LENGTH);

    // Apply safety filter to the current message
    const safetyCheck = applyFinancialSafety(trimmedMessage);
    if (safetyCheck.blocked) {
      return NextResponse.json({
        response: safetyCheck.response,
      });
    }

    const provider = selectProvider(trimmedMessage);

    const parsedHistory: { role: string; content: string }[] = [];
    if (Array.isArray(history)) {
      history.forEach((msg) => {
        if (msg && typeof msg === "object" && typeof msg.content === "string") {
          const truncatedContent = msg.content.substring(0, 2000);

          // Also apply safety filter to recent history entries to prevent
          // injection through manipulated conversation history
          const histSafety = applyFinancialSafety(truncatedContent);
          if (!histSafety.blocked) {
            parsedHistory.push({
              role: msg.role === "assistant" ? "assistant" : "user",
              content: truncatedContent,
            });
          }
        }
      });
    }

    let dynamicSystemInstruction = SYSTEM_INSTRUCTION;
    if (userContext && typeof userContext === "object") {
      const ctx = userContext as Record<string, unknown>;
      const safeContext = {
        totalIncome: typeof ctx.totalIncome === "number" && isFinite(ctx.totalIncome) ? ctx.totalIncome : undefined,
        totalExpense: typeof ctx.totalExpense === "number" && isFinite(ctx.totalExpense) ? ctx.totalExpense : undefined,
        balance: typeof ctx.balance === "number" && isFinite(ctx.balance) ? ctx.balance : undefined,
        spendingByCategory: typeof ctx.spendingByCategory === "object" && ctx.spendingByCategory !== null ? ctx.spendingByCategory : undefined,
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
        parts: [{ text: trimmedMessage }],
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
        { role: "user", content: trimmedMessage },
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
        // Log only a safe summary — never log full error objects which may contain secrets
        const errMsg = openaiError instanceof Error ? openaiError.message : "Unknown error";
        console.error("OpenAI failed, falling back to Gemini:", errMsg);
        textResponse = await tryGemini();
      }
    } else {
      try {
        textResponse = await tryGemini();
      } catch (geminiError) {
        const errMsg = geminiError instanceof Error ? geminiError.message : "Unknown error";
        console.error("Gemini failed, falling back to OpenAI:", errMsg);
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
    // Log only a safe summary — never log full error objects which may contain secrets
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("AI API error:", errMsg);

    return NextResponse.json(
      { response: "I'm currently running in offline mode because the AI API keys are missing. To enable full AI responses, please configure your GEMINI_API_KEY or OPENAI_API_KEY. In the meantime, remember that budgeting and saving consistently are the foundation of good financial health!" },
      { status: 200 }
    );
  }
}