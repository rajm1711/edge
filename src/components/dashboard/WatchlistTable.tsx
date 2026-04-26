"use client";

import { Star, ArrowUpRight, ArrowDownRight, MoreHorizontal, ExternalLink } from "lucide-react";
import { cn, formatPercent, formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export function WatchlistTable({ data, isLoading }: { data: WatchlistItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 w-full animate-shimmer bg-bg-secondary rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Symbol</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Price</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Change</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">High/Low</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <tr 
                key={item.symbol} 
                className="group hover:bg-bg-secondary/50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-3.5 w-3.5 text-text-muted group-hover:text-yellow transition-colors" />
                    <Link href={`/research?ticker=${item.symbol}`} className="flex flex-col">
                      <span className="font-mono font-bold text-sm text-text-primary uppercase tracking-tight group-hover:text-accent transition-colors">
                        {item.symbol}
                      </span>
                    </Link>
                  </div>
                </td>
                <td className="py-4 px-4 font-mono font-bold text-sm text-text-primary">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-4 px-4">
                  <div className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold font-mono",
                    isPositive ? "bg-accent/10 text-accent" : "bg-red/10 text-red"
                  )}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {formatPercent(item.changePercent)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between w-32 text-[10px] font-mono text-text-muted">
                      <span>{item.low?.toFixed(2)}</span>
                      <span>{item.high?.toFixed(2)}</span>
                    </div>
                    <div className="w-32 h-1 bg-bg-secondary rounded-full overflow-hidden relative">
                      <div 
                        className="absolute h-full bg-border" 
                        style={{ 
                          left: `${((item.price - item.low) / (item.high - item.low)) * 100}%`,
                          width: '2px' 
                        }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="p-2 hover:bg-bg-card rounded-lg transition-colors text-text-muted hover:text-text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
