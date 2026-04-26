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
    const data = await finnhubApi.getMetrics(ticker);
    const metric = data.metric || {};
    
    const transformedData = {
      peRatio: metric.peBasicExclExtraTTM || metric.peInclExtraTTM,
      eps: metric.epsExclExtraItemsTTM || metric.epsInclExtraItemsTTM,
      "52WeekHigh": metric["52WeekHigh"],
      "52WeekLow": metric["52WeekLow"],
      beta: metric.beta,
      dividendYield: metric.dividendYield5Y || metric.dividendYieldIndicatedAnnual,
      marketCap: metric.marketCapitalization,
      revenueGrowth: metric.revenueGrowthTTM,
      profitMargin: metric.netProfitMarginTTM,
    };

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error(`Error fetching fundamentals for ${ticker}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stock fundamentals" },
      { status: 500 }
    );
  }
}
