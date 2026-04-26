import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, entryPrice, exitPrice, entryDate, exitDate, reason, emotion, outcome, thesis } = body;

    const prompt = `Analyze this individual trade as a trading coach.
Ticker: ${ticker}, Entry: $${entryPrice} on ${entryDate},
Exit: $${exitPrice} on ${exitDate},
Thesis: ${thesis}, Reason: ${reason},
Emotion at entry/exit: ${emotion}, Outcome: ${outcome}.
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
  } catch (error) {
    console.error("AI Trade Autopsy Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI trade autopsy" },
      { status: 500 }
    );
  }
}
