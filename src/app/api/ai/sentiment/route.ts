import { NextRequest, NextResponse } from "next/server";
import { analyzeBulkSentiment } from "@/lib/finbert";
import { callGroq, sanitizePromptContext } from "@/lib/groq";
import { z } from "zod";

const sentimentInputSchema = z.object({
  ticker: z.string().trim().min(1).max(10).transform((val) => val.toUpperCase()),
  news: z.array(z.any()).min(1),
});

const sentimentOutputSchema = z.object({
  summary: z.string().default("Recent news indicates mixed market signals."),
  topBuzzwords: z.array(z.string()).default([]),
  bullishKeyDrivers: z.array(z.string()).default([]),
  bearishKeyDrivers: z.array(z.string()).default([]),
  analystOpinion: z.string().default("Evaluate broader market context before taking position."),
  tomorrowOutlook: z.string().default("Neutral"),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsedInput = sentimentInputSchema.safeParse(rawBody);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid sentiment analysis parameters",
          details: parsedInput.error.format(),
        },
        { status: 400 }
      );
    }

    const { ticker, news } = parsedInput.data;
    const headlines = news.map((item: any) => item.headline || "").filter(Boolean);

    const sentiments = await analyzeBulkSentiment(headlines, 8);

    let totalScore = 0;
    let bullishCount = 0;
    let bearishCount = 0;
    let validCount = 0;

    const articles = news.map((item: any, index: number) => {
      const result = sentiments[index];
      const label = result?.label || "neutral";
      const score = result ? Math.round(result.score * 100) : 50;

      if (result && result.status === "ok") {
        totalScore += score;
        validCount++;
        if (label === "bullish") bullishCount++;
        if (label === "bearish") bearishCount++;
      }

      return {
        ...item,
        sentiment: label,
        score: score,
        status: result?.status || "unavailable",
      };
    });

    const averageScore = validCount > 0 ? Math.round(totalScore / validCount) : 50;
    let sentimentType = "neutral";
    if (bullishCount > bearishCount) sentimentType = "bullish";
    if (bearishCount > bullishCount) sentimentType = "bearish";

    // Generate LLM Insights
    let aiInsights = {
      summary: "Mixed signals in recent headlines with no clear directional consensus.",
      topBuzzwords: ["VOLATILITY", "EARNINGS", "GROWTH"],
      bullishKeyDrivers: ["Broader sector momentum"],
      bearishKeyDrivers: ["Macroeconomic interest rate concerns"],
      analystOpinion: "Wait for clearer price confirmation before establishing a new position.",
      tomorrowOutlook: "Neutral",
    };

    try {
      const safeHeadlines = sanitizePromptContext(headlines.slice(0, 10).join("\n"));
      const prompt = `Analyze the following news headlines for stock ${ticker}:
${safeHeadlines}

Provide a qualitative summary of the market narrative.
Return only valid JSON with these exact fields:
- "summary": string (1-2 sentence summary of overarching narrative)
- "topBuzzwords": array of 3-4 trending financial buzzwords
- "bullishKeyDrivers": array of 2-3 specific bullish catalysts from news
- "bearishKeyDrivers": array of 2-3 specific bearish risks from news
- "analystOpinion": string (1 sentence objective analysis note)
- "tomorrowOutlook": string (1-3 word prediction, e.g. "Slightly Bullish", "High Volatility", "Neutral")`;

      const aiResponse = await callGroq(prompt, {
        schema: sentimentOutputSchema,
        maxTokens: 800,
        temperature: 0.3,
      });

      if (aiResponse) {
        aiInsights = { ...aiInsights, ...aiResponse };
      }
    } catch (e) {
      console.warn("Groq sentiment narrative synthesis warning:", e);
    }

    const data = {
      articles,
      overallSentiment: sentimentType,
      sentimentType,
      overallScore: averageScore,
      ...aiInsights,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Sentiment Endpoint Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate AI sentiment analysis" },
      { status: 500 }
    );
  }
}
