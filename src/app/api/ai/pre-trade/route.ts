import { NextRequest, NextResponse } from "next/server";
import { callGroq, sanitizePromptContext } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const preTradeInputSchema = z.object({
  ticker: z.string().trim().min(1).max(10).transform((val) => val.toUpperCase()),
  price: z.union([z.number(), z.string()]).optional(),
  thesis: z.string().max(1000).optional(),
  level: z.string().max(100).optional(),
  horizon: z.string().max(100).optional(),
  news: z.array(z.any()).optional(),
  fundamentals: z.record(z.string(), z.any()).optional(),
});

const preTradeOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).default(50),
  grade: z.enum(["A", "B", "C", "D", "F"]).default("C"),
  greenFlags: z.array(z.string()).default([]),
  redFlags: z.array(z.string()).default([]),
  missingResearch: z.array(z.string()).default([]),
  suggestion: z.string().default("Review risk parameters before executing."),
  verdict: z.enum(["proceed", "reconsider", "avoid"]).default("reconsider"),
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
    const parsedInput = preTradeInputSchema.safeParse(rawBody);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input parameters",
          details: parsedInput.error.format(),
        },
        { status: 400 }
      );
    }

    const { ticker, price, thesis, level, horizon, news, fundamentals } = parsedInput.data;

    const safeThesis = sanitizePromptContext(thesis || "None provided");
    const safeNews = sanitizePromptContext(JSON.stringify(news?.slice(0, 5) || []));

    const prompt = `You are an AI financial risk coach reviewing a trade idea for educational decision support.
Stock Ticker: ${ticker} at $${price || "N/A"}.
Price Level: ${level || "N/A"}. Horizon: ${horizon || "N/A"}.

User Thesis:
${safeThesis}

Recent Market News:
${safeNews}

Fundamentals Context:
${JSON.stringify(fundamentals || {})}

Evaluate this trade idea objectively. Provide an educational safety score and risk assessment.
Return only valid JSON with these exact fields:
- "overallScore": number (0-100)
- "grade": string ("A", "B", "C", "D", or "F")
- "greenFlags": array of up to 4 string key strengths
- "redFlags": array of up to 4 string key risk factors
- "missingResearch": array of up to 3 string unconsidered factors
- "suggestion": string (2 sentences of coaching)
- "verdict": string ("proceed", "reconsider", or "avoid")`;

    const data = await callGroq(prompt, {
      schema: preTradeOutputSchema,
      maxTokens: 1200,
      temperature: 0.3,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Pre-Trade Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate AI pre-trade evaluation" },
      { status: 500 }
    );
  }
}
