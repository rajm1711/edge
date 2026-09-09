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
  if (isLoading) return <div className="h-64 w-full animate-shimmer bg-bg-secondary rounded-xl" />;
  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="space-y-6">
      <Card variant="default" className="overflow-hidden">
        <CardHeader className="py-3">
          <h3 className="font-bebas text-lg tracking-wide uppercase">Insider Activity</h3>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-secondary/30">
                <th className="p-3 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Person</th>
                <th className="p-3 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Type</th>
                <th className="p-3 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Shares</th>
                <th className="p-3 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Price</th>
                <th className="p-3 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-[11px]">
              {transactions.slice(0, 8).map((t, i) => {
                const isBuy = t.transactionType.includes('S') || t.transactionType.includes('P') || t.transactionType.includes('A');
                // Finnhub codes: S=Sale, P=Purchase, A=Acquisition (Buy). Simplified for demo.
                const isActualBuy = t.transactionType.includes('P') || t.transactionType.includes('A');

                return (
                  <tr key={i} className="hover:bg-bg-secondary/30 transition-colors">
                    <td className="p-3 font-medium text-text-primary capitalize">{t.name.toLowerCase()}</td>
                    <td className="p-3">
                      <Badge variant={isActualBuy ? 'success' : 'danger'} className="scale-75 origin-left">
                        {isActualBuy ? 'BUY' : 'SELL'}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono">{t.share?.toLocaleString()}</td>
                    <td className="p-3 font-mono">{formatCurrency(t.transactionPrice)}</td>
                    <td className="p-3 text-right text-text-muted font-mono">{t.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {aiAnalysis && (
        <Card variant="ai" className="border-[rgba(167,139,250,0.20)] bg-[rgba(167,139,250,0.04)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-accent" />
              <h4 className="font-bebas text-sm tracking-widest uppercase text-text-primary">Insider Sentiment Analysis</h4>
              <Badge variant={aiAnalysis.sentiment === 'bullish' ? 'success' : 'danger'} className="ml-auto">
                {aiAnalysis.sentiment}
              </Badge>
            </div>
            <p className="text-xs text-text-primary mb-3 italic">&quot;{aiAnalysis.summary}&quot;</p>
            <div className="bg-bg-card/50 p-2 rounded border border-accent/10">
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Key Observation</p>
              <p className="text-[11px] text-text-secondary">{aiAnalysis.keyObservation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
