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
    const data = await finnhubApi.getQuote(ticker);
    
    // Transform Finnhub fields to more readable names
    const transformedData = {
      currentPrice: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      volume: data.v || 0,
      timestamp: data.t,
    };

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error(`Error fetching quote for ${ticker}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch market quote" },
      { status: 500 }
    );
  }
}
