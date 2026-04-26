"use client";

import { useState, useEffect } from "react";
import { Zap, ShieldAlert, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";

export function AIMarketBias() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBias() {
      setIsLoading(true);
      const marketData = await apiClient.getMarketBias();
      console.log(marketData);
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

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;
  if (!data) return null;

  const biasColor = data.overallBias?.includes("BULLISH") ? "text-accent" :
    data.overallBias?.includes("BEARISH") ? "text-red" : "text-yellow";

  return (
    <Card variant="premium" className="relative overflow-hidden border-accent/20">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Zap className="h-32 w-32 text-accent" />
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-5 w-5 text-accent fill-accent/20" />
              <h3 className="font-bebas text-xl tracking-wide uppercase text-text-primary">AI Market Bias</h3>
            </div>
            <p className="text-xs text-text-muted">Dynamic sentiment analysis of real-time internals</p>
          </div>

          <div className="text-right">
            <h2 className={`font-bebas text-4xl tracking-tight leading-none ${biasColor}`}>
              {data.overallBias}
            </h2>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="text-[10px] font-mono text-text-muted uppercase">Confidence</span>
              <div className="w-24 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-1000"
                  style={{ width: `${data.confidenceScore}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-accent">{data.confidenceScore}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
              <Target className="h-3 w-3" /> Core Reasoning
            </h4>
            <ul className="space-y-3">
              {data?.reasoning?.map((reason: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-sm text-text-secondary leading-relaxed">{reason}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" /> Analyst Note
            </h4>
            <p className="text-sm text-text-primary italic leading-relaxed mb-4">
              &quot;{data.analystNote}&quot;
            </p>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase">Tomorrow&apos;s Outlook</span>
                <span className="text-xs font-medium text-text-secondary">{data.tomorrowOutlook}</span>
              </div>
              <span className="text-[10px] font-mono text-text-muted">
                Analyzed at {format(new Date(), "HH:mm")} ET
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
