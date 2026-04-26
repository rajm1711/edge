import { NextRequest, NextResponse } from "next/server";
import { analyzeBulkSentiment, mapToDisplayLabel } from "@/lib/finbert";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, news } = body;

    if (!ticker || !news || !Array.isArray(news)) {
      return NextResponse.json(
        { success: false, error: "Ticker and news array are required" },
        { status: 400 }
      );
    }

    const headlines = news.map((item: any) => item.headline);
    const sentiments = await analyzeBulkSentiment(headlines);
    
    let totalScore = 0;
    let bullishCount = 0;
    let bearishCount = 0;

    const articles = news.map((item: any, index: number) => {
      const sentimentResult = sentiments[index];
      const label = sentimentResult ? mapToDisplayLabel(sentimentResult.label) : 'neutral';
      const score = sentimentResult ? Math.round(sentimentResult.score * 100) : 50;
      
      totalScore += score;
      if (label === 'bullish') bullishCount++;
      if (label === 'bearish') bearishCount++;

      return {
        ...item,
        sentiment: label,
        score: score
      };
    });

    const averageScore = headlines.length > 0 ? Math.round(totalScore / headlines.length) : 50;
    let sentimentType = 'neutral';
    if (bullishCount > bearishCount) sentimentType = 'bullish';
    if (bearishCount > bullishCount) sentimentType = 'bearish';

    // Generate Deep AI Insights
    let aiInsights = {
      summary: "Mixed signals in recent headlines with no clear directional consensus.",
      topBuzzwords: ["VOLATILITY", "WAIT-AND-SEE", "EARNINGS"],
      bullishKeyDrivers: ["Positive broader market momentum"],
      bearishKeyDrivers: ["Macroeconomic headwinds"],
      analystOpinion: "Wait for clearer signals before establishing a new position.",
      tomorrowOutlook: "Uncertain"
    };

    try {
      const prompt = `
        Analyze the following recent news headlines for the stock ${ticker}:
        ${headlines.slice(0, 15).join("\n")}
        
        Provide a JSON response with exactly these keys:
        - "summary": A 1-2 sentence punchy summary of the overarching narrative.
        - "topBuzzwords": An array of 3-4 trending buzzwords (e.g. ["RATES", "GROWTH", "AI"]).
        - "bullishKeyDrivers": An array of 2-3 specific bullish drivers based on the news.
        - "bearishKeyDrivers": An array of 2-3 specific bearish risks or drivers based on the news.
        - "analystOpinion": A 1 sentence professional trading desk opinion.
        - "tomorrowOutlook": A short 1-3 word prediction for tomorrow (e.g. "Slightly Bullish", "High Volatility", "Neutral").
      `;
      const aiResponse = await callGroq(prompt, 800);
      if (aiResponse) {
        aiInsights = { ...aiInsights, ...aiResponse };
      }
    } catch (e) {
      console.warn("Groq sentiment insight generation failed:", e);
    }

    const data = {
      articles,
      overallSentiment: sentimentType,
      sentimentType,
      overallScore: averageScore,
      ...aiInsights
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Sentiment Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI sentiment analysis" },
      { status: 500 }
    );
  }
}
