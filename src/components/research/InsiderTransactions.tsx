"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, User, Calendar, DollarSign, Sparkles } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface InsiderTransactionsProps {
  transactions: any[];
  isLoading: boolean;
  aiAnalysis?: any;
}

export function InsiderTransactions({ transactions, isLoading, aiAnalysis }: InsiderTransactionsProps) {
  const list = Array.isArray(transactions)
    ? transactions
    : Array.isArray((transactions as any)?.transactions)
    ? (transactions as any).transactions
    : [];

  if (isLoading) return <div className="h-64 w-full animate-shimmer bg-[var(--background-secondary)] rounded-[16px]" />;
  if (!list || list.length === 0) return null;

  return (
    <div className="space-y-4">
      <Card variant="default" className="overflow-hidden rounded-[16px]">
        <CardHeader className="py-3.5">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Insider Activity</h3>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)] h-9">
                <th className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Person</th>
                <th className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Type</th>
                <th className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Shares</th>
                <th className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Price</th>
                <th className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground-muted)] text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[11px]">
              {list.slice(0, 8).map((t: any, i: number) => {
                const isActualBuy = t.transactionType.includes('P') || t.transactionType.includes('A');

                return (
                  <tr key={i} className="hover:bg-[var(--background-secondary)]/50 transition-colors h-11">
                    <td className="px-3 font-medium text-[var(--foreground)] capitalize">{t.name.toLowerCase()}</td>
                    <td className="px-3">
                      <Badge variant={isActualBuy ? 'success' : 'danger'} className="scale-75 origin-left">
                        {isActualBuy ? 'BUY' : 'SELL'}
                      </Badge>
                    </td>
                    <td className="px-3 font-mono text-[var(--foreground)]">{t.share?.toLocaleString()}</td>
                    <td className="px-3 font-mono text-[var(--foreground)]">{formatCurrency(t.transactionPrice)}</td>
                    <td className="px-3 text-right text-[var(--foreground-muted)] font-mono">{t.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {aiAnalysis && (
        <Card variant="ai" className="border-[var(--ai)]/30 bg-[var(--ai-dim)] rounded-[16px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[var(--ai)]" />
              <h4 className="font-sans text-xs font-semibold tracking-wider uppercase text-[var(--foreground)]">Insider Sentiment Analysis</h4>
              <Badge variant={aiAnalysis.sentiment === 'bullish' ? 'success' : 'danger'} className="ml-auto">
                {aiAnalysis.sentiment}
              </Badge>
            </div>
            <p className="text-xs text-[var(--foreground)] mb-3 italic">&quot;{aiAnalysis.summary}&quot;</p>
            <div className="bg-[var(--card)] p-2.5 rounded-[8px] border border-[var(--border)]">
              <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mb-1">Key Observation</p>
              <p className="text-[11px] text-[var(--foreground-muted)]">{aiAnalysis.keyObservation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
