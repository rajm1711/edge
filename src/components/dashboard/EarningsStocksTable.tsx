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
    if (!hour) return <span className="font-mono text-[11px] text-[#4a5568]">-</span>;
    switch (hour.toLowerCase()) {
      case "amc":
        return <span className="font-mono text-[11px] text-[#f5a623]">After Market</span>;
      case "bmo":
        return <span className="font-mono text-[11px] text-[#4d9fff]">Before Market</span>;
      default:
        return <span className="font-mono text-[11px] text-[#718096]">{hour}</span>;
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="bg-bg-secondary border-b border-border">
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Symbol / Company
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Earnings Date
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Timing
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Price
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
              Change
            </th>
            <th className="py-2.5 px-4 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => {
            const isPositive = (item.change ?? 0) >= 0;
            return (
              <tr
                key={item.ticker}
                onClick={() => router.push(`/research?ticker=${item.ticker}`)}
                className="group border-b border-border hover:bg-bg-hover transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <Star className="h-[14px] w-[14px] text-text-muted group-hover:text-neutral transition-colors" />
                    <div className="flex flex-col">
                      <span className="font-mono text-[13px] font-medium text-text-primary uppercase">
                        {item.ticker}
                      </span>
                      <span className="text-[11px] text-text-secondary truncate max-w-[160px]">
                        {item.companyName}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-mono text-[12px] text-text-primary">
                    <Calendar className="h-3.5 w-3.5 text-text-muted" />
                    <span>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">{getTimeDisplay(item.hour)}</td>
                <td className="py-3 px-4 font-mono text-[14px] font-medium text-text-primary">
                  {item.price ? formatCurrency(item.price) : "-"}
                </td>
                <td className="py-3 px-4">
                  {item.changePercent !== undefined ? (
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
                  ) : (
                    <span className="font-mono text-[11px] text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/research?ticker=${item.ticker}`);
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

