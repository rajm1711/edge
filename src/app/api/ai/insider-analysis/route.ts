import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, insiderTransactions } = body;

    const prompt = `Analyze these insider transactions for ${ticker}: ${JSON.stringify(insiderTransactions?.slice(0, 15))}.
What do these insider activities signal about the company's outlook?
Return only valid JSON with these exact fields:
summary: string (2 sentences),
sentiment: bullish/bearish/neutral,
keyObservation: string (1 sentence),
warningFlags: string array.`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Insider Analysis Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI insider analysis" },
      { status: 500 }
    );
  }
}
