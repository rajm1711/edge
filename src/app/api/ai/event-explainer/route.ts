import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, actual, estimate, previous } = body;

    const prompt = `Explain this economic event to a stock analyst in plain simple terms.
Event: ${eventName}. Actual: ${actual}. Estimate: ${estimate}. Previous: ${previous}.
Return a JSON object with these exact fields:
whatIsIt (string, 1 sentence plain English definition),
whyItMatters (string, 2 sentences why traders care about this),
marketImpact (exactly one of: bullish, bearish, neutral),
affectedSectors (array of up to 3 sector name strings most impacted),
tradingImplication (string, 1 sentence of what analysts should watch)`;

    const data = await callGroq(prompt);
    
    if (!data) {
      throw new Error("Failed to generate response from Groq");
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Event Explainer Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to explain event" },
      { status: 500 }
    );
  }
}
