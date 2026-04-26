"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Lightbulb, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechnicalSignalsProps {
  data: any[];
  isLoading: boolean;
}

export function TechnicalSignals({ data, isLoading }: TechnicalSignalsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full animate-shimmer bg-bg-secondary rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((signal, i) => (
        <Card key={i} variant="default" className="group hover:border-accent/30 transition-all border-border/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                signal.type === "bullish" ? "bg-accent/10" : signal.type === "bearish" ? "bg-red/10" : "bg-yellow/10"
              )}>
                {signal.type === "bullish" ? (
                  <TrendingUp className="h-4 w-4 text-accent" />
                ) : signal.type === "bearish" ? (
                  <TrendingDown className="h-4 w-4 text-red" />
                ) : (
                  <Activity className="h-4 w-4 text-yellow" />
                )}
              </div>
              <div className="flex flex-col items-end">
                <Badge variant={signal.type === "bullish" ? "success" : signal.type === "bearish" ? "danger" : "warning"} className="scale-75 origin-right">
                  {signal.strength}
                </Badge>
                <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-text-muted uppercase">
                    <Clock className="h-2.5 w-2.5" /> {signal.timeframe}
                </div>
              </div>
            </div>

            <h4 className="text-sm font-bold text-text-primary mb-1 group-hover:text-accent transition-colors truncate">
              {signal.signalName}
            </h4>
            <p className="text-[11px] text-text-secondary leading-tight mb-3 line-clamp-2">
              {signal.description}
            </p>
            
            <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <Lightbulb className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-text-primary leading-tight lowercase">
                    {signal.actionableInsight}
                </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
