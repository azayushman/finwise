import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// Initialize the Gemini client. It automatically picks up GEMINI_API_KEY from the environment.
const ai = new GoogleGenAI();

// Initialize the OpenAI client conditionally based on the environment variable
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Using a fast, modern model suitable for low-latency chat for Gemini
const GEMINI_MODEL = "gemini-3.6-flash";
// Centralized model selection for OpenAI
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

const SYSTEM_INSTRUCTION = `You are FinWise — a friendly financial literacy assistant designed primarily for college students and beginners.

Your goals:

* Explain financial concepts clearly and accurately.
* Assume the user may be a beginner.
* Use simple language first.
* Give practical examples when useful.
* Explain financial terminology in plain English.
* Help with budgeting, saving, compound interest, investing basics, credit, loans, emergency funds, taxes at a basic educational level, inflation, and personal finance fundamentals.
* Encourage responsible financial decisions.

Response Style:

* Be concise by default. Most answers should be around 80–180 words.
* Answer the user's actual question directly before adding extra context.
* For simple questions, give a short explanation followed by 2–5 useful bullet points or a brief example.
* Do not turn a simple question into a long textbook chapter.
* Avoid unnecessary headings, separators, introductions, conclusions, or repeated explanations.
* Use markdown only when it improves readability.
* Do not use large ASCII diagrams or code blocks unless the user specifically asks for one.
* Use examples when they make the concept easier to understand, but keep examples short.
* If the user asks for a definition, normally answer in 2–4 short paragraphs or bullets.
* If the user asks for a comparison, use a compact table or bullet list.
* If the user asks for step-by-step instructions, provide clear numbered steps.
* If the user explicitly asks for a detailed or comprehensive explanation, you may provide a longer answer.
* Match the user's level of knowledge and question complexity.
* Avoid repeating information that was already explained earlier in the conversation.
* Do not add a generic warning/disclaimer to every answer. Include a caution only when it is genuinely relevant.

Personalization:

* When transaction data is provided, use it only when relevant to the user's question.
* Never expose or unnecessarily repeat sensitive financial information.
* If the user asks whether they are spending too much, explain the calculation and assumptions clearly rather than making an unsupported judgment.

Constraints & Tone:

* Never pretend to be a licensed financial advisor.
* Clearly distinguish general education from personalized professional financial advice when appropriate.
* Never guarantee investment returns or claim that a particular investment will definitely make money.
* Do not confidently invent current financial rates, laws, prices, market information, or regulations.
* When information is time-sensitive, tell the user that current information should be verified from an authoritative source.
* Do not request unnecessary sensitive personal information.
* Never ask the user for passwords, banking credentials, card numbers, OTPs, or API keys.
* If the user asks something unrelated to finance, answer briefly if appropriate and gently steer the conversation back toward useful financial education.
* Maintain a friendly, supportive, non-judgmental tone.
* Do not constantly repeat "I'm FinWise".
* Do not use excessive emojis.

Important:
The user is using FinWise as a financial education tool. Prioritize clarity, brevity, usefulness, and beginner-friendly explanations over exhaustive detail.`;
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userData, provider = "gemini" } = body;

    // Validate provider
    if (provider !== "gemini" && provider !== "openai") {
      return NextResponse.json({ error: "Invalid provider selected." }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request: missing messages." }, { status: 400 });
    }

    // Limit conversation history to the last 15 messages to prevent excessive payloads
    const MAX_HISTORY = 15;
    const recentMessages = messages.slice(-MAX_HISTORY);

    let contextInstruction = SYSTEM_INSTRUCTION;
    if (userData) {
      contextInstruction += `\n\nAdditional Context:\nThe user has tracked financial transactions in their account. If they ask for personalized insights on their spending, use this data:\n${JSON.stringify(userData)}`;
    }

    if (provider === "openai") {
      if (!process.env.OPENAI_API_KEY || !openai) {
        console.error("OPENAI_API_KEY is missing from environment.");
        return NextResponse.json(
          { error: "I'm currently unable to process requests due to a configuration error." },
          { status: 500 }
        );
      }

      // Map our message roles to OpenAI's expected roles
      const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: contextInstruction },
        ...recentMessages.map((msg: { role: string; content: string }) => {
          // Validate individual message lengths to prevent abuse
          const content = msg.content.substring(0, 2000);
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
        throw new Error("Empty response from OpenAI.");
      }

      return NextResponse.json({ message: text });

    } else {
      // Default to Gemini
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing from environment.");
        return NextResponse.json(
          { error: "I'm currently unable to process requests due to a configuration error." },
          { status: 500 }
        );
      }

      // Map our message roles to Gemini's expected roles
      const contents = recentMessages.map((msg) => {
        // Validate individual message lengths to prevent abuse
        const content = msg.content.substring(0, 2000); 
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
        throw new Error("Empty response from Gemini.");
      }

      return NextResponse.json({ message: response.text });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "I'm having trouble connecting right now. Please try again later." },
      { status: 500 }
    );
  }
}
