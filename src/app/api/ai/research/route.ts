import { NextRequest, NextResponse } from "next/server";
import { callGroq, sanitizePromptContext } from "@/lib/groq";
import { z } from "zod";

const researchInputSchema = z.object({
  ticker: z.string().trim().min(1).max(10).transform((val) => val.toUpperCase()),
  symbol: z.string().trim().optional(),
  price: z.union([z.number(), z.string()]).optional(),
  fundamentals: z.record(z.string(), z.any()).optional(),
  profile: z.record(z.string(), z.any()).optional(),
  query: z.string().max(500).optional(),
});

const researchOutputSchema = z.object({
  oneLiner: z.string().default("Company qualitative research analysis."),
  bullCase: z.string().default("Positive operational drivers support valuation."),
  bearCase: z.string().default("Macroeconomic & sector headwinds present risks."),
  keyStrengths: z.array(z.string()).default([]),
  keyRisks: z.array(z.string()).default([]),
  analyticalOutlook: z
    .enum([
      "Bullish",
      "Moderately Bullish",
      "Neutral",
      "Moderately Bearish",
      "Bearish",
    ])
    .default("Neutral"),
  confidenceScore: z.number().min(0).max(100).default(50),
  illustrativeValuationRange: z.string().default("N/A"),
  verdictReason: z.string().default("Based on fundamental metrics and news sentiment."),
  catalysts: z.array(z.string()).default([]),
  summary: z.string().default("Detailed stock analysis report."),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsedInput = researchInputSchema.safeParse(rawBody);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid stock research request parameters",
          details: parsedInput.error.format(),
        },
        { status: 400 }
      );
    }

    const { ticker: inputTicker, symbol, price, fundamentals, profile, query } = parsedInput.data;
    const ticker = inputTicker || symbol || "UNKNOWN";

    const companyNameStr = typeof profile?.companyName === "string" ? profile.companyName : String(ticker);
    const safeCompanyName = sanitizePromptContext(companyNameStr);
    const safeUserQuery = sanitizePromptContext(query || "Provide comprehensive qualitative analysis.");

    const prompt = `You are an AI financial research assistant providing structured, evidence-based educational analysis for equity research.
Ticker: ${ticker} (${safeCompanyName})
Current Price: $${price || "N/A"}
User Focus Query:
${safeUserQuery}

Fundamentals Data:
${JSON.stringify(fundamentals || {})}

Provide an objective qualitative breakdown. Do NOT provide financial advice or buy/sell execution mandates.
Return only valid JSON with these exact fields:
- "oneLiner": string (1 sentence company overview)
- "bullCase": string (2-3 sentences explaining growth drivers)
- "bearCase": string (2-3 sentences explaining key downside risks)
- "keyStrengths": array of 3 specific operational strengths
- "keyRisks": array of 3 specific operational risks
- "analyticalOutlook": string (exactly one of: "Bullish", "Moderately Bullish", "Neutral", "Moderately Bearish", or "Bearish")
- "confidenceScore": number (0-100 analytical confidence)
- "illustrativeValuationRange": string (e.g. "$190 - $210 (Illustrative Scenario Context)")
- "verdictReason": string (1 sentence supporting reason)
- "catalysts": array of 3 upcoming catalysts
- "summary": string (2 structured paragraphs of analysis)`;

    const data = await callGroq(prompt, {
      schema: researchOutputSchema,
      maxTokens: 1500,
      temperature: 0.3,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Research Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate AI stock research" },
      { status: 500 }
    );
  }
}
