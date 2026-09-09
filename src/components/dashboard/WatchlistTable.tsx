"use client";

import { Star, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { cn, formatPercent, formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    AAPL: true,
    NVDA: true,
    TSLA: true,
  });

  const toggleFavorite = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [symbol]: !prev[symbol] }));
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-full animate-shimmer rounded-[6px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="bg-bg-secondary border-b border-border">
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Symbol
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Price
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Change
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted hidden sm:table-cell">
              High / Low
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted hidden md:table-cell">
              Volume
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => {
            const isPositive = item.change >= 0;
            const isFav = favorites[item.symbol];
            return (
              <tr
                key={item.symbol}
                onClick={() => router.push(`/research?ticker=${item.symbol}`)}
                className="group border-b border-border hover:bg-bg-hover transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => toggleFavorite(e, item.symbol)}
                      className="text-border hover:text-[#f5a623] transition-colors"
                    >
                      <Star
                        className={cn(
                          "h-[14px] w-[14px]",
                          isFav ? "fill-[#f5a623] text-[#f5a623]" : "text-text-muted"
                        )}
                      />
                    </button>
                    <div className="flex flex-col">
                      <span className="font-mono text-[13px] font-medium text-text-primary uppercase">
                        {item.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[14px] font-medium text-text-primary">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-medium",
                      isPositive
                        ? "bg-[rgba(0,208,132,0.10)] text-positive"
                        : "bg-[rgba(255,77,77,0.10)] text-negative"
                    )}
                  >
                    {isPositive ? "▲ +" : "▼ "}
                    {formatPercent(item.changePercent)}
                  </span>
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <div className="flex flex-col gap-1 w-28">
                    <div className="flex justify-between text-[10px] font-mono text-text-muted">
                      <span>{item.low ? `$${item.low.toFixed(2)}` : "-"}</span>
                      <span>{item.high ? `$${item.high.toFixed(2)}` : "-"}</span>
                    </div>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden relative">
                      {item.high && item.low && item.high > item.low && (
                        <div
                          className="absolute h-full bg-positive"
                          style={{
                            left: `${Math.max(0, Math.min(100, ((item.price - item.low) / (item.high - item.low)) * 100))}%`,
                            width: "3px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[12px] text-text-secondary hidden md:table-cell">
                  {item.volume ? (item.volume / 1000000).toFixed(1) + "M" : "-"}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/research?ticker=${item.symbol}`);
                    }}
                    className="p-1.5 rounded-[6px] hover:bg-border text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
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

