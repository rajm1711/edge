"use client";

import { useState, useEffect } from "react";
import { format, addMinutes } from "date-fns";
import { 
  Zap, TrendingUp, TrendingDown, Target, ShieldAlert,
  AlertTriangle, CheckCircle2, Activity, RefreshCw, BarChart2
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { PageShell } from "@/components/layout/PageShell";

export default function MarketBiasPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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
        setLastUpdated(now);
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
        setTimeRemaining(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextUpdate]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-12 w-12 text-red mb-4" />
        <h2 className="text-xl font-bold font-mono">Failed to load Market Bias</h2>
        <button 
          onClick={fetchBias}
          className="mt-4 px-4 py-2 bg-bg-secondary rounded hover:bg-bg-card transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const biasColor = data.overallBias?.includes("STRONGLY BULLISH") ? "text-accent" :
                    data.overallBias?.includes("BULLISH") ? "text-accent/80" :
                    data.overallBias?.includes("BEARISH") ? "text-red/80" :
                    data.overallBias?.includes("STRONGLY BEARISH") ? "text-red" : "text-yellow";

  return (
    <PageShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-text-primary">Market Bias</h1>
          <p className="text-text-muted mt-1">AI-driven macroeconomic sentiment analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-mono text-text-muted uppercase">Updates In</p>
            <p className="text-sm font-mono font-bold text-accent tabular-nums flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" /> {timeRemaining}
            </p>
          </div>
          <button 
            onClick={fetchBias}
            className="p-2 bg-bg-secondary hover:bg-bg-card border border-border rounded-lg transition"
            title="Refresh Analysis"
          >
            <RefreshCw className="h-4 w-4 text-text-secondary" />
          </button>
        </div>
      </div>

      <Card variant="premium" className="relative overflow-hidden border-accent/20">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BarChart2 className="h-48 w-48 text-text-primary" />
        </div>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 border-b border-border/50 pb-8">
            <div className="flex-1">
              <h2 className={`font-bebas text-6xl tracking-tight leading-none mb-2 ${biasColor}`}>
                {data.overallBias}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Confidence Level</span>
                <div className="w-48 h-2 bg-bg-primary rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-accent transition-all duration-1000"
                    style={{ width: `${data.confidenceScore}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-white">{data.confidenceScore}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue" /> Primary Reasoning
              </h4>
              <ul className="space-y-4">
                {data?.reasoning?.map((reason: string, i: number) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-blue flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <p className="text-sm text-text-secondary leading-relaxed">{reason}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-bg-primary/50 rounded-xl p-5 border border-border">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" /> Analyst Note
                </h4>
                <p className="text-sm text-text-primary italic leading-relaxed">
                  &quot;{data.analystNote}&quot;
                </p>
              </div>
              
              <div className="bg-bg-primary/50 rounded-xl p-5 border border-border">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-yellow" /> VIX Interpretation
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {data.vixInterpretation}
                </p>
              </div>

              <div className="border border-border rounded-xl p-4 bg-gradient-to-r from-bg-secondary to-bg-primary">
                <span className="block text-[10px] text-text-muted uppercase mb-1 font-mono">Tomorrow's Outlook</span>
                <span className="text-sm font-medium text-text-primary leading-snug">{data.tomorrowOutlook}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="flex items-center gap-2 text-sm text-accent font-semibold">
              <TrendingUp className="h-4 w-4" /> Key Opportunities
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data?.keyOpportunitiesToday?.map((opp: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{opp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="flex items-center gap-2 text-sm text-red font-semibold">
              <AlertTriangle className="h-4 w-4" /> Key Risks
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data?.keyRisksToday?.map((risk: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-red mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <h3 className="font-bebas text-2xl tracking-wide mt-8 mb-4">Sector Heatmap</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.sectorBias?.map((sector: any, i: number) => (
          <Card key={i} className="hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm">{sector.sector}</span>
                <Badge variant={
                  sector.bias.toLowerCase() === "bullish" ? "success" : 
                  sector.bias.toLowerCase() === "bearish" ? "danger" : 
                  "outline"
                }>
                  {sector.bias.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                {sector.reason}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </PageShell>
  );
}
