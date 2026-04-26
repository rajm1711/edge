"use client";

import { Star, ArrowUpRight, ArrowDownRight, MoreHorizontal, ExternalLink, Calendar, Clock } from "lucide-react";
import { cn, formatPercent, formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface EarningsStockItem {
  ticker: string;
  companyName: string;
  date: string;
  epsEstimate?: number;
  revenueEstimate?: number;
  hour?: string; // amc, bmo, etc.
  // Additional fields for stock data
  price?: number;
  change?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export function EarningsStocksTable({ data, isLoading }: { data: EarningsStockItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 w-full animate-shimmer bg-bg-secondary rounded-lg" />
        ))}
      </div>
    );
  }

  const getTimeDisplay = (hour?: string) => {
    if (!hour) return null;
    switch (hour.toLowerCase()) {
      case 'amc':
        return <span className="text-[10px] font-mono text-text-muted">After Market</span>;
      case 'bmo':
        return <span className="text-[10px] font-mono text-text-muted">Before Market</span>;
      default:
        return <span className="text-[10px] font-mono text-text-muted">{hour}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Symbol</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Company</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Earnings Date</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Time</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Price</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Change</th>
            <th className="pb-4 pt-1 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((item) => {
            const isPositive = (item.change ?? 0) >= 0;
            return (
              <tr 
                key={item.ticker} 
                className="group hover:bg-bg-secondary/50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-3.5 w-3.5 text-text-muted group-hover:text-yellow transition-colors" />
                    <Link href={`/research?ticker=${item.ticker}`} className="flex flex-col">
                      <span className="font-mono font-bold text-sm text-text-primary uppercase tracking-tight group-hover:text-accent transition-colors">
                        {item.ticker}
                      </span>
                    </Link>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-text-primary truncate max-w-[150px]">
                    {item.companyName}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-text-muted" />
                    <span className="font-mono text-xs text-text-primary">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getTimeDisplay(item.hour)}
                </td>
                <td className="py-4 px-4 font-mono font-bold text-sm text-text-primary">
                  {item.price ? formatCurrency(item.price) : '-'}
                </td>
                <td className="py-4 px-4">
                  {item.change !== undefined && item.changePercent !== undefined ? (
                    <div className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold font-mono",
                      isPositive ? "bg-accent/10 text-accent" : "bg-red/10 text-red"
                    )}>
                      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {formatPercent(item.changePercent)}
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-text-muted">-</span>
                  )}
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
