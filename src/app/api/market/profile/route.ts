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
    const data = await finnhubApi.getProfile(ticker);
    
    const transformedData = {
      companyName: data.name,
      sector: data.finnhubIndustry,
      industry: data.finnhubIndustry,
      logo: data.logo,
      weburl: data.weburl,
      country: data.country,
      currency: data.currency,
      exchange: data.exchange,
      shareOutstanding: data.shareOutstanding,
    };

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error(`Error fetching profile for ${ticker}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company profile" },
      { status: 500 }
    );
  }
}
