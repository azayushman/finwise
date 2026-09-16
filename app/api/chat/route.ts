import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// Initialize the Gemini client with explicit API key
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Initialize the OpenAI client conditionally based on the environment variable
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Using a fast, modern model suitable for low-latency chat for Gemini
const GEMINI_MODEL = "gemini-3.6-flash";
// Centralized model selection for OpenAI
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

/** Maximum character length for any single user message */
const MAX_MESSAGE_LENGTH = 4000;
/** Maximum number of history messages to send to the provider */
const MAX_HISTORY = 15;

const SYSTEM_INSTRUCTION = `You are FinWise, a sharp, empathetic, and conversational financial advisor.
Tone guidelines:
- Answer questions directly and concisely (maximum 2-3 short paragraphs).
- Avoid lecturing, textbook definitions, or condescending phrases like "Think of it as...".
- Use clean bullet points only when listing items or steps.
- If asked what finance is, explain it practically in 2 clear sentences focused on cash flow and freedom, then ask the user what specific goal they want to calculate or plan today.`;

/**
 * Validate and sanitize the userData object to only include expected financial fields.
 * Treats all client-provided data as untrusted input.
 */
function sanitizeUserData(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;

  // Only allow known, safe fields with strict type validation
  const sanitized: Record<string, unknown> = {};

  if (Array.isArray(obj.transactions)) {
    // Limit to 100 transactions and validate each
    const safeTxs = obj.transactions.slice(0, 100).filter(
      (tx): tx is { amount: number; type: string; category: string; description?: string } =>
        tx !== null &&
        typeof tx === "object" &&
        typeof (tx as Record<string, unknown>).amount === "number" &&
        isFinite((tx as Record<string, unknown>).amount as number) &&
        typeof (tx as Record<string, unknown>).type === "string" &&
        typeof (tx as Record<string, unknown>).category === "string"
    ).map(tx => ({
      amount: tx.amount,
      type: String(tx.type).substring(0, 20),
      category: String(tx.category).substring(0, 50),
    }));

    if (safeTxs.length > 0) {
      sanitized.transactions = safeTxs;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

/**
 * Validate a single message object from the messages array.
 */
function isValidMessage(msg: unknown): msg is { role: string; content: string } {
  if (!msg || typeof msg !== "object") return false;
  const m = msg as Record<string, unknown>;
  return typeof m.role === "string" && typeof m.content === "string";
}

export async function POST(req: Request) {
  // Parse JSON body with explicit error handling for malformed requests
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request: malformed JSON body." },
      { status: 400 }
    );
  }

  try {
    const { messages, userData, provider = "gemini" } = body;

    // Validate provider
    if (provider !== "gemini" && provider !== "openai") {
      return NextResponse.json({ error: "Invalid provider selected." }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request: missing messages." }, { status: 400 });
    }

    // Validate and sanitize each message, discarding invalid entries
    const validMessages = messages.filter(isValidMessage);
    if (validMessages.length === 0) {
      return NextResponse.json({ error: "Invalid request: no valid messages provided." }, { status: 400 });
    }

    // Limit conversation history to prevent excessive payloads
    const recentMessages = validMessages.slice(-MAX_HISTORY);

    // Build context instruction with sanitized user data
    let contextInstruction = SYSTEM_INSTRUCTION;
    const safeUserData = sanitizeUserData(userData);
    if (safeUserData) {
      contextInstruction += `\n\n--- User Financial Context ---\nThe user has tracked financial transactions in their account. If they ask for personalized insights on their spending, use this data:\n${JSON.stringify(safeUserData)}\nImportant: Use this data ONLY if directly relevant to the user's question. Do NOT mention it unprompted.`;
    }

    if (provider === "openai") {
      if (!process.env.OPENAI_API_KEY || !openai) {
        console.error("OPENAI_API_KEY is missing from environment.");
        return NextResponse.json(
          { message: "FinWise is running in offline mode. Please add your OPENAI_API_KEY to the .env.local file to enable full AI responses." },
          { status: 200 }
        );
      }

      // Map our message roles to OpenAI's expected roles with length limits
      const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: contextInstruction },
        ...recentMessages.map((msg) => {
          const content = msg.content.substring(0, MAX_MESSAGE_LENGTH);
          return {
            role: (msg.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
            content: content,
          };
        }),
      ];

      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: openaiMessages,
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content;
      if (!text) {
        throw new Error("Empty response from provider.");
      }

      return NextResponse.json({ message: text });

    } else {
      // Default to Gemini
      if (!process.env.GEMINI_API_KEY || !ai) {
        console.error("GEMINI_API_KEY is missing from environment.");
        return NextResponse.json(
          { message: "FinWise is running in offline mode. Please add your GEMINI_API_KEY to the .env.local file to enable full AI responses." },
          { status: 200 }
        );
      }

      // Map our message roles to Gemini's expected roles with length limits
      const contents = recentMessages.map((msg) => {
        const content = msg.content.substring(0, MAX_MESSAGE_LENGTH);
        return {
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: content }],
        };
      });

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: contextInstruction,
          temperature: 0.7,
        },
      });

      if (!response.text) {
        throw new Error("Empty response from provider.");
      }

      return NextResponse.json({ message: response.text });
    }
  } catch (error) {
    // Log only a safe summary — never log full error objects which may contain secrets
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat API error:", errMsg);
    return NextResponse.json(
      { message: "FinWise is running in offline mode due to a connection issue. Please try again later or check your API keys." },
      { status: 200 }
    );
  }
}
