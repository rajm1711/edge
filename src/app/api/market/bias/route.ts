import { NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";

export async function GET() {
  try {
    // Fetch market news and indices in parallel
    const [news, spy, vix, nasdaq] = await Promise.all([
      finnhubApi.getGeneralNews("general"),
      finnhubApi.getQuote("^GSPC"),
      finnhubApi.getQuote("^VIX"),
      finnhubApi.getQuote("^IXIC"),
    ]);

    const transformedData = {
      vix: vix.c,
      spChange: spy.dp,
      nasdaqChange: nasdaq.dp,
      topHeadlines: (news || []).slice(0, 20).map((n: any) => n.headline),
    };

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error("Error fetching market bias data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch market bias data" },
      { status: 500 }
    );
  }
}
