"use client";

import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent, cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

interface IndexData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export function KPICards({ data, isLoading }: { data: IndexData[]; isLoading: boolean }) {
  if (isLoading && (!data || data.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[130px] w-full rounded-[16px]" />
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

  const getVixLabel = (price: number) => {
    if (price < 15) return { text: "LOW VOLATILITY", color: "text-[#00d084]", bg: "bg-[rgba(0,208,132,0.12)]" };
    if (price <= 25) return { text: "MODERATE", color: "text-[#f59e0b]", bg: "bg-[rgba(245,158,11,0.12)]" };
    return { text: "HIGH FEAR", color: "text-[#ef4444]", bg: "bg-[rgba(239,68,68,0.12)]" };
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cardsToDisplay.slice(0, 4).map((item_data, index) => {
        const isVix = item_data.symbol.includes("VIX");
        const isAi = item_data.symbol.includes("AI");
        const isPositive = item_data.change >= 0;
        const vixLabel = isVix ? getVixLabel(item_data.price) : null;

        return (
          <motion.div
            key={item_data.symbol}
            variants={item}
            className={cn(
              "relative overflow-hidden rounded-[16px] border p-5 transition-all duration-200 font-sans",
              isAi
                ? "border-l-[3px] border-l-[#a78bfa] border-y border-r border-[var(--border)] hover:border-[var(--border-emphasis)]"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-emphasis)] hover:shadow-[0_4px_32px_rgba(0,0,0,0.2)]"
            )}
            style={isAi ? { background: `linear-gradient(to right, rgba(167,139,250,0.02), var(--card))` } : { background: 'var(--card)' }}
          >
            {/* Header: Label + Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
                {isAi ? "AI MARKET BIAS" : item_data.symbol.replace("^", "")}
                {!isAi && !isVix && " · LIVE"}
              </span>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  isAi
                    ? "bg-[rgba(167,139,250,0.10)] text-[#a78bfa]"
                    : isVix
                    ? "bg-[rgba(245,158,11,0.10)] text-[#f59e0b]"
                    : isPositive
                    ? "bg-[rgba(0,208,132,0.10)] text-[#00d084]"
                    : "bg-[rgba(239,68,68,0.10)] text-[#ef4444]"
                )}
              >
                {isAi ? (
                  <Zap className="h-4 w-4" />
                ) : isVix ? (
                  <Activity className="h-4 w-4" />
                ) : isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Value */}
            <div className="mb-2">
              {isAi ? (
                <span className="font-bebas text-[32px] tracking-wide text-[#00d084] uppercase leading-none">
                  BULLISH
                </span>
              ) : (
                <span className="font-mono text-[24px] font-medium tracking-tight text-[var(--foreground)] leading-none">
                  {typeof item_data.price === "number"
                    ? item_data.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : item_data.price}
                </span>
              )}
            </div>

            {/* Badge / Sub-info */}
            <div className="flex items-center gap-2">
              {isAi ? (
                <>
                  <div className="flex-1">
                    <div className="h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00d084] rounded-full transition-all duration-1000" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-medium text-[#00d084]">78%</span>
                </>
              ) : isVix && vixLabel ? (
                <>
                  <span className={cn("inline-flex items-center rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-medium", vixLabel.bg, vixLabel.color)}>
                    {vixLabel.text}
                  </span>
                </>
              ) : isPositive ? (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[rgba(0,208,132,0.12)] border border-[rgba(0,208,132,0.20)] px-2 py-0.5 font-mono text-[12px] font-medium text-[#00d084]">
                  ▲ +{formatPercent(Math.abs(item_data.changePercent))}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.20)] px-2 py-0.5 font-mono text-[12px] font-medium text-[#ef4444]">
                  ▼ {formatPercent(item_data.changePercent)}
                </span>
              )}
              {!isAi && !isVix && (
                <span className="font-sans text-[11px] text-[var(--foreground-muted)]">vs yesterday&apos;s close</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
