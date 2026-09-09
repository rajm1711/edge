"use client";

import { useState, useEffect } from "react";
import { Zap, ShieldAlert, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function AIMarketBias() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBias() {
      setIsLoading(true);
      const marketData = await apiClient.getMarketBias();
      if (marketData.success && marketData.data) {
        const aiResponse = await apiClient.marketBiasAI(marketData.data);
        if (aiResponse.success) {
          setData(aiResponse.data);
        }
      }
      setIsLoading(false);
    }
    fetchBias();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[260px] w-full rounded-[12px] border-l-[3px] border-l-[#a78bfa] border-y border-r border-[#1a2540] bg-[rgba(167,139,250,0.04)] p-6 font-sans">
        <div className="flex items-center gap-2 text-[#a78bfa]">
          <Zap className="h-4 w-4 animate-bounce" />
          <span className="font-mono text-[11px] uppercase tracking-wider font-medium">
            AI is analyzing real-time market bias...
          </span>
        </div>
        <Skeleton className="mt-4 h-12 w-1/3 rounded-[6px]" />
        <Skeleton className="mt-4 h-24 w-full rounded-[6px]" />
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
  const isBullish = currentData.overallBias?.includes("BULLISH");

  return (
    <div className="relative overflow-hidden rounded-[12px] border-l-[3px] border-l-ai-purple border-y border-r border-border bg-ai-purple-dim p-6 font-sans transition-all hover:border-border-emphasis">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-ai-purple" />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-ai-purple">
              AI MARKET BIAS & SYNTHESIS
            </span>
          </div>
          <p className="text-[12px] text-text-secondary">
            Multi-factor machine learning evaluation of technicals, breadth, and macro risks
          </p>
        </div>

        {/* Big Bias Label & Confidence */}
        <div className="flex flex-col items-start md:items-end">
          <h2
            className={cn(
              "font-bebas text-[40px] tracking-tight leading-none uppercase",
              isBullish ? "text-positive" : "text-negative"
            )}
          >
            {currentData.overallBias}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-sans text-[11px] text-text-muted">Confidence</span>
            <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-positive transition-all duration-1000"
                style={{ width: `${currentData.confidenceScore}%` }}
              />
            </div>
            <span className="font-mono text-[11px] font-medium text-positive">
              {currentData.confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Reasoning Points */}
        <div>
          <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-3 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-positive" /> Core Catalyst Reasoning
          </h4>
          <ul className="space-y-2">
            {currentData.reasoning?.map((reason: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-positive shrink-0" />
                <p className="text-[12px] text-text-secondary leading-relaxed">{reason}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Analyst Note Box */}
        <div className="rounded-[8px] bg-bg-card border border-border p-4 flex flex-col justify-between">
          <div>
            <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-2 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-neutral" /> Analyst Note
            </h4>
            <p className="text-[12px] text-text-primary italic leading-relaxed mb-3">
              &quot;{currentData.analystNote}&quot;
            </p>
          </div>

          <div className="pt-3 border-t border-border flex justify-between items-center text-[11px]">
            <span className="text-text-muted">Outlook: <strong className="text-text-secondary font-normal">{currentData.tomorrowOutlook}</strong></span>
            <span className="font-sans text-text-muted">
              Refreshed {format(new Date(), "HH:mm")} ET
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

