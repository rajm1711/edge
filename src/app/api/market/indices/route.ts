import { NextResponse } from "next/server";
import { finnhubApi } from "@/lib/finnhub";

const INDEX_TICKERS = ["^GSPC", "^IXIC", "^DJI", "^VIX", "US30=X", "GC=F", "SI=F"];

export async function GET() {
  try {
    const results = await Promise.all(
      INDEX_TICKERS.map(async (ticker) => {
        try {
          // Use Yahoo Finance for indices since Finnhub free tier doesn't support real index prices
          const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            next: { revalidate: 30 }
          });

          if (!response.ok) {
            console.error(`HTTP error for ${ticker}: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch ${ticker}: ${response.status}`);
          }

          const data = await response.json();
          
          if (!data.chart?.result?.[0]) {
            console.error(`Invalid data structure for ${ticker}:`, JSON.stringify(data));
            throw new Error(`Invalid data structure for ${ticker}`);
          }
          
          const meta = data.chart.result[0].meta;

          if (!meta) {
            console.error(`Missing meta data for ${ticker}`);
            throw new Error(`Invalid data format for ${ticker}`);
          }

          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose;
          const change = price - prevClose;
          const changePercent = (change / prevClose) * 100;

          // Map ticker symbols to display names
          const symbolMap: { [key: string]: string } = {
            "^GSPC": "S&P 500",
            "^IXIC": "NASDAQ",
            "^DJI": "DOW JONES",
            "^VIX": "VIX",
            "US30=X": "US30",
            "GC=F": "GOLD",
            "SI=F": "SILVER"
          };

          return {
            symbol: symbolMap[ticker] || ticker,
            price: price,
            change: change,
            changePercent: changePercent,
          };
        } catch (error) {
          console.error(`Error fetching ${ticker}:`, error);
          // Return null for failed requests, filter them out later
          return null;
        }
      })
    );

    // Filter out null results (failed requests)
    const validResults = results.filter(result => result !== null);

    return NextResponse.json({ success: true, data: validResults });
  } catch (error) {
    console.error("Error fetching market indices:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch market indices" },
      { status: 500 }
    );
  }
}
