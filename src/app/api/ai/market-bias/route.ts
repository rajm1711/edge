import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vix, spChange, nasdaqChange, headlines, events } = body;

    const prompt = `You are a senior market strategist. Analyze today's market conditions.
Market data: S&P 500 change: ${spChange}%, NASDAQ change: ${nasdaqChange}%,
VIX: ${vix} (${vix > 20 ? "high fear" : "low fear"}).
Top market headlines: ${JSON.stringify(headlines?.slice(0, 10))}.
Economic events today: ${JSON.stringify(events?.slice(0, 5))}.
Return only valid JSON with these exact fields:
overallBias: STRONGLY BULLISH / BULLISH / NEUTRAL / BEARISH / STRONGLY BEARISH,
confidenceScore: 0-100,
reasoning: string array of exactly 4 bullet points,
sectorBias: array of { sector: string, bias: bullish/bearish/neutral, reason: string (1 sentence) } for 7 sectors,
keyRisksToday: string array of 3,
keyOpportunitiesToday: string array of 3,
vixInterpretation: string (1 sentence),
analystNote: string (2 sentences),
tomorrowOutlook: string (1 sentence).`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Market Bias Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI market bias" },
      { status: 500 }
    );
  }
}
