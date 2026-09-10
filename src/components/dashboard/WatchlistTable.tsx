"use client";

import { Star, ExternalLink } from "lucide-react";
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

  if (isLoading && (!data || data.length === 0)) {
    return (
      <div className="p-5 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 w-full animate-shimmer rounded-[8px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="bg-[var(--background)] border-b border-[var(--border)]">
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Symbol
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Price
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Change
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)] hidden sm:table-cell">
              High / Low
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)] hidden md:table-cell">
              Volume
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)] text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            const isPositive = item.change >= 0;
            const isFav = favorites[item.symbol];
            return (
              <tr
                key={item.symbol}
                onClick={() => router.push(`/research?ticker=${item.symbol}`)}
                className={cn(
                  "h-[48px] border-b border-[var(--border)] hover:bg-[var(--background-tertiary)] transition-colors cursor-pointer",
                  idx === data.length - 1 && "border-b-0"
                )}
              >
                <td className="px-5">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => toggleFavorite(e, item.symbol)}
                      className="transition-colors"
                    >
                      <Star
                        className={cn(
                          "h-[14px] w-[14px]",
                          isFav ? "fill-[#f59e0b] text-[#f59e0b]" : "text-[var(--foreground-muted)] hover:text-[#f59e0b]"
                        )}
                      />
                    </button>
                    <div className="flex flex-col">
                      <span className="font-mono text-[13px] font-semibold text-[var(--foreground)] uppercase">
                        {item.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 font-mono text-[14px] font-medium text-[var(--foreground)]">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 font-mono text-[12px] font-medium",
                      isPositive
                        ? "bg-[rgba(0,208,132,0.12)] text-[#00d084] border border-[rgba(0,208,132,0.20)]"
                        : "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.20)]"
                    )}
                  >
                    {isPositive ? "▲ +" : "▼ "}
                    {formatPercent(Math.abs(item.changePercent))}
                  </span>
                </td>
                <td className="px-5 hidden sm:table-cell">
                  <div className="flex flex-col gap-1 w-28">
                    <div className="flex justify-between text-[10px] font-mono text-[var(--foreground-muted)]">
                      <span>{item.low ? `$${item.low.toFixed(2)}` : "−"}</span>
                      <span>{item.high ? `$${item.high.toFixed(2)}` : "−"}</span>
                    </div>
                    <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden relative">
                      {item.high && item.low && item.high > item.low && (
                        <div
                          className="absolute h-full bg-[#00d084]"
                          style={{
                            left: `${Math.max(0, Math.min(100, ((item.price - item.low) / (item.high - item.low)) * 100))}%`,
                            width: "3px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 font-mono text-[12px] text-[var(--foreground-muted)] hidden md:table-cell">
                  {item.volume ? (item.volume / 1000000).toFixed(1) + "M" : "−"}
                </td>
                <td className="px-5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/research?ticker=${item.symbol}`);
                    }}
                    className="p-1.5 rounded-[8px] hover:bg-[var(--background-tertiary)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
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
