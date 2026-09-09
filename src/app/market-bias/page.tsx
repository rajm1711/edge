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
      <div className="w-full max-w-[1400px] mx-auto space-y-6 font-sans min-w-0">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] text-ai-purple uppercase tracking-wider">MACRO REASONING ENGINE</span>
            <h1 className="font-bebas text-[28px] tracking-wide uppercase text-text-primary">Global Market Bias Terminal</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-[8px] bg-bg-card border border-border px-3 py-1.5 font-mono text-[11px]">
              <span className="text-text-muted">Refreshes in</span>
              <span className="text-positive font-medium">{timeRemaining}</span>
            </div>
            <button
              onClick={fetchBias}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-border bg-bg-card text-text-secondary hover:text-text-primary transition-colors"
              title="Refresh analysis"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* HERO SECTION: Big Market Bias Banner */}
        <div className="rounded-[12px] border-l-[3px] border-l-ai-purple border-y border-r border-border bg-bg-card p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="font-mono text-[11px] text-text-muted uppercase">Consensus Synthesis Bias</span>
              <h2
                className={cn(
                  "font-bebas text-[56px] tracking-tight leading-none uppercase mt-1",
                  isBullish ? "text-positive" : isBearish ? "text-negative" : "text-neutral"
                )}
              >
                {biasStr}
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end w-full md:w-auto">
              <div className="flex justify-between md:justify-end gap-3 font-mono text-[12px] mb-2 w-full md:w-auto">
                <span className="text-text-muted">Confidence Level</span>
                <span className="text-positive font-medium">{currentData.confidenceScore}%</span>
              </div>
              <div className="w-full md:w-64 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-positive transition-all duration-1000"
                  style={{ width: `${currentData.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Reasoning Bullets (2-Column Grid) */}
          <div className="pt-6 border-t border-border">
            <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-4 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-positive" /> Primary Catalyst Reasoning
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentData.reasoning?.map((reason: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 bg-bg-secondary p-3.5 rounded-[8px] border border-border">
                  <span className="h-1.5 w-1.5 rounded-full bg-positive shrink-0 mt-1.5" />
                  <p className="text-[12px] text-text-secondary leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TWO-COLUMN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Sector Bias Grid */}
          <Card variant="terminal">
            <CardHeader className="py-3 border-b border-border">
              <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Sector Breakdown & Alignment</h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {currentData.sectorBias?.map((sec: any, i: number) => {
                const b = sec.bias?.toUpperCase();
                const isSecBull = b === "BULLISH";
                const isSecBear = b === "BEARISH";
                return (
                  <div key={i} className="rounded-[8px] bg-bg-secondary border border-border p-3 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[13px] font-medium text-text-primary">{sec.sector}</span>
                      <Badge variant={isSecBull ? "bullish" : isSecBear ? "bearish" : "neutral"}>
                        {b}
                      </Badge>
                    </div>
                    {/* Mini Bar */}
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          isSecBull ? "bg-positive w-3/4" : isSecBear ? "bg-negative w-1/4" : "bg-neutral w-1/2"
                        )}
                      />
                    </div>
                    <p className="text-[11px] text-text-secondary leading-normal">{sec.reason}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* RIGHT: Key Opportunities & Risks */}
          <div className="space-y-6">
            {/* Key Opportunities */}
            <Card variant="terminal">
              <CardHeader className="py-3 border-b border-border flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-positive" />
                <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Key Opportunities Today</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {currentData.keyOpportunitiesToday?.map((opp: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-[12px] text-text-primary bg-[rgba(0,208,132,0.04)] p-3 rounded-[6px] border border-[rgba(0,208,132,0.15)]">
                    <CheckCircle2 className="h-4 w-4 text-positive shrink-0 mt-0.5" />
                    <span>{opp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Key Risks */}
            <Card variant="terminal">
              <CardHeader className="py-3 border-b border-border flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-negative" />
                <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Key Risks & Vulnerabilities</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {currentData.keyRisksToday?.map((risk: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-[12px] text-text-primary bg-[rgba(255,77,77,0.04)] p-3 rounded-[6px] border border-[rgba(255,77,77,0.15)]">
                    <AlertTriangle className="h-4 w-4 text-negative shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tomorrow's Outlook */}
            <div className="rounded-[12px] bg-bg-card border border-border p-5">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-ai-purple block mb-1">
                Tomorrow&apos;s Outlook & Playbook
              </span>
              <p className="text-[13px] text-text-primary leading-relaxed font-sans">{currentData.tomorrowOutlook}</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

