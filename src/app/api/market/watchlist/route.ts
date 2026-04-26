import { NextRequest, NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get("tickers");

  if (!tickers) {
    return NextResponse.json({ success: true, data: [] });
  }

  const tickerList = tickers.split(",");

  try {
    const results = await Promise.all(
      tickerList.map(async (ticker) => {
        const data = await finnhubApi.getQuote(ticker);
        return {
          symbol: ticker,
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          high: data.h,
          low: data.l,
          volume: data.v || 0,
        };
      })
    );

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching watchlist data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch watchlist quote data" },
      { status: 500 }
    );
  }
}
