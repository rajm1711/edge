"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2, Search, Filter, Sparkles, TrendingUp, TrendingDown, Clock, Brain, AlertCircle, X, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { apiClient } from "@/lib/api-client";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { format } from "date-fns";
import { SlidePanel } from "@/components/ui/SlidePanel";

interface Trade {
    id: string;
    date: string;
    ticker: string;
    type: "Long" | "Short";
    entryPrice: number;
    exitPrice: number;
    shares: number;
    pnl: number;
    pnlPercent: number;
    outcome: "Won" | "Lost" | "BE";
    thesis: string;
    setup: string;
    psychology?: string;
}

export default function JournalPage() {
    const { toast } = useToast();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [autopsyData, setAutopsyData] = useState<any>(null);
    const [isAutopsying, setIsAutopsying] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        ticker: "",
        type: "Long" as "Long" | "Short",
        entryPrice: "",
        exitPrice: "",
        shares: "",
        thesis: "",
        setup: "Breakout",
        psychology: "Neutral"
    });

    useEffect(() => {
        const saved = localStorage.getItem("edgeiq_trades");
        if (saved) {
            setTrades(JSON.parse(saved));
        }
        setIsLoading(false);
    }, []);

    const saveTrades = (newTrades: Trade[]) => {
        setTrades(newTrades);
        localStorage.setItem("edgeiq_trades", JSON.stringify(newTrades));
    };

    const handleAddTrade = (e: React.FormEvent) => {
        e.preventDefault();
        const entry = parseFloat(formData.entryPrice);
        const exit = parseFloat(formData.exitPrice);
        const shares = parseFloat(formData.shares);
        const pnl = (exit - entry) * shares * (formData.type === "Long" ? 1 : -1);
        const pnlPercent = ((exit - entry) / entry) * 100 * (formData.type === "Long" ? 1 : -1);

        const newTrade: Trade = {
            id: Math.random().toString(36).substring(2, 9),
            date: format(new Date(), "yyyy-MM-dd"),
            ticker: formData.ticker.toUpperCase(),
            type: formData.type,
            entryPrice: entry,
            exitPrice: exit,
            shares,
            pnl,
            pnlPercent,
            outcome: pnl > 0 ? "Won" : pnl < 0 ? "Lost" : "BE",
            thesis: formData.thesis,
            setup: formData.setup,
            psychology: formData.psychology
        };

        saveTrades([newTrade, ...trades]);
        setShowAddModal(false);
        setFormData({
            ticker: "",
            type: "Long",
            entryPrice: "",
            exitPrice: "",
            shares: "",
            thesis: "",
            setup: "Breakout",
            psychology: "Neutral"
        });
        toast("Trade logged successfully", "success");
    };

    const deleteTrade = (id: string) => {
        if (confirm("Are you sure you want to delete this trade?")) {
            saveTrades(trades.filter(t => t.id !== id));
            toast("Trade deleted", "info");
        }
    };

    const runAutopsy = async (trade: Trade) => {
        setIsAutopsying(true);
        setAutopsyData(null);
        const response = await apiClient.tradeAutopsyAI(trade);
        if (response.success) {
            setAutopsyData(response.data);
        } else {
            toast("Autopsy failed", "error");
        }
        setIsAutopsying(false);
    };

    const getSummary = async () => {
        if (trades.length < 3) {
            toast("Log at least 3 trades for a summary", "info");
            return;
        }
        setIsSummarizing(true);
        const response = await apiClient.journalSummaryAI(trades);
        if (response.success) {
            setSummaryData(response.data);
        }
        setIsSummarizing(false);
    };

    // Calculated stats
  const totalTrades = trades.length;
  const wonTrades = trades.filter(t => t.outcome === 'Won');
  const lostTrades = trades.filter(t => t.outcome === 'Lost');
  const winRate = totalTrades > 0 ? ((wonTrades.length / totalTrades) * 100).toFixed(0) : "0";
  const netPnL = trades.reduce((a, b) => a + b.pnl, 0);
  const avgWin = wonTrades.length > 0 ? wonTrades.reduce((a, b) => a + b.pnl, 0) / wonTrades.length : 0;
  const avgLoss = lostTrades.length > 0 ? Math.abs(lostTrades.reduce((a, b) => a + b.pnl, 0) / lostTrades.length) : 0;
  const profitFactor = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : "N/A";
  const avgRR = avgLoss > 0 ? `1:${(avgWin / avgLoss).toFixed(1)}` : "N/A";

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[1500px] mx-auto space-y-6 font-sans min-w-0 pb-16 relative"
      >
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-wider">PERFORMANCE LOG</span>
            <h1 className="font-sans text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">Trade Journal & Autopsy</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={getSummary}
              isLoading={isSummarizing}
              className="bg-[var(--background-secondary)] border-[var(--border)] text-[var(--foreground)] h-10 px-4 text-xs font-mono"
            >
              <Brain className="h-4 w-4 mr-2 text-[var(--accent)]" />
              AI Psychology Summary
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowAddModal(true)}
              className="h-10 px-5 bg-[var(--accent)] text-black font-semibold hover:opacity-90 text-xs font-sans uppercase tracking-wider"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Log New Trade
            </Button>
          </div>
        </div>

        {/* AI Performance DNA Summary Card */}
        {summaryData && (
          <Card variant="ai" className="bg-[var(--ai-dim)] border-[var(--ai)]/30 animate-in slide-in-from-top-4 duration-300 rounded-[16px] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between flex-wrap gap-6">
                <div className="flex-1 min-w-[280px]">
                  <h3 className="font-sans text-base font-semibold uppercase tracking-wider text-[var(--foreground)] mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[var(--accent)]" /> Performance DNA Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Master Setup</span>
                      <p className="text-base font-mono font-bold text-[var(--accent)] uppercase">{summaryData.masterSetup}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Main Weakness</span>
                      <p className="text-base font-mono font-bold text-[var(--negative)] uppercase">{summaryData.mainWeakness}</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[var(--foreground)] italic border-l-2 border-[var(--accent)]/50 pl-3 py-1 leading-relaxed">
                    &quot;{summaryData.performanceAnalogy}&quot;
                  </p>
                </div>

                <div className="flex-1 min-w-[280px] space-y-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)]">Strategic Homework</h4>
                  <ul className="space-y-1.5">
                    {summaryData?.homework?.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-[var(--foreground)] bg-[var(--card)] p-2 rounded-[8px] border border-[var(--border)]">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] italic mt-4 pt-2 border-t border-[var(--border)]">
                AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
              </p>
            </CardContent>
            <div className="bg-[var(--card)]/50 p-2 px-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setSummaryData(null)} className="text-[10px] uppercase font-mono text-[var(--foreground-muted)]">
                Dismiss
              </Button>
            </div>
          </Card>
        )}

        {/* Phase 6 Spec Requirement: 5-Card Stats Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card variant="default" className="rounded-[16px] p-4 bg-[var(--card)] border border-[var(--border)]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)]">Total Trades</span>
            <p className="text-2xl font-mono font-bold text-[var(--foreground)] mt-1">{totalTrades}</p>
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono">Logged Trades</span>
          </Card>

          <Card variant="default" className="rounded-[16px] p-4 bg-[var(--card)] border border-[var(--border)]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)]">Win Rate</span>
            <p className="text-2xl font-mono font-bold text-[var(--positive)] mt-1">{winRate}%</p>
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono">{wonTrades.length} W / {lostTrades.length} L</span>
          </Card>

          <Card variant="default" className="rounded-[16px] p-4 bg-[var(--card)] border border-[var(--border)]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)]">Net P&L</span>
            <p className={cn("text-2xl font-mono font-bold mt-1", netPnL >= 0 ? "text-[var(--positive)]" : "text-[var(--negative)]")}>
              {formatCurrency(netPnL)}
            </p>
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono">Realized P&L</span>
          </Card>

          <Card variant="default" className="rounded-[16px] p-4 bg-[var(--card)] border border-[var(--border)]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)]">Avg R:R Ratio</span>
            <p className="text-2xl font-mono font-bold text-[var(--foreground)] mt-1">{avgRR}</p>
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono">Risk vs Reward</span>
          </Card>

          <Card variant="default" className="rounded-[16px] p-4 bg-[var(--card)] border border-[var(--border)] col-span-2 md:col-span-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)]">Profit Factor</span>
            <p className="text-2xl font-mono font-bold text-[var(--accent)] mt-1">{profitFactor}</p>
            <span className="text-[10px] text-[var(--foreground-muted)] font-mono">Wins / Losses</span>
          </Card>
        </div>

        {/* Trades Table */}
        <Card variant="default" className="rounded-[16px] overflow-hidden border border-[var(--border)] bg-[var(--card)]">
          <CardHeader className="py-3.5 px-4 border-b border-[var(--border)] flex flex-row items-center justify-between">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Trade History Log</h3>
            <span className="text-[11px] font-mono text-[var(--foreground-muted)]">{trades.length} Records</span>
          </CardHeader>
          <CardContent className="p-0">
            {trades.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center p-6 text-center opacity-60">
                <BookOpen className="h-10 w-10 text-[var(--accent)] mb-3" />
                <h3 className="font-sans text-lg font-semibold uppercase text-[var(--foreground)]">No trades logged yet</h3>
                <p className="text-xs font-mono text-[var(--foreground-muted)] max-w-sm mt-1">Start tracking your trades and psychology by clicking &quot;Log New Trade&quot; above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] whitespace-nowrap">
                  <thead className="bg-[var(--background-secondary)] text-[var(--foreground-muted)] text-[10px] uppercase font-mono tracking-wider border-b border-[var(--border)] h-9">
                    <tr>
                      <th className="px-4 font-mono">Outcome</th>
                      <th className="px-4 font-mono">Ticker & Direction</th>
                      <th className="px-4 font-mono">Entry / Exit</th>
                      <th className="px-4 font-mono">P&L ($ / %)</th>
                      <th className="px-4 font-mono">Setup</th>
                      <th className="px-4 font-mono">Psychology</th>
                      <th className="px-4 font-mono text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                    {trades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-[var(--background-secondary)]/50 transition-colors h-12">
                        <td className="px-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-bold uppercase",
                            trade.outcome === 'Won' ? 'bg-[var(--positive)]/15 text-[var(--positive)] border border-[var(--positive)]/30' :
                            trade.outcome === 'Lost' ? 'bg-[var(--negative)]/15 text-[var(--negative)] border border-[var(--negative)]/30' :
                            'bg-[var(--background-tertiary)] text-[var(--foreground-muted)]'
                          )}>
                            {trade.outcome}
                          </span>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[13px] text-[var(--foreground)] uppercase">{trade.ticker}</span>
                            <Badge variant="outline" className={cn("text-[9px]", trade.type === 'Long' ? 'text-[var(--positive)] border-[var(--positive)]/40' : 'text-[var(--negative)] border-[var(--negative)]/40')}>
                              {trade.type}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 font-mono text-[var(--foreground)]">
                          {formatCurrency(trade.entryPrice)} → {formatCurrency(trade.exitPrice)}
                        </td>
                        <td className="px-4 font-mono">
                          <span className={cn("font-bold", trade.pnl >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>
                            {formatCurrency(trade.pnl)} ({formatPercent(trade.pnlPercent)})
                          </span>
                        </td>
                        <td className="px-4">
                          <Badge variant="outline" className="text-[9px] uppercase">{trade.setup}</Badge>
                        </td>
                        <td className="px-4 text-[11px] text-[var(--foreground-muted)]">
                          {trade.psychology}
                        </td>
                        <td className="px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => runAutopsy(trade)}
                              className="px-2.5 py-1 rounded-[6px] bg-[var(--ai-dim)] border border-[var(--border)] text-[var(--ai)] hover:opacity-80 font-mono text-[10px] uppercase tracking-wider transition-colors"
                            >
                              Autopsy
                            </button>
                            <button
                              onClick={() => deleteTrade(trade.id)}
                              className="p-1 text-[var(--foreground-muted)] hover:text-[var(--negative)] transition-colors"
                              title="Delete trade"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phase 6 Requirement: FAB Button (56px circle, bottom-right) */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[var(--accent)] text-black shadow-lg hover:scale-105 transition-all flex items-center justify-center z-40"
          title="Log New Trade"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Log Trade SlidePanel Drawer */}
        <SlidePanel
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Log New Trade Thesis"
          badge="Trade Record"
        >
          <form onSubmit={handleAddTrade} className="space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Ticker Symbol</label>
                <input
                  required
                  value={formData.ticker}
                  onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                  type="text"
                  placeholder="AAPL, NVDA..."
                  className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Direction</label>
                <div className="grid grid-cols-2 gap-1 h-10 bg-[var(--background-secondary)] rounded-[8px] p-1 border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Long' })}
                    className={cn("rounded-[6px] text-[10px] font-mono font-bold uppercase transition-all", formData.type === 'Long' ? 'bg-[var(--positive)] text-black' : 'text-[var(--foreground-muted)]')}
                  >
                    Long
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Short' })}
                    className={cn("rounded-[6px] text-[10px] font-mono font-bold uppercase transition-all", formData.type === 'Short' ? 'bg-[var(--negative)] text-white' : 'text-[var(--foreground-muted)]')}
                  >
                    Short
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Entry Price</label>
                <input
                  required
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                  type="number" step="any" placeholder="0.00"
                  className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Exit Price</label>
                <input
                  required
                  value={formData.exitPrice}
                  onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                  type="number" step="any" placeholder="0.00"
                  className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Shares</label>
                <input
                  required
                  value={formData.shares}
                  onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                  type="number" placeholder="100"
                  className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Setup Pattern</label>
                <select
                  value={formData.setup}
                  onChange={(e) => setFormData({ ...formData, setup: e.target.value })}
                  className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-sans text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
                >
                  <option>Breakout</option>
                  <option>Mean Reversion</option>
                  <option>Trend Follow</option>
                  <option>Scalp</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Psychology State</label>
                <select
                  value={formData.psychology}
                  onChange={(e) => setFormData({ ...formData, psychology: e.target.value })}
                  className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-sans text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
                >
                  <option>Neutral</option>
                  <option>Confident</option>
                  <option>Fearful (FOMO)</option>
                  <option>Anxious</option>
                  <option>Revenge Trading</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[var(--foreground-muted)]">Thesis & Execution Notes</label>
              <textarea
                value={formData.thesis}
                onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
                placeholder="What was the catalyst for this entry? Support/resistance levels..."
                className="w-full min-h-[90px] p-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-xs font-sans text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-10 text-xs">Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1 h-10 text-xs bg-[var(--accent)] text-black font-semibold">Log Trade Thesis</Button>
            </div>
          </form>
        </SlidePanel>

        {/* Trade Autopsy SlidePanel Drawer */}
        <SlidePanel
          isOpen={!!autopsyData || isAutopsying}
          onClose={() => setAutopsyData(null)}
          title="Trade Autopsy Report"
          badge="Post-Mortem AI"
        >
          {isAutopsying ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 text-[var(--accent)] animate-spin" />
              <p className="font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-wider">Reviewing trade execution & psychology...</p>
            </div>
          ) : autopsyData && (
            <div className="space-y-5 font-sans">
              <div className="flex items-center gap-4 pb-4 border-b border-[var(--border)]">
                <div className={cn(
                  "flex flex-col items-center justify-center h-16 w-16 rounded-[12px] border-2 shrink-0",
                  autopsyData.grade === 'A' || autopsyData.grade === 'B' ? 'border-[var(--positive)] bg-[var(--positive)]/10' : 'border-[var(--negative)] bg-[var(--negative)]/10'
                )}>
                  <span className={cn("text-2xl font-bebas", autopsyData.grade === 'A' || autopsyData.grade === 'B' ? 'text-[var(--positive)]' : 'text-[var(--negative)]')}>{autopsyData.grade}</span>
                  <span className="text-[9px] font-mono uppercase text-[var(--foreground-muted)]">Grade</span>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-semibold text-[var(--foreground)] italic leading-tight">&quot;{autopsyData.oneLiner}&quot;</h4>
                  <Badge variant={autopsyData.grade === 'A' ? 'success' : 'danger'}>{autopsyData.grade === 'A' ? 'Process Driven' : 'Outcome Driven'}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-[var(--positive)] flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Key Execution Strengths
                </h5>
                {autopsyData?.strengths?.map((str: string, i: number) => (
                  <div key={i} className="text-[12px] text-[var(--foreground)] leading-relaxed pl-2.5 border-l-2 border-[var(--positive)]">{str}</div>
                ))}
              </div>

              <div className="space-y-3">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-[var(--negative)] flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Execution Mistakes
                </h5>
                {autopsyData?.mistakes?.map((mis: string, i: number) => (
                  <div key={i} className="text-[12px] text-[var(--foreground)] leading-relaxed pl-2.5 border-l-2 border-[var(--negative)]">{mis}</div>
                ))}
              </div>

              <div className="bg-[var(--background-secondary)] p-3.5 rounded-[10px] border border-[var(--border)] space-y-1">
                <h5 className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5 text-[var(--ai)]" /> Psychological Lesson
                </h5>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">{autopsyData.lesson}</p>
              </div>

              <div className="bg-[var(--ai-dim)] p-3.5 rounded-[10px] border border-[var(--ai)]/30 space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--ai)]">Next Strategic Shift</p>
                <p className="text-xs font-semibold text-[var(--foreground)]">{autopsyData.nextShift}</p>
              </div>

              <p className="text-[11px] text-[var(--foreground-muted)] italic mt-2">
                AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
              </p>
            </div>
          )}
        </SlidePanel>
      </motion.div>
    </PageShell>
  );
}
