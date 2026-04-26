import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, price, fundamentals, profile } = body;

    if (!ticker || !price) {
      return NextResponse.json(
        { success: false, error: "Ticker and price are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a senior equity research analyst at a top investment bank.
Analyze ${ticker} (${profile?.companyName || ticker}) currently trading at $${price}.
Fundamentals: ${JSON.stringify(fundamentals)}.
Return only valid JSON with these exact fields:
oneLiner (string, 1 sentence company description),
bullCase (string, 3 sentences why this stock could go up),
bearCase (string, 3 sentences why this stock could go down),
keyStrengths (string array of 3 specific strengths),
keyRisks (string array of 3 specific risks),
analystVerdict (exactly one of: STRONG BUY / BUY / HOLD / SELL / STRONG SELL),
confidenceScore (number 0-100),
priceTarget (string, e.g. $195-210),
verdictReason (string, 1 sentence),
catalysts (string array of 3 upcoming potential catalysts),
summary (string, 2 detailed paragraphs for an analyst audience).`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Research Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI research" },
      { status: 500 }
    );
  }
}
