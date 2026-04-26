import { NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";
import { addDays, format } from "date-fns";

export async function GET() {
  const from = format(new Date(), "yyyy-MM-dd");
  const to = format(addDays(new Date(), 7), "yyyy-MM-dd");

  try {
    const data = await finnhubApi.getEarningsCalendar(from, to);
    
    const transformedData = (data.earningsCalendar || []).map((item: any) => ({
      ticker: item.symbol,
      companyName: item.name,
      date: item.date,
      epsEstimate: item.epsEstimate,
      revenueEstimate: item.revenueEstimate,
      hour: item.hour, // amc, bmo, etc.
    }));

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error("Error fetching earnings calendar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch earnings calendar" },
      { status: 500 }
    );
  }
}
