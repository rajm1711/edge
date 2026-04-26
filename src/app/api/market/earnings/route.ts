import { NextRequest, NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json(
      { success: false, error: "Ticker symbol is required" },
      { status: 400 }
    );
  }

  try {
    const data = await finnhubApi.getEarnings(ticker);
    
    const transformedData = (data || []).map((item: any) => ({
      period: item.period,
      actual: item.actual,
      estimate: item.estimate,
      surprise: item.surprise,
      surprisePercent: item.surprisePercent,
      date: item.period, // Finnhub earnings data uses period as date
    }));

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error(`Error fetching earnings for ${ticker}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch earnings data" },
      { status: 500 }
    );
  }
}
