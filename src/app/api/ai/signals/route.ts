import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, price, fundamentals } = body;

    if (!ticker || !price) {
      return NextResponse.json(
        { success: false, error: "Ticker and price are required" },
        { status: 400 }
      );
    }

    const prompt = `For ${ticker} at $${price} with these fundamentals: ${JSON.stringify(fundamentals)},
identify 6 technical analysis signals or patterns relevant right now.
Return only valid JSON array where each item has:
signalName (string), type (bullish/bearish/neutral),
description (string, 1 clear sentence),
strength (weak/moderate/strong),
timeframe (intraday/swing/positional),
actionableInsight (string, 1 sentence of what an analyst should watch for).`;

    const data = await callGroq(prompt);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI Signals Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI signals" },
      { status: 500 }
    );
  }
}
