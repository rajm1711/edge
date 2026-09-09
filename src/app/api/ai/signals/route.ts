import { NextRequest, NextResponse } from "next/server";
import { callGroq, sanitizePromptContext } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const signalsInputSchema = z.object({
  ticker: z.string().trim().min(1).max(10).transform((val) => val.toUpperCase()),
  price: z.union([z.number(), z.string()]).optional(),
  fundamentals: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "client-ip";
    const rateLimit = checkRateLimit(ip, 15, 60000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait a minute before making more requests." },
        { status: 429 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsedInput = signalsInputSchema.safeParse(rawBody);

    if (!parsedInput.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request parameters", details: parsedInput.error.format() },
        { status: 400 }
      );
    }

    const { ticker, price, fundamentals } = parsedInput.data;

    const prompt = `You are an AI financial research assistant.
For stock ticker ${ticker} at $${price || "N/A"} with fundamentals context: ${JSON.stringify(fundamentals || {})},
identify 4-6 AI-generated qualitative market pattern observations and signal confluence factors for educational decision support.
Return only valid JSON object with a "signals" array where each item has:
- "signalName": string
- "type": string ("bullish", "bearish", or "neutral")
- "description": string (1 clear sentence observation)
- "strength": string ("weak", "moderate", or "strong")
- "timeframe": string ("intraday", "swing", or "positional")
- "actionableInsight": string (1 sentence educational observation note)`;

    const data = await callGroq(prompt, {
      maxTokens: 1200,
      temperature: 0.3,
    });

    return NextResponse.json({ success: true, data: data?.signals || data });
  } catch (error: any) {
    console.error("AI Signals Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate AI signals" },
      { status: 500 }
    );
  }
}
