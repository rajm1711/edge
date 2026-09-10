import { NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";
import { addDays, format, isSameDay, parseISO } from "date-fns";

export async function GET() {
  const today = new Date();
  const from = format(today, "yyyy-MM-dd");
  const to = format(addDays(today, 7), "yyyy-MM-dd");

  try {
    const data = await finnhubApi.getEarningsCalendar(from, to);
    const rawList = data.earningsCalendar || [];

    const transformedData = rawList.map((item: any) => {
      let isToday = false;
      let displayDate = item.date;

      try {
        const itemDate = parseISO(item.date);
        isToday = isSameDay(itemDate, today);
        displayDate = isToday ? `TODAY (${format(itemDate, "MMM d")})` : format(itemDate, "EEE, MMM d");
      } catch (e) {
        // fallback
      }

      return {
        ticker: item.symbol,
        companyName: item.name || item.symbol,
        date: item.date,
        displayDate,
        isToday,
        epsEstimate: item.epsEstimate,
        revenueEstimate: item.revenueEstimate,
        hour: item.hour ? item.hour.toUpperCase() : "TBD", // AMC, BMO, etc.
      };
    });

    // Sort today's earnings to the top, then by date
    transformedData.sort((a: any, b: any) => {
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;
      return a.date.localeCompare(b.date);
    });

    return NextResponse.json({ success: true, today: format(today, "yyyy-MM-dd"), data: transformedData });
  } catch (error) {
    console.error("Error fetching earnings calendar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch earnings calendar" },
      { status: 500 }
    );
  }
}
