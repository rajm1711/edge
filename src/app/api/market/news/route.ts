import { NextRequest, NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";
import { subDays, format } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json(
      { success: false, error: "Ticker symbol is required" },
      { status: 400 }
    );
  }

  const to = format(new Date(), "yyyy-MM-dd");
  const from = format(subDays(new Date(), 7), "yyyy-MM-dd");

  try {
    const data = await finnhubApi.getCompanyNews(ticker, from, to);
    
    // Transform Finnhub fields
    const transformedData = (data || []).map((item: any) => ({
      headline: item.headline,
      source: item.source,
      datetime: item.datetime,
      url: item.url,
      summary: item.summary,
      image: item.image,
      id: item.id,
    }));

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error(`Error fetching news for ${ticker}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company news" },
      { status: 500 }
    );
  }
}
