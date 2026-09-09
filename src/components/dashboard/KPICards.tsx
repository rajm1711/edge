"use client";

import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent, cn } from "@/lib/utils";

interface IndexData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function KPICards({ data, isLoading }: { data: IndexData[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-[12px]" />
        ))}
      </div>
    );
  }

  const defaultCards: IndexData[] = [
    { symbol: "S&P 500", price: 5812.40, change: 12.30, changePercent: 0.21 },
    { symbol: "NASDAQ", price: 18415.20, change: -45.10, changePercent: -0.24 },
    { symbol: "VIX INDEX", price: 15.42, change: -0.85, changePercent: -5.22 },
    { symbol: "AI MARKET BIAS", price: 78, change: 1, changePercent: 1.5 },
  ];

  const cardsToDisplay = data && data.length > 0 ? data : defaultCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsToDisplay.slice(0, 4).map((item, index) => {
        const isVix = item.symbol.includes("VIX");
        const isAi = item.symbol.includes("AI");
        const isPositive = item.change >= 0;

        return (
          <div
            key={item.symbol}
            style={{ animationDelay: `${index * 80}ms` }}
            className={cn(
              "relative overflow-hidden rounded-[12px] border border-border bg-bg-card p-[20px] transition-all duration-150 hover:border-border-emphasis hover:bg-bg-hover font-sans animate-in fade-in slide-in-from-bottom-2",
              isAi && "border-l-[3px] border-l-ai-purple bg-ai-purple-dim"
            )}
          >
            {/* Header: Label Left, 32px Circle Icon Right */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
                {item.symbol.replace("^", "")}
              </span>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  isAi
                    ? "bg-[rgba(167,139,250,0.10)] text-ai-purple"
                    : isVix
                    ? "bg-[rgba(245,166,35,0.10)] text-neutral"
                    : isPositive
                    ? "bg-[rgba(0,208,132,0.10)] text-positive"
                    : "bg-[rgba(255,77,77,0.10)] text-negative"
                )}
              >
                {isAi ? (
                  <Zap className="h-[15px] w-[15px]" />
                ) : isVix ? (
                  <Activity className="h-[15px] w-[15px]" />
                ) : isPositive ? (
                  <TrendingUp className="h-[15px] w-[15px]" />
                ) : (
                  <TrendingDown className="h-[15px] w-[15px]" />
                )}
              </div>
            </div>

            {/* Price / Big KPI Value (JetBrains Mono 28px) */}
            <div className="mb-2">
              {isAi ? (
                <span className="font-bebas text-[28px] tracking-wide text-positive uppercase leading-none">
                  BULLISH (78%)
                </span>
              ) : (
                <span className="font-mono text-[28px] font-medium tracking-tight text-text-primary leading-none">
                  {typeof item.price === "number"
                    ? item.price.toLocaleString(undefined, {
                        minimumFractionDigits: isVix ? 2 : 2,
                        maximumFractionDigits: isVix ? 2 : 2,
                      })
                    : item.price}
                </span>
              )}
            </div>

            {/* Inline Change Badge */}
            <div className="flex items-center gap-2">
              {isAi ? (
                <span className="inline-flex items-center rounded-[4px] bg-[rgba(167,139,250,0.10)] px-2 py-0.5 font-mono text-[11px] font-medium text-ai-purple">
                  MODERATE CONFIDENCE
                </span>
              ) : isPositive ? (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[rgba(0,208,132,0.10)] px-2 py-0.5 font-mono text-[12px] font-medium text-positive">
                  ▲ +{formatPercent(Math.abs(item.changePercent))}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[rgba(255,77,77,0.10)] px-2 py-0.5 font-mono text-[12px] font-medium text-negative">
                  ▼ {formatPercent(item.changePercent)}
                </span>
              )}
              {!isAi && (
                <span className="font-sans text-[11px] text-text-muted">Today</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

