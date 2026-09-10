"use client";

import { useState, useMemo } from "react";
import { ArrowDown, ArrowUp, Layers, RefreshCw } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface OrderBookDepthProps {
  currentPrice?: number;
  ticker?: string;
}

export function OrderBookDepth({ currentPrice = 138.25, ticker = "NVDA" }: OrderBookDepthProps) {
  const [precision, setPrecision] = useState<0.01 | 0.1 | 1>(0.01);

  // Generate dynamic mock Order Book levels
  const { asks, bids, spread, spreadPercent, bidRatio, askRatio } = useMemo(() => {
    const askRows = [];
    const bidRows = [];

    let totalAskVol = 0;
    let totalBidVol = 0;

    // Generate 6 Ask levels (Selling above market)
    for (let i = 6; i >= 1; i--) {
      const price = currentPrice + i * (precision * 5);
      const size = Math.floor(Math.random() * 450) + 50;
      totalAskVol += size;
      askRows.push({
        price: Number(price.toFixed(2)),
        size,
        total: totalAskVol,
        depthPct: 0
      });
    }

    // Generate 6 Bid levels (Buying below market)
    for (let i = 1; i <= 6; i++) {
      const price = currentPrice - i * (precision * 5);
      const size = Math.floor(Math.random() * 450) + 50;
      totalBidVol += size;
      bidRows.push({
        price: Number(price.toFixed(2)),
        size,
        total: totalBidVol,
        depthPct: 0
      });
    }

    const maxAskTotal = Math.max(...askRows.map(r => r.total));
    const maxBidTotal = Math.max(...bidRows.map(r => r.total));

    askRows.forEach(r => (r.depthPct = (r.total / maxAskTotal) * 100));
    bidRows.forEach(r => (r.depthPct = (r.total / maxBidTotal) * 100));

    const bestAsk = askRows[askRows.length - 1].price;
    const bestBid = bidRows[0].price;
    const spreadVal = Number((bestAsk - bestBid).toFixed(2));
    const spreadPct = Number(((spreadVal / currentPrice) * 100).toFixed(3));

    const totalVol = totalAskVol + totalBidVol;
    const bidR = Math.round((totalBidVol / totalVol) * 100);
    const askR = 100 - bidR;

    return {
      asks: askRows,
      bids: bidRows,
      spread: spreadVal,
      spreadPercent: spreadPct,
      bidRatio: bidR,
      askRatio: askR
    };
  }, [currentPrice, precision]);

  return (
    <div className="w-full rounded-2xl border border-[#1a2540] bg-[#0d1421]/95 backdrop-blur-md overflow-hidden flex flex-col font-mono text-xs tabular-nums shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-[#1a2540] bg-[#090f19]">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#00d084]" />
          <span className="font-bebas text-lg tracking-wide uppercase text-text-primary">Order Book Depth</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-[#4a5568] uppercase font-bold">Tick Size</span>
          <div className="flex bg-bg-primary rounded p-0.5 border border-border">
            {([0.01, 0.1, 1] as const).map(p => (
              <button
                key={p}
                onClick={() => setPrecision(p)}
                className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold transition-all", precision === p ? "bg-[#00d084] text-black" : "text-text-muted")}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buy/Sell Pressure Ratio Meter */}
      <div className="px-3.5 py-2 border-b border-[#1a2540] bg-[#070b12]">
        <div className="flex justify-between items-center text-[10px] font-bold mb-1">
          <span className="text-[#00d084] flex items-center gap-1">
            <ArrowUp className="h-3 w-3" /> Bids {bidRatio}%
          </span>
          <span className="text-[#ff4d4d] flex items-center gap-1">
            Asks {askRatio}% <ArrowDown className="h-3 w-3" />
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#1a2540] rounded-full overflow-hidden flex">
          <div className="h-full bg-[#00d084] transition-all duration-500" style={{ width: `${bidRatio}%` }} />
          <div className="h-full bg-[#ff4d4d] transition-all duration-500" style={{ width: `${askRatio}%` }} />
        </div>
      </div>

      {/* Columns Header */}
      <div className="grid grid-cols-3 px-3.5 py-1.5 text-[10px] font-bold text-[#4a5568] uppercase border-b border-[#1a2540] bg-[#060a10]">
        <span>Price (USD)</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks Section (Red - Selling orders) */}
      <div className="flex flex-col space-y-0.5 py-1 bg-[#0a0f18]/40">
        {asks.map((row, i) => (
          <div key={i} className="relative grid grid-cols-3 px-3.5 py-0.5 text-[11px] items-center hover:bg-white/5 transition-colors">
            {/* Red Depth Fill Bar */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#ff4d4d]/15 pointer-events-none transition-all duration-300"
              style={{ width: `${row.depthPct}%` }}
            />
            <span className="font-bold text-[#ff4d4d] relative z-10">{row.price.toFixed(2)}</span>
            <span className="text-right text-text-secondary relative z-10">{row.size.toLocaleString()}</span>
            <span className="text-right text-text-muted relative z-10">{row.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Current Spread Ticker Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 my-0.5 bg-[#090f19] border-y border-[#1a2540]">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-text-primary">{formatCurrency(currentPrice)}</span>
          <span className="text-[10px] text-[#00d084] font-bold uppercase tracking-wider">● LIVE</span>
        </div>
        <div className="text-[10px] text-text-muted font-bold">
          Spread: <span className="text-text-primary">{spread}</span> ({spreadPercent}%)
        </div>
      </div>

      {/* Bids Section (Green - Buying orders) */}
      <div className="flex flex-col space-y-0.5 py-1 bg-[#0a0f18]/40">
        {bids.map((row, i) => (
          <div key={i} className="relative grid grid-cols-3 px-3.5 py-0.5 text-[11px] items-center hover:bg-white/5 transition-colors">
            {/* Green Depth Fill Bar */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#00d084]/15 pointer-events-none transition-all duration-300"
              style={{ width: `${row.depthPct}%` }}
            />
            <span className="font-bold text-[#00d084] relative z-10">{row.price.toFixed(2)}</span>
            <span className="text-right text-text-secondary relative z-10">{row.size.toLocaleString()}</span>
            <span className="text-right text-text-muted relative z-10">{row.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
