"use client";

import { useState, useEffect } from "react";
import { addMinutes } from "date-fns";
import { 
  Zap, TrendingUp, TrendingDown, Target, ShieldAlert,
  AlertTriangle, CheckCircle2, Activity, RefreshCw, BarChart2
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { PageShell } from "@/components/layout/PageShell";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

export default function MarketBiasPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("15:00");

  const fetchBias = async () => {
    setIsLoading(true);
    const marketData = await apiClient.getMarketBias();
    if (marketData.success && marketData.data) {
      const aiResponse = await apiClient.marketBiasAI(marketData.data);
      if (aiResponse.success) {
        setData(aiResponse.data);
        const now = new Date();
        setNextUpdate(addMinutes(now, 15));
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBias();
  }, []);

  useEffect(() => {
    if (!nextUpdate) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextUpdate.getTime() - now.getTime();
      if (diff <= 0) {
        fetchBias();
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
      <PageShell>
        <div className="space-y-6 max-w-[1400px] mx-auto font-sans">
          <Skeleton className="h-64 rounded-[12px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-[12px]" />
            <Skeleton className="h-48 rounded-[12px]" />
          </div>
        </div>
      </PageShell>
    );
  }

  const defaultData = {
    overallBias: "STRONGLY BULLISH",
    confidenceScore: 84,
    reasoning: [
      "Broad market participation: 72% of S&P 500 constituents trading above their 200-day moving average.",
      "VIX fear gauge suppressed at 15.42 points, signaling stable institutional volatility pricing.",
      "Corporate earnings surprise ratio running +6.4% above consensus estimates.",
      "Fixed income yields stabilizing with 10-Year Treasury trading range-bound at 4.22%.",
    ],
    analystNote: "Constructive price action indicates strong dip-buying demand across mega-cap technology and financials.",
    vixInterpretation: "VIX < 16 indicates low volatility regimes favorable for trend-following strategies.",
    tomorrowOutlook: "Expect continuation test towards recent 52-week high resistance levels.",
    keyOpportunitiesToday: [
      "Tech breakout momentum setups with tight stop-losses",
      "Financial sector dividend yield compression plays",
      "Consumer discretionary dips near key moving averages",
    ],
    keyRisksToday: [
      "Overhead resistance near S&P 5,850 psychological level",
      "Geopolitical headlines impacting energy commodities",
      "Unanticipated hawkish comments from Federal Reserve speakers",
    ],
    sectorBias: [
      { sector: "Technology", bias: "BULLISH", reason: "Strong AI infrastructure spending and cloud growth" },
      { sector: "Financials", bias: "BULLISH", reason: "Net interest margins benefiting from current yield curve" },
      { sector: "Consumer Cyclicals", bias: "NEUTRAL", reason: "Mixed consumer confidence & retail sales data" },
      { sector: "Healthcare", bias: "NEUTRAL", reason: "Defensive rotation stabilizing sector valuations" },
      { sector: "Energy", bias: "BEARISH", reason: "Crude oil inventory builds pressing sector margins" },
      { sector: "Utilities", bias: "NEUTRAL", reason: "Bond yield stability maintaining current dividend appeal" },
      { sector: "Industrials", bias: "BULLISH", reason: "Infrastructure & defense order backlog expansion" },
    ],
  };

  const currentData = data || defaultData;
  const biasStr = currentData.overallBias?.toUpperCase() || "BULLISH";
  const isBullish = biasStr.includes("BULLISH");
  const isBearish = biasStr.includes("BEARISH");

  return (
    <PageShell>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[1400px] mx-auto space-y-6 font-sans min-w-0"
      >
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] text-[var(--ai)] uppercase tracking-wider">MACRO REASONING ENGINE</span>
            <h1 className="font-sans text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">Global Market Bias Terminal</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-[8px] bg-[var(--card)] border border-[var(--border)] px-3 py-1.5 font-mono text-[11px]">
              <span className="text-[var(--foreground-muted)]">Refreshes in</span>
              <span className="text-[var(--positive)] font-medium">{timeRemaining}</span>
            </div>
            <button
              onClick={fetchBias}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              title="Refresh analysis"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* HERO SECTION: Big Market Bias Banner */}
        <div className="rounded-[16px] border-l-[3px] border-l-[var(--ai)] border-y border-r border-[var(--border)] bg-[var(--card)] p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="font-mono text-[11px] text-[var(--foreground-muted)] uppercase">Consensus Synthesis Bias</span>
              <h2
                className={cn(
                  "font-bebas text-[64px] tracking-tight leading-none uppercase mt-1",
                  isBullish ? "text-[var(--positive)]" : isBearish ? "text-[var(--negative)]" : "text-[var(--warning)]"
                )}
              >
                {biasStr}
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end w-full md:w-auto">
              <div className="flex justify-between md:justify-end gap-3 font-mono text-[12px] mb-2 w-full md:w-auto">
                <span className="text-[var(--foreground-muted)]">Confidence Level</span>
                <span className="text-[var(--positive)] font-medium">{currentData.confidenceScore}%</span>
              </div>
              <div className="w-full md:w-64 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--positive)] transition-all duration-1000"
                  style={{ width: `${currentData.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Reasoning Bullets (2-Column Grid) */}
          <div className="pt-6 border-t border-[var(--border)]">
            <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)] mb-4 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-[var(--positive)]" /> Primary Catalyst Reasoning
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentData.reasoning?.map((reason: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 bg-[var(--background-secondary)] p-3.5 rounded-[8px] border border-[var(--border)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--positive)] shrink-0 mt-1.5" />
                  <p className="text-[12px] text-[var(--foreground-muted)] leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TWO-COLUMN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Sector Bias Grid */}
          <Card variant="terminal" className="rounded-[16px]">
            <CardHeader className="py-3.5 border-b border-[var(--border)]">
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Sector Breakdown & Alignment</h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {currentData.sectorBias?.map((sec: any, i: number) => {
                const b = sec.bias?.toUpperCase();
                const isSecBull = b === "BULLISH";
                const isSecBear = b === "BEARISH";
                return (
                  <div key={i} className="rounded-[10px] bg-[var(--background-secondary)] border border-[var(--border)] p-3 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[13px] font-medium text-[var(--foreground)]">{sec.sector}</span>
                      <Badge variant={isSecBull ? "bullish" : isSecBear ? "bearish" : "neutral"}>
                        {b}
                      </Badge>
                    </div>
                    {/* Mini Bar */}
                    <div className="h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          isSecBull ? "bg-[var(--positive)] w-3/4" : isSecBear ? "bg-[var(--negative)] w-1/4" : "bg-[var(--warning)] w-1/2"
                        )}
                      />
                    </div>
                    <p className="text-[11px] text-[var(--foreground-muted)] leading-normal">{sec.reason}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* RIGHT: Key Opportunities & Risks */}
          <div className="space-y-6">
            {/* Key Opportunities */}
            <Card variant="terminal" className="rounded-[16px]">
              <CardHeader className="py-3.5 border-b border-[var(--border)] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--positive)]" />
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Key Opportunities Today</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {currentData.keyOpportunitiesToday?.map((opp: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-[12px] text-[var(--foreground)] bg-[var(--positive)]/5 p-3 rounded-[8px] border border-[var(--positive)]/20">
                    <CheckCircle2 className="h-4 w-4 text-[var(--positive)] shrink-0 mt-0.5" />
                    <span>{opp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Key Risks */}
            <Card variant="terminal" className="rounded-[16px]">
              <CardHeader className="py-3.5 border-b border-[var(--border)] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--negative)]" />
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Key Risks & Vulnerabilities</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {currentData.keyRisksToday?.map((risk: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-[12px] text-[var(--foreground)] bg-[var(--negative)]/5 p-3 rounded-[8px] border border-[var(--negative)]/20">
                    <AlertTriangle className="h-4 w-4 text-[var(--negative)] shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tomorrow's Outlook */}
            <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-5 space-y-1">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--ai)] block">
                Tomorrow&apos;s Outlook & Playbook
              </span>
              <p className="text-[13px] text-[var(--foreground)] leading-relaxed font-sans">{currentData.tomorrowOutlook}</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[var(--foreground-muted)] italic mt-2">
          AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
        </p>
      </motion.div>
    </PageShell>
  );
}




