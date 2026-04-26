"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils";

interface IndexData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function KPICards({ data, isLoading }: { data: IndexData[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const getVixLabel = (vixValue: number) => {
    if (vixValue > 30) return { label: "Panic", variant: "danger" as const };
    if (vixValue > 20) return { label: "Fear", variant: "warning" as const };
    return { label: "Greed", variant: "success" as const };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item) => {
        const isVix = item.symbol === "VIX";
        const vixInfo = isVix ? getVixLabel(item.price) : null;
        const isPositive = item.change >= 0;

        return (
          <Card key={item.symbol} variant="premium" className="relative overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted group-hover:text-accent transition-colors">
                  {item.symbol}
                </span>
                {isVix ? (
                  <Badge variant={vixInfo?.variant}>{vixInfo?.label}</Badge>
                ) : (
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold font-mono",
                    isPositive ? "text-accent" : "text-red"
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatPercent(item.changePercent)}
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-mono font-bold text-text-primary tracking-tight">
                  {item.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                {isVix && (
                  <span className="text-xs text-text-muted font-mono">pts</span>
                )}
              </div>
              {!isVix && (
                <div className="mt-1 flex items-center gap-1">
                    <span className={cn("text-[10px] font-mono", isPositive ? "text-accent" : "text-red")}>
                        {isPositive ? '+' : ''}{item.change?.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase">Today</span>
                </div>
              )}
            </CardContent>
            <div className={cn(
                "h-1 w-full absolute bottom-0",
                isVix ? (item.price > 20 ? "bg-red" : "bg-accent") : (isPositive ? "bg-accent" : "bg-red")
            )} />
          </Card>
        );
      })}
    </div>
  );
}

import { cn } from "@/lib/utils";
