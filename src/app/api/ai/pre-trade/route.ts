import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, price, thesis, level, horizon, news, fundamentals } = body;

    const prompt = `You are a trading risk coach reviewing a trade idea.
Stock: ${ticker} at $${price}. Analyst thesis: ${thesis}.
Price level: ${level}. Time horizon: ${horizon}.
Recent news: ${JSON.stringify(news?.slice(0, 5))}. Fundamentals: ${JSON.stringify(fundamentals)}.
Evaluate this trade idea objectively.
Return only valid JSON with these exact fields:
overallScore (0-100),
grade (A/B/C/D/F),
greenFlags (string array of positives, up to 4),
redFlags (string array of risks/weaknesses, up to 4),
missingResearch (string array of what analyst hasn't considered, up to 3),
suggestion (string, 2 sentences of honest coaching),
verdict (proceed/reconsider/avoid).`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Pre-Trade Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI pre-trade analysis" },
      { status: 500 }
    );
  }
}
