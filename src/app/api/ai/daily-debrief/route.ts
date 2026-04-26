import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { watchlist, marketData, topNews } = body;

    const prompt = `You are a market analyst giving an end-of-day briefing.
Market summary: ${JSON.stringify(marketData)}.
Top stories: ${JSON.stringify(topNews?.slice(0, 5))}.
Watchlist performance: ${JSON.stringify(watchlist)}.
Return only valid JSON with these exact fields:
marketSummary: string (2 sentences),
sessionMood: bullish/bearish/neutral,
biggestStory: string (1 sentence),
watchlistWinners: string array of tickers with reason,
watchlistLosers: string array of tickers with reason,
tomorrowWatchlist: string array of 3 tickers with 1 sentence reason each,
keyLevelsToWatch: string array of 3,
analystTip: string (1 sentence).`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Daily Debrief Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI daily debrief" },
      { status: 500 }
    );
  }
}
