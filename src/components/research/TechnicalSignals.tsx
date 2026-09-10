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
        <div className="flex items-center gap-2 text-ai-purple font-mono text-[11px] uppercase tracking-wider">
          <Eye className="h-4 w-4 animate-spin" />
          <span>Generating AI Market Observations...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-full animate-shimmer bg-bg-secondary rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4 font-sans">
      {/* FIX 2 — Heading and Required Sub-label */}
      <div>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-ai-purple" />
          <h3 className="font-bebas text-[22px] tracking-wide uppercase text-text-primary">
            AI Market Observations
          </h3>
        </div>
        <p className="text-[11px] text-[#4a5568] mt-1 italic">
          AI-generated market observations based on available financial context. Not calculated from historical price data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, i) => (
          <Card key={i} variant="default" className="group hover:border-border-emphasis transition-all border-border/50 bg-bg-card">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  item.type === "bullish" ? "bg-[rgba(0,208,132,0.1)]" : item.type === "bearish" ? "bg-[rgba(255,77,77,0.1)]" : "bg-[rgba(245,166,35,0.1)]"
                )}>
                  {item.type === "bullish" ? (
                    <TrendingUp className="h-4 w-4 text-[#00d084]" />
                  ) : item.type === "bearish" ? (
                    <TrendingDown className="h-4 w-4 text-[#ff4d4d]" />
                  ) : (
                    <Activity className="h-4 w-4 text-[#f5a623]" />
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant={item.type === "bullish" ? "bullish" : item.type === "bearish" ? "bearish" : "warning"} className="scale-75 origin-right uppercase font-mono">
                    {item.strength || "MODERATE"}
                  </Badge>
                  <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-text-muted uppercase">
                    <Clock className="h-2.5 w-2.5" /> {item.timeframe || "SWING"}
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-bold text-text-primary mb-1 group-hover:text-ai-purple transition-colors truncate">
                {item.name || item.signalName}
              </h4>
              <p className="text-[11px] text-text-secondary leading-tight mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-start gap-2 bg-bg-secondary p-2 rounded-lg border border-border">
                <Lightbulb className="h-3 w-3 text-ai-purple mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-text-primary leading-tight">
                  {item.insight || item.actionableInsight}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FIX 3 — AI Section Financial Disclaimer */}
      <p className="text-[11px] text-[#4a5568] italic mt-3">
        AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
      </p>
    </div>
  );
}
