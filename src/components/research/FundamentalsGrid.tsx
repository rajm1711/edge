"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface FundamentalsGridProps {
  data: any;
}

export function FundamentalsGrid({ data }: FundamentalsGridProps) {
  if (!data) return null;

  const metrics = [
    { label: "P/E Ratio", value: data.peRatio?.toFixed(2) || "N/A", sub: "Market Avg: 22.5" },
    { label: "EPS (TTM)", value: formatCurrency(data.eps) || "N/A", sub: "Trailing 12 Mo" },
    { label: "Market Cap", value: formatNumber(data.marketCap) || "N/A", sub: "Equity Value" },
    { label: "Beta (5Y)", value: data.beta?.toFixed(2) || "N/A", sub: "Volatility Index" },
    { label: "Div Yield", value: data.dividendYield ? `${data.dividendYield.toFixed(2)}%` : "0.00%", sub: "Annualized" },
    { label: "Rev Growth", value: data.revenueGrowth ? `${data.revenueGrowth.toFixed(2)}%` : "N/A", sub: "Year over Year" },
    { label: "Profit Margin", value: data.profitMargin ? `${data.profitMargin.toFixed(2)}%` : "N/A", sub: "Net Efficiency" },
    { label: "52W High", value: formatCurrency(data["52WeekHigh"]) || "N/A", sub: "Projected Peak" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <Card key={i} variant="default" className="hover:border-accent/20 transition-all group">
          <CardContent className="p-4">
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest mb-1 group-hover:text-accent transition-colors">
              {metric.label}
            </p>
            <p className="text-lg font-mono font-bold text-text-primary">
              {metric.value}
            </p>
            <p className="text-[9px] text-text-muted mt-1 font-medium">
              {metric.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
