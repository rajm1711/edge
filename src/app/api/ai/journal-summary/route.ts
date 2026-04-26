import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trades } = body;

    const prompt = `You are a trading psychology coach and performance analyst.
Analyze these journal entries from a stock analyst/trader: ${JSON.stringify(trades)}.
Return only valid JSON with these exact fields:
overallGrade: A/B/C/D/F,
gradingReason: string (1 sentence),
performanceSummary: string (2 sentences),
winRate: number,
avgRR: number,
topStrength: string (1 sentence),
mainWeakness: string (1 sentence),
emotionalPatterns: array of { emotion: string, wins: number, losses: number, insight: string (1 sentence) },
bestSetup: string (1 sentence),
worstHabit: string (1 sentence),
weeklyGoals: string array of exactly 3,
psychologyScore: 0-100,
disciplineScore: 0-100,
riskManagementScore: 0-100.`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Journal Summary Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI journal summary" },
      { status: 500 }
    );
  }
}
