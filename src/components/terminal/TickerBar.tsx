"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
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
    <div className="flex h-[36px] w-full items-center overflow-hidden bg-[#040810] border-b border-[#1a2540] px-4 font-mono text-xs tabular-nums select-none">
      <div className="flex items-center gap-2 pr-4 border-r border-[#1a2540] text-[10px] font-bold text-[#00d084] uppercase tracking-wider shrink-0">
        <span className="h-2 w-2 rounded-full bg-[#00d084] animate-ping" />
        LIVE MARKETS
      </div>

      <div className="flex animate-marquee whitespace-nowrap gap-6 py-1 items-center">
        {list.concat(list).map((item, i) => {
          const isPos = item.change >= 0;
          return (
            <div key={i} className="flex items-center gap-2 text-[11px] hover:opacity-80 cursor-pointer transition-opacity">
              <span className="text-[10px] text-[#64748b] uppercase font-bold tracking-wider">
                {item.symbol.replace("^", "")}
              </span>
              <span className="text-text-primary font-bold">
                {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={cn("font-bold text-[10px] flex items-center gap-0.5 px-1 rounded", isPos ? "text-[#00d084] bg-[#00d084]/10" : "text-[#ff4d4d] bg-[#ff4d4d]/10")}>
                {isPos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {isPos ? "+" : ""}{formatPercent(item.changePercent)}
              </span>
              <span className="text-[#1a2540] ml-1">│</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
