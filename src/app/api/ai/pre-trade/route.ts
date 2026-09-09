import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing JSON request body" },
        { status: 400 }
      );
    }

    const { ticker, price, thesis, level, horizon, news, fundamentals } = body;

    if (!ticker) {
      return NextResponse.json(
        { success: false, error: "Ticker symbol is required for pre-trade evaluation" },
        { status: 400 }
      );
    }

    const prompt = `You are a trading risk coach reviewing a trade idea.
Stock: ${ticker} at $${price || "N/A"}. Analyst thesis: ${thesis || "None provided"}.
Price level: ${level || "N/A"}. Time horizon: ${horizon || "N/A"}.
Recent news: ${JSON.stringify(news?.slice(0, 5) || [])}. Fundamentals: ${JSON.stringify(fundamentals || {})}.
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
  } catch (error: any) {
    console.error("AI Pre-Trade Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate AI pre-trade analysis" },
      { status: 500 }
    );
  }
}

