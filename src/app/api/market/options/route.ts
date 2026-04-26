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
    const data = await finnhubApi.getOptions(ticker);
    
    // Transform Finnhub fields
    const transformedData = {
      expirationDates: data.lastTradeDate || [], // Finnhub option chain has varied fields
      calls: (data.data || [])
        .filter((opt: any) => opt.optionType === "call")
        .map((opt: any) => ({
          strike: opt.strike,
          lastPrice: opt.lastPrice,
          volume: opt.volume,
          openInterest: opt.openInterest,
          impliedVolatility: opt.impliedVolatility,
          inTheMoney: opt.inTheMoney,
        })),
      puts: (data.data || [])
        .filter((opt: any) => opt.optionType === "put")
        .map((opt: any) => ({
          strike: opt.strike,
          lastPrice: opt.lastPrice,
          volume: opt.volume,
          openInterest: opt.openInterest,
          impliedVolatility: opt.impliedVolatility,
          inTheMoney: opt.inTheMoney,
        })),
    };

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error(`Error fetching options for ${ticker}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch options chain" },
      { status: 500 }
    );
  }
}
