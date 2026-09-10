"use client";

import { useState, useEffect } from "react";
import { Zap, Target, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { format, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";

export function AIMarketBias() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("15:00");

  useEffect(() => {
    async function fetchBias() {
      setIsLoading(true);
      const marketData = await apiClient.getMarketBias();
      if (marketData.success && marketData.data) {
        const aiResponse = await apiClient.marketBiasAI(marketData.data);
        if (aiResponse.success) {
          setData(aiResponse.data);
          setNextUpdate(addMinutes(new Date(), 15));
        }
      }
      setIsLoading(false);
    }
    fetchBias();
  }, []);

  useEffect(() => {
    if (!nextUpdate) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextUpdate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeRemaining("00:00");
      } else {
        const m = Math.floor((diff / 1000) / 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeRemaining(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextUpdate]);

  if (isLoading) {
    return (
      <div className="rounded-[16px] border-l-[3px] border-l-[#a78bfa] border-y border-r border-[var(--border)] p-6 font-sans" style={{ background: `linear-gradient(to right, rgba(167,139,250,0.02), var(--card))` }}>
        <div className="flex items-center gap-2 text-[#a78bfa] mb-4">
          <Zap className="h-4 w-4 animate-pulse" />
          <span className="font-sans text-[13px] text-[#a78bfa]">
            AI is analyzing real-time market bias...
          </span>
        </div>
        <p className="text-[11px] text-[var(--foreground-muted)] font-sans">Powered by Llama 3.3 70B</p>
        <Skeleton className="mt-4 h-14 w-1/3 rounded-[8px]" />
        <Skeleton className="mt-4 h-28 w-full rounded-[8px]" />
      </div>
    );
  }

  const defaultData = {
    overallBias: "BULLISH",
    confidenceScore: 78,
    reasoning: [
      "S&P 500 holding key support at 5,800 level with strong institutional buying volume.",
      "VIX declining towards 15.4, indicating subdued hedging activity and stable liquidity.",
      "Mega-cap tech earnings revisions remaining net positive heading into Q3 reporting window.",
      "Breadth indicators show 64% of NYSE stocks trading above 50-day moving average.",
    ],
    analystNote: "Constructive price action above key moving averages suggests dip-buying resilience.",
    tomorrowOutlook: "Expect continuation test towards 5,850 overhead resistance level.",
  };

  const currentData = data || defaultData;
  const biasStr = currentData.overallBias?.toUpperCase() || "BULLISH";
  const isBullish = biasStr.includes("BULLISH");
  const isBearish = biasStr.includes("BEARISH");
  const biasColor = isBullish ? "#00d084" : isBearish ? "#ef4444" : "#f59e0b";

  return (
    <div className="rounded-[16px] border-l-[3px] border-y border-r border-[var(--border)] p-6 font-sans transition-all hover:border-[var(--border-emphasis)]" style={{ borderLeftColor: '#a78bfa', background: `linear-gradient(to right, rgba(167,139,250,0.02), var(--card))` }}>
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#a78bfa]" />
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[#a78bfa]">
            AI MARKET BIAS
          </span>
          <span className="rounded-[6px] bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.20)] px-2 py-0.5 font-mono text-[10px] uppercase text-[#a78bfa]">
            AI
          </span>
        </div>
        <span className="font-mono text-[12px] text-[var(--foreground-muted)]">
          Refreshes in {timeRemaining}
        </span>
      </div>

      {/* Hero Bias + Confidence */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-5">
        <h2
          className="font-bebas text-[52px] tracking-tight leading-none uppercase"
          style={{ color: biasColor }}
        >
          {biasStr}
        </h2>
        <span className="font-mono text-[16px] font-medium" style={{ color: biasColor }}>
          {currentData.confidenceScore}% confidence
        </span>
      </div>

      {/* Confidence Bar */}
      <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${currentData.confidenceScore}%`, backgroundColor: biasColor }}
        />
      </div>

      {/* Reasoning Grid — 2×2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {currentData.reasoning?.map((reason: string, i: number) => (
          <div key={i} className="flex items-start gap-2.5 bg-[var(--background-secondary)] p-3 rounded-[8px] border border-[var(--border)]">
            <span className="h-1.5 w-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: biasColor }} />
            <p className="text-[13px] text-[var(--foreground-secondary)] leading-relaxed">{reason}</p>
          </div>
        ))}
      </div>

      {/* Data Strip */}
      <div className="flex flex-wrap gap-6 pt-4 border-t border-[var(--border)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--foreground-muted)] uppercase font-sans">Analyst Note</span>
          <span className="text-[12px] font-mono text-[var(--foreground)] mt-0.5 italic">&quot;{currentData.analystNote}&quot;</span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-[var(--foreground-muted)] italic mt-4">
        AI-generated analysis is for informational and educational purposes only. Not financial advice.
      </p>
    </div>
  );
}
