import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, price, calls, puts } = body;

    const prompt = `Explain this options chain for ${ticker} at $${price} to a stock analyst.
Calls: ${JSON.stringify(calls?.slice(0, 10))}. Puts: ${JSON.stringify(puts?.slice(0, 10))}.
Return only valid JSON with these exact fields:
marketSentimentFromOptions: bullish/bearish/neutral,
putCallRatio: string,
notableStrikes: string array of 3,
unusualActivity: string (1 sentence),
plainEnglishSummary: string (2 sentences).`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Options Explainer Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI options explainer" },
      { status: 500 }
    );
  }
}
