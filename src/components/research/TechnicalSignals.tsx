"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Lightbulb, Activity, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechnicalSignalsProps {
  data: any[];
  isLoading: boolean;
}

export function TechnicalSignals({ data, isLoading }: TechnicalSignalsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[var(--ai)] font-mono text-[11px] uppercase tracking-wider">
          <Eye className="h-4 w-4 animate-spin" />
          <span>Generating AI Market Observations...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-full animate-shimmer bg-[var(--background-secondary)] rounded-[16px]" />
          ))}
        </div>
      </div>
    );
  }

  const signalsList = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.signals)
    ? (data as any).signals
    : [];

  if (!signalsList || signalsList.length === 0) return null;

  return (
    <div className="space-y-3 font-sans">
      <p className="text-[11px] text-[var(--foreground-muted)] italic">
        AI-generated market observations based on available financial context. Not calculated from historical price data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signalsList.map((item: any, i: number) => (
          <Card key={i} variant="default" className="group hover:border-[var(--border-emphasis)] transition-all bg-[var(--card)] rounded-[16px]">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className={cn(
                  "p-2 rounded-[8px]",
                  item.type === "bullish" ? "bg-[var(--positive)]/10" : item.type === "bearish" ? "bg-[var(--negative)]/10" : "bg-[var(--warning)]/10"
                )}>
                  {item.type === "bullish" ? (
                    <TrendingUp className="h-4 w-4 text-[var(--positive)]" />
                  ) : item.type === "bearish" ? (
                    <TrendingDown className="h-4 w-4 text-[var(--negative)]" />
                  ) : (
                    <Activity className="h-4 w-4 text-[var(--warning)]" />
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant={item.type === "bullish" ? "bullish" : item.type === "bearish" ? "bearish" : "warning"} className="scale-75 origin-right uppercase font-mono">
                    {item.strength || "MODERATE"}
                  </Badge>
                  <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-[var(--foreground-muted)] uppercase">
                    <Clock className="h-2.5 w-2.5" /> {item.timeframe || "SWING"}
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--ai)] transition-colors truncate">
                {item.name || item.signalName}
              </h4>
              <p className="text-[11px] text-[var(--foreground-muted)] leading-tight mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-start gap-2 bg-[var(--background-secondary)] p-2.5 rounded-[8px] border border-[var(--border)]">
                <Lightbulb className="h-3 w-3 text-[var(--ai)] mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-[var(--foreground)] leading-tight">
                  {item.insight || item.actionableInsight}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-[11px] text-[var(--foreground-muted)] italic mt-2">
        AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
      </p>
    </div>
  );
}
