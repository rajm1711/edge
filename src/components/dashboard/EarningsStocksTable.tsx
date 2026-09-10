"use client";

import { Star, ExternalLink, Calendar } from "lucide-react";
import { cn, formatPercent, formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface EarningsStockItem {
  ticker: string;
  companyName: string;
  date: string;
  epsEstimate?: number;
  revenueEstimate?: number;
  hour?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export function EarningsStocksTable({ data, isLoading }: { data: EarningsStockItem[]; isLoading: boolean }) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-full animate-shimmer rounded-[6px]" />
        ))}
      </div>
    );
  }

  const getTimeDisplay = (hour?: string) => {
    if (!hour)    return <span className="font-mono text-[11px] text-[var(--foreground-muted)]">−</span>;
    switch (hour.toLowerCase()) {
      case "amc":
        return <span className="font-mono text-[11px] text-[#f59e0b]">After Market</span>;
      case "bmo":
        return <span className="font-mono text-[11px] text-[#3b82f6]">Before Market</span>;
      default:
        return <span className="font-mono text-[11px] text-[var(--foreground-muted)]">{hour}</span>;
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="bg-[var(--background)] border-b border-[var(--border)]">
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Symbol / Company
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Earnings Date
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Timing
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Price
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Change
            </th>
            <th className="h-[36px] px-5 text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)] text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isPositive = (item.change ?? 0) >= 0;
            return (
              <tr
                key={item.ticker}
                onClick={() => router.push(`/research?ticker=${item.ticker}`)}
                className="group h-[48px] border-b border-[var(--border)] hover:bg-[var(--background-tertiary)] transition-colors cursor-pointer last:border-b-0"
              >
                <td className="px-5">
                  <div className="flex items-center gap-2.5">
                    <Star className="h-[14px] w-[14px] text-[var(--foreground-muted)] group-hover:text-[#f59e0b] transition-colors" />
                    <div className="flex flex-col">
                      <span className="font-mono text-[13px] font-semibold text-[var(--foreground)] uppercase">
                        {item.ticker}
                      </span>
                      <span className="text-[11px] text-[var(--foreground-muted)] truncate max-w-[160px] font-sans">
                        {item.companyName}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5">
                  <div className="flex items-center gap-1.5 font-mono text-[12px] text-[var(--foreground)]">
                    <Calendar className="h-3.5 w-3.5 text-[var(--foreground-muted)]" />
                    <span>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-5">{getTimeDisplay(item.hour)}</td>
                <td className="px-5 font-mono text-[14px] font-medium text-[var(--foreground)]">
                  {item.price ? formatCurrency(item.price) : "-"}
                </td>
                <td className="px-5">
                  {item.changePercent !== undefined ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 font-mono text-[12px] font-medium",
                        isPositive
                          ? "bg-[rgba(0,208,132,0.12)] text-[#00d084] border border-[rgba(0,208,132,0.20)]"
                          : "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.20)]"
                      )}
                    >
                      {isPositive ? "▲ +" : "▼ "}
                      {formatPercent(item.changePercent)}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-[var(--foreground-muted)]">−</span>
                  )}
                </td>
                <td className="px-5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/research?ticker=${item.ticker}`);
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

