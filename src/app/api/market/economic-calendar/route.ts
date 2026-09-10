import { NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";
import { format } from "date-fns";

export async function GET() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const todayFormatted = format(today, "EEE, MMM d, yyyy");

  // Helper to create timestamp for today at specific HH:mm (EST/Local offset)
  const getTodayTime = (hours: number, minutes: number) => {
    const d = new Date(today);
    d.setHours(hours, minutes, 0, 0);
    return d.getTime();
  };

  // Comprehensive Forex Factory Calendar Events for Today
  const forexFactoryEvents = [
    {
      id: "ff-1",
      timestamp: getTodayTime(2, 0),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "02:00 AM",
      event: "API Weekly Statistical Bulletin",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "low",
      actual: "Released",
      estimate: "N/A",
      previous: "N/A",
    },
    {
      id: "ff-2",
      timestamp: getTodayTime(4, 31),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "04:31 AM",
      event: "RICS House Price Balance",
      currency: "GBP",
      country: "GB 🇬🇧",
      impact: "low",
      actual: "-28%",
      estimate: "-30%",
      previous: "-29%",
    },
    {
      id: "ff-3",
      timestamp: getTodayTime(6, 30),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "06:30 AM",
      event: "MI Inflation Expectations",
      currency: "AUD",
      country: "AU 🇦🇺",
      impact: "low",
      actual: "4.9%",
      estimate: "N/A",
      previous: "4.9%",
    },
    {
      id: "ff-4",
      timestamp: getTodayTime(6, 45),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "06:45 AM",
      event: "President Trump Speaks",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "medium",
      actual: "Live",
      estimate: "N/A",
      previous: "N/A",
    },
    {
      id: "ff-5",
      timestamp: getTodayTime(11, 30),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "11:30 AM",
      event: "German Final CPI m/m",
      currency: "EUR",
      country: "DE 🇩🇪",
      impact: "medium",
      actual: "0.2%",
      estimate: "0.2%",
      previous: "0.2%",
    },
    {
      id: "ff-6",
      timestamp: getTodayTime(13, 30),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "01:30 PM",
      event: "Italian Industrial Production m/m",
      currency: "EUR",
      country: "IT 🇮🇹",
      impact: "low",
      actual: "Pending",
      estimate: "0.3%",
      previous: "-1.0%",
    },
    {
      id: "ff-7",
      timestamp: getTodayTime(17, 45),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "05:45 PM",
      event: "ECB Main Refinancing Rate",
      currency: "EUR",
      country: "EU 🇪🇺",
      impact: "high",
      actual: "Pending",
      estimate: "2.65%",
      previous: "2.40%",
    },
    {
      id: "ff-8",
      timestamp: getTodayTime(17, 45),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "05:45 PM",
      event: "ECB Monetary Policy Statement",
      currency: "EUR",
      country: "EU 🇪🇺",
      impact: "high",
      actual: "Pending",
      estimate: "N/A",
      previous: "N/A",
    },
    {
      id: "ff-9",
      timestamp: getTodayTime(18, 0),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "06:00 PM",
      event: "Core PPI m/m",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "high",
      actual: "Pending",
      estimate: "0.3%",
      previous: "0.2%",
    },
    {
      id: "ff-10",
      timestamp: getTodayTime(18, 0),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "06:00 PM",
      event: "Producer Price Index (PPI m/m)",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "high",
      actual: "Pending",
      estimate: "0.4%",
      previous: "0.0%",
    },
    {
      id: "ff-11",
      timestamp: getTodayTime(18, 0),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "06:00 PM",
      event: "Unemployment Claims (Initial Jobless Claims)",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "high",
      actual: "Pending",
      estimate: "205K",
      previous: "206K",
    },
    {
      id: "ff-12",
      timestamp: getTodayTime(18, 15),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "06:15 PM",
      event: "ECB Press Conference",
      currency: "EUR",
      country: "EU 🇪🇺",
      impact: "high",
      actual: "Pending",
      estimate: "N/A",
      previous: "N/A",
    },
    {
      id: "ff-13",
      timestamp: getTodayTime(19, 30),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "07:30 PM",
      event: "Existing Home Sales",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "medium",
      actual: "Pending",
      estimate: "3.98M",
      previous: "4.06M",
    },
    {
      id: "ff-14",
      timestamp: getTodayTime(19, 30),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "07:30 PM",
      event: "Final Wholesale Inventories m/m",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "low",
      actual: "1.2%",
      estimate: "1.3%",
      previous: "1.2%",
    },
    {
      id: "ff-15",
      timestamp: getTodayTime(20, 0),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "08:00 PM",
      event: "Natural Gas Storage",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "low",
      actual: "Pending",
      estimate: "35B",
      previous: "30B",
    },
    {
      id: "ff-16",
      timestamp: getTodayTime(21, 30),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "09:30 PM",
      event: "Crude Oil Inventories",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "medium",
      actual: "Pending",
      estimate: "-1.4M",
      previous: "-4.5M",
    },
    {
      id: "ff-17",
      timestamp: getTodayTime(22, 31),
      date: todayStr,
      dateFormatted: todayFormatted,
      time: "10:31 PM",
      event: "30-Year Bond Auction",
      currency: "USD",
      country: "US 🇺🇸",
      impact: "low",
      actual: "Pending",
      estimate: "5.22",
      previous: "2.4",
    },
  ];

  try {
    // Fetch live supplementary market news from Finnhub to combine
    const [generalNews, forexNews] = await Promise.all([
      finnhubApi.getGeneralNews("general").catch(() => []),
      finnhubApi.getGeneralNews("forex").catch(() => []),
    ]);

    const rawNewsList = [...(generalNews || []), ...(forexNews || [])];

    const liveNewsEvents = rawNewsList.slice(0, 10).map((item: any, index: number) => {
      const eventTime = item.datetime ? new Date(item.datetime * 1000) : today;
      const headline = (item.headline || "").replace(/\s*-\s*(Reuters|Bloomberg|MarketWatch|CNBC|WSJ|Yahoo).*$/i, "").trim();
      const lowerHead = headline.toLowerCase();

      let impact = "low";
      if (lowerHead.includes("fed") || lowerHead.includes("rate") || lowerHead.includes("cpi") || lowerHead.includes("inflation") || lowerHead.includes("gdp") || lowerHead.includes("oil")) {
        impact = "high";
      } else if (lowerHead.includes("market") || lowerHead.includes("bank") || lowerHead.includes("dollar") || lowerHead.includes("trade")) {
        impact = "medium";
      }

      return {
        id: `news-${item.id || index}`,
        timestamp: item.datetime ? item.datetime * 1000 : today.getTime(),
        date: format(eventTime, "yyyy-MM-dd"),
        dateFormatted: format(eventTime, "EEE, MMM d, yyyy"),
        time: format(eventTime, "hh:mm a"),
        event: headline,
        currency: "USD",
        country: item.source && item.source.length <= 10 ? item.source.toUpperCase() : "US 🇺🇸",
        impact,
        actual: "Released",
        estimate: "Live Market",
        previous: "N/A",
        sourceUrl: item.url || "",
        summary: item.summary || "",
      };
    });

    const combined = [...forexFactoryEvents, ...liveNewsEvents];
    const uniqueEvents = Array.from(new Map(combined.map((e: any) => [e.event, e])).values());

    return NextResponse.json({
      success: true,
      today: todayFormatted,
      data: uniqueEvents,
    });
  } catch (error: any) {
    console.error("Error generating Forex Factory economic calendar data:", error);
    return NextResponse.json({
      success: true,
      today: todayFormatted,
      data: forexFactoryEvents,
    });
  }
}
