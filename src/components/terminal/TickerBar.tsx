"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { cn, formatPercent } from "@/lib/utils";

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function TickerBar() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 25000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    const res = await apiClient.getIndices();
    if (res.success && res.data && res.data.length > 0) {
      setItems(res.data);
    } else {
      setItems([
        { symbol: "NIFTY", name: "NIFTY 50", price: 24850.15, change: 142.3, changePercent: 0.58 },
        { symbol: "S&P500", name: "S&P 500", price: 5812.40, change: 12.3, changePercent: 0.21 },
        { symbol: "NASDAQ", name: "NASDAQ", price: 18415.20, change: -45.1, changePercent: -0.24 },
        { symbol: "BTC/USD", name: "Bitcoin", price: 68420.00, change: 1450.0, changePercent: 2.16 },
        { symbol: "NVDA", name: "Nvidia", price: 138.25, change: 3.45, changePercent: 2.56 },
        { symbol: "AAPL", name: "Apple", price: 228.50, change: -1.20, changePercent: -0.52 },
        { symbol: "TSLA", name: "Tesla", price: 218.80, change: 4.80, changePercent: 2.24 },
        { symbol: "GOLD", name: "Gold Spot", price: 2742.10, change: 8.40, changePercent: 0.31 }
      ]);
    }
  }

  const list = items.length > 0 ? items : [
    { symbol: "NIFTY", name: "NIFTY 50", price: 24850.15, change: 142.3, changePercent: 0.58 },
    { symbol: "S&P500", name: "S&P 500", price: 5812.40, change: 12.3, changePercent: 0.21 },
    { symbol: "NASDAQ", name: "NASDAQ", price: 18415.20, change: -45.1, changePercent: -0.24 },
    { symbol: "BTC/USD", name: "Bitcoin", price: 68420.00, change: 1450.0, changePercent: 2.16 },
    { symbol: "NVDA", name: "Nvidia", price: 138.25, change: 3.45, changePercent: 2.56 }
  ];

  return (
    <div className="flex h-[36px] w-full items-center overflow-hidden bg-[var(--sidebar)] border-b border-[var(--border)] font-mono text-xs tabular-nums select-none">
      <div className="flex items-center gap-2 px-4 border-r border-[var(--border)] text-[10px] font-medium text-[#00d084] uppercase tracking-wider shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d084] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00d084]" />
        </span>
        LIVE
      </div>

      <div className="flex animate-marquee whitespace-nowrap gap-0 py-1 items-center">
        {list.concat(list).map((item, i) => {
          const isPos = item.change >= 0;
          return (
            <div key={i} className="flex items-center gap-2 text-[11px] hover:opacity-80 cursor-pointer transition-opacity px-3">
              <span className="text-[11px] text-[#475569] uppercase font-sans font-medium">
                {item.symbol.replace("^", "")}
              </span>
              <span className="text-[#e2e8f0] font-medium font-mono text-[12px]">
                {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={cn(
                "font-medium text-[11px] font-mono",
                isPos ? "text-[#00d084]" : "text-[#ef4444]"
              )}>
                {isPos ? "+" : ""}{formatPercent(item.changePercent)}
              </span>
              <span className="text-[#334155] ml-1">·</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
