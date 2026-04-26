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
    const data = await finnhubApi.getInsiders(ticker);
    
    const transformedData = (data.data || []).map((item: any) => ({
      name: item.name,
      transactionType: item.transactionCode,
      share: item.share,
      transactionPrice: item.transactionPrice,
      date: item.transactionDate,
      filingDate: item.filingDate,
    }));

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error(`Error fetching insiders for ${ticker}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch insider transactions" },
      { status: 500 }
    );
  }
}
