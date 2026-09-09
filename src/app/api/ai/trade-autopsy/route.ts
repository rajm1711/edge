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

    const { ticker, entryPrice, exitPrice, entryDate, exitDate, reason, emotion, outcome, thesis } = body.trade || body;

    if (!ticker) {
      return NextResponse.json(
        { success: false, error: "Trade ticker symbol is required for autopsy analysis" },
        { status: 400 }
      );
    }

    const prompt = `Analyze this individual trade as a trading coach.
Ticker: ${ticker}, Entry: $${entryPrice || "N/A"} on ${entryDate || "N/A"},
Exit: $${exitPrice || "N/A"} on ${exitDate || "N/A"},
Thesis: ${thesis || "N/A"}, Reason: ${reason || "N/A"},
Emotion at entry/exit: ${emotion || "N/A"}, Outcome: ${outcome || "N/A"}.
Return only valid JSON with these exact fields:
whatWentRight: string array of up to 3,
whatWentWrong: string array of up to 3,
emotionImpact: string (1 sentence),
thesisQuality: weak/moderate/strong,
thesisFeedback: string (1 sentence),
keyLesson: string (1 sentence),
doNextTime: string (1 sentence),
score: 0-100.`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Trade Autopsy Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate AI trade autopsy" },
      { status: 500 }
    );
  }
}

