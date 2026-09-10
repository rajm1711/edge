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
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-[12px] bg-white p-2 border border-[var(--border)] flex items-center justify-center overflow-hidden shadow-sm shrink-0">
            {profile.logo ? (
              <Image src={profile.logo} alt={profile.companyName} width={56} height={56} className="max-h-full max-w-full object-contain" />
            ) : (
              <Globe className="h-7 w-7 text-[var(--foreground-muted)]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight font-sans">{profile.companyName}</h1>
              <Badge variant="outline" className="font-mono text-xs px-2.5 uppercase bg-[var(--background-secondary)]">{profile.ticker || profile.symbol}</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[var(--foreground-muted)] font-medium">
              <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {profile.sector}</span>
              <span className="flex items-center gap-1 uppercase"><BarChart3 className="h-3.5 w-3.5" /> {profile.exchange}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] leading-none font-bebas font-bold text-[var(--foreground)] tracking-wide">
              {formatCurrency(quote.currentPrice)}
            </span>
            <div className={cn(
              "flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-[4px]",
              isPositive ? "bg-[var(--positive)]/10 text-[var(--positive)]" : "bg-[var(--negative)]/10 text-[var(--negative)]"
            )}>
              {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {formatPercent(quote.changePercent)}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[var(--foreground-muted)] mt-1 uppercase tracking-wider">
            {isPositive ? '+' : ''}{quote.change?.toFixed(2)} Today
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[var(--background-secondary)] p-4 rounded-[16px] border border-[var(--border)]">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono uppercase text-[var(--foreground-muted)] tracking-wider">
            <span>52W Low</span>
            <span>Current Position</span>
            <span>52W High</span>
          </div>
          <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className={cn("absolute h-full transition-all duration-700", isPositive ? "bg-[var(--positive)]" : "bg-[var(--negative)]")}
              style={{ width: `${rangePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-[var(--foreground)]">
            <span>{formatCurrency(low)}</span>
            <span className="text-[var(--positive)] font-bold">{formatPercent(rangePercent)} of Range</span>
            <span>{formatCurrency(high)}</span>
          </div>
        </div>

        <div className="flex justify-around border-l border-[var(--border)]/60 pl-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-[var(--foreground-muted)] uppercase mb-0.5">Open</span>
            <span className="text-sm font-mono font-medium text-[var(--foreground)]">{formatCurrency(quote.open)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-[var(--foreground-muted)] uppercase mb-0.5">Prev Close</span>
            <span className="text-sm font-mono font-medium text-[var(--foreground)]">{formatCurrency(quote.previousClose)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-[var(--foreground-muted)] uppercase mb-0.5">Volume</span>
            <span className="text-sm font-mono font-medium text-[var(--foreground)]">{(quote.volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>
    </div>
  );
}
