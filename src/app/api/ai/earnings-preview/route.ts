import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, historicalEarnings, fundamentals } = body;

    const prompt = `Analyze ${ticker}'s upcoming earnings. Historical EPS data: ${JSON.stringify(historicalEarnings?.slice(0, 8))}.
Fundamentals: ${JSON.stringify(fundamentals)}.
Return only valid JSON with these exact fields:
expectation: beat/meet/miss,
confidence: 0-100,
keyThingsToWatch: string array of 3,
historicalPattern: string (1 sentence),
riskLevel: low/medium/high,
suggestion: string (1 sentence).`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Earnings Preview Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI earnings preview" },
      { status: 500 }
    );
  }
}
