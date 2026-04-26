"use client";

import { TrendingUp, TrendingDown, Globe, Layers, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StockHeaderProps {
  profile: any;
  quote: any;
}

export function StockHeader({ profile, quote }: StockHeaderProps) {
  if (!profile || !quote) return null;

  const isPositive = quote.change >= 0;

  // Calculate 52W range percentage
  const high = quote["52WeekHigh"] || quote.high * 1.1; // Fallback
  const low = quote["52WeekLow"] || quote.low * 0.9;   // Fallback
  const rangePercent = ((quote.currentPrice - low) / (high - low)) * 100;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white p-2 border border-border flex items-center justify-center overflow-hidden shadow-sm">
            {profile.logo ? (
              <Image src={profile.logo} alt={profile.companyName} width={64} height={64} className="max-h-full max-w-full object-contain" />
            ) : (
              <Globe className="h-8 w-8 text-text-muted" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-text-primary tracking-tight">{profile.companyName}</h1>
              <Badge variant="outline" className="font-mono text-sm px-3 uppercase">{profile.ticker || profile.symbol}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary font-medium">
              <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {profile.sector}</span>
              <span className="flex items-center gap-1 uppercase"><BarChart3 className="h-3.5 w-3.5" /> {profile.exchange}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-text-primary tracking-tighter">
              {formatCurrency(quote.currentPrice)}
            </span>
            <div className={cn(
              "flex items-center gap-1 font-mono font-bold text-sm",
              isPositive ? "text-accent" : "text-red"
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatPercent(quote.changePercent)}
            </div>
          </div>
          <div className="text-[10px] font-mono text-text-muted mt-1 uppercase tracking-widest">
            {isPositive ? '+' : ''}{quote.change?.toFixed(2)} Today
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-bg-secondary/30 p-4 rounded-xl border border-border/50">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-text-muted tracking-widest">
            <span>52W Low</span>
            <span>Current Position</span>
            <span>52W High</span>
          </div>
          <div className="relative h-2 w-full bg-border/30 rounded-full overflow-hidden">
            <div
              className={cn("absolute h-full transition-all duration-1000", isPositive ? "bg-accent" : "bg-red")}
              style={{ width: `${rangePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono font-bold text-text-primary">
            <span>{formatCurrency(low)}</span>
            <span className="text-accent">{formatPercent(rangePercent / 100 * 100)} of Range</span>
            <span>{formatCurrency(high)}</span>
          </div>
        </div>

        <div className="flex justify-around border-l border-border/50 pl-8">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-text-muted uppercase mb-1">Open</span>
            <span className="text-sm font-mono font-bold">{formatCurrency(quote.open)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-text-muted uppercase mb-1">Prev Close</span>
            <span className="text-sm font-mono font-bold">{formatCurrency(quote.previousClose)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-text-muted uppercase mb-1">Volume</span>
            <span className="text-sm font-mono font-bold">{(quote.volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>
    </div>
  );
}
