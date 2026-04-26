"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2, Search, Filter, Sparkles, TrendingUp, TrendingDown, Clock, Brain, AlertCircle, X, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { apiClient } from "@/lib/api-client";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { format } from "date-fns";

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

    return (
        <PageShell>
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="font-bebas text-5xl tracking-tight text-text-primary">Trade Journal</h1>
                        <p className="text-text-muted mt-1 uppercase font-mono text-[10px] tracking-[0.3em]">Performance Psychology Record</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="md" onClick={getSummary} isLoading={isSummarizing} className="bg-bg-secondary border-border h-[44px]">
                            <Brain className="h-4 w-4 mr-2 text-accent" />
                            AI Psychology Summary
                        </Button>
                        <Button variant="primary" size="md" onClick={() => setShowAddModal(true)} className="h-[44px] px-6">
                            <Plus className="h-4 w-4 mr-2" />
                            Log New Trade
                        </Button>
                    </div>
                </div>

                {summaryData && (
                    <Card variant="premium" className="bg-accent/5 border-accent/20 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="h-24 w-24 text-accent" />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex justify-between flex-wrap gap-8">
                                <div className="flex-1 min-w-[300px]">
                                    <h3 className="font-bebas text-2xl tracking-wide uppercase text-text-primary mb-4 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-accent" /> Performance DNA Analysis
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <span className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-widest">Master Setup</span>
                                            <p className="text-lg font-bebas text-accent uppercase tracking-wide">{summaryData.masterSetup}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-widest">Main Weakness</span>
                                            <p className="text-lg font-bebas text-red uppercase tracking-wide">{summaryData.mainWeakness}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-text-primary italic border-l-2 border-accent/30 pl-4 py-2 leading-relaxed">
                                        &quot;{summaryData.performanceAnalogy}&quot;
                                    </p>
                                </div>

                                <div className="flex-1 min-w-[300px] space-y-4">
                                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Strategic Homework</h4>
                                    <ul className="space-y-2">
                                        {summaryData?.homework?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-xs text-text-secondary bg-bg-card p-2 rounded-lg border border-border/50">
                                                <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                        <div className="bg-bg-card/50 p-3 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSummaryData(null)} className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Dismiss</Button>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <Card variant="default">
                            <CardHeader className="py-3">
                                <h3 className="font-bebas text-lg tracking-wide uppercase">Stats Summary</h3>
                            </CardHeader>
                            <CardContent className="p-4 space-y-6">
                                <div className="flex justify-between items-center text-center">
                                    <div className="flex-1">
                                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted">TOTAL</span>
                                        <p className="text-2xl font-bold font-mono">{trades.length}</p>
                                    </div>
                                    <div className="w-px h-8 bg-border" />
                                    <div className="flex-1">
                                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted">WIN RATE</span>
                                        <p className="text-2xl font-bold font-mono text-accent">
                                            {trades.length > 0 ? ((trades.filter(t => t.outcome === 'Won').length / trades.length) * 100).toFixed(0) : 0}%
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted">NET P&L</span>
                                        <span className={cn("font-mono font-bold", trades.reduce((a, b) => a + b.pnl, 0) >= 0 ? 'text-accent' : 'text-red')}>
                                            {formatCurrency(trades.reduce((a, b) => a + b.pnl, 0))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted">AVG WIN %</span>
                                        <span className="font-mono font-bold text-accent">
                                            {formatPercent(trades.filter(t => t.pnl > 0).reduce((a, b) => a + b.pnlPercent, 0) / (trades.filter(t => t.pnl > 0).length || 1))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted">AVG LOSS %</span>
                                        <span className="font-mono font-bold text-red">
                                            {formatPercent(trades.filter(t => t.pnl < 0).reduce((a, b) => a + b.pnlPercent, 0) / (trades.filter(t => t.pnl < 0).length || 1))}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trades List */}
                    <div className="lg:col-span-3 space-y-4">
                        {trades.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center bg-bg-secondary/30 border border-dashed border-border rounded-2xl opacity-50">
                                <BookOpen className="h-10 w-10 text-text-muted mb-4" />
                                <h3 className="font-bebas text-2xl uppercase tracking-tighter text-text-primary">No trades logged yet</h3>
                                <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-widest">Start your journey by logging your first thesis.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {trades.map((trade) => (
                                    <Card key={trade.id} variant="default" className="group hover:border-accent/30 transition-all">
                                        <CardContent className="p-4 flex flex-col md:flex-row gap-6 items-center">
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className={cn(
                                                    "flex flex-col items-center justify-center h-14 w-14 rounded-xl font-bold font-mono text-xs uppercase",
                                                    trade.outcome === 'Won' ? 'bg-accent/10 text-accent border border-accent/20' :
                                                        trade.outcome === 'Lost' ? 'bg-red/10 text-red border border-red/20' : 'bg-bg-secondary text-text-muted border border-border'
                                                )}>
                                                    {trade.outcome}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-base text-text-primary leading-none uppercase tracking-tight">{trade.ticker}</span>
                                                        <Badge variant="outline" className={cn("text-[9px] scale-90", trade.type === 'Long' ? 'text-accent' : 'text-red')}>
                                                            {trade.type}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-[10px] text-text-muted font-mono uppercase mt-1 tracking-widest">{trade.date}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-mono font-bold uppercase text-text-muted">Entry / Exit</span>
                                                    <span className="text-xs font-mono font-bold text-text-secondary mt-1 overflow-hidden truncate">
                                                        {formatCurrency(trade.entryPrice)} / {formatCurrency(trade.exitPrice)}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-mono font-bold uppercase text-text-muted">Return</span>
                                                    <span className={cn("text-sm font-mono font-bold mt-1", trade.pnl >= 0 ? 'text-accent' : 'text-red')}>
                                                        {formatCurrency(trade.pnl)} ({formatPercent(trade.pnlPercent)})
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-mono font-bold uppercase text-text-muted">Setup</span>
                                                    <Badge variant="outline" className="mt-1 w-fit uppercase text-[9px]">{trade.setup}</Badge>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-mono font-bold uppercase text-text-muted">Psychology</span>
                                                    <span className="text-xs font-medium text-text-primary mt-1">{trade.psychology}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 w-full md:w-auto">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => runAutopsy(trade)}
                                                    className="font-bebas text-md tracking-wider uppercase h-10 px-4 group-hover:bg-accent group-hover:text-bg-sidebar transition-all"
                                                >
                                                    Autopsy
                                                </Button>
                                                <button
                                                    onClick={() => deleteTrade(trade.id)}
                                                    className="p-2.5 text-text-muted hover:text-red hover:bg-red/5 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Trade Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <Card className="w-full max-w-xl bg-bg-card border-accent/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="h-1 bg-accent w-full" />
                            <form onSubmit={handleAddTrade}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="font-bebas text-3xl tracking-wide uppercase text-text-primary">Log New Thesis</h2>
                                            <p className="text-[10px] text-text-muted font-mono uppercase tracking-[0.2em]">Add trade to permanent analysis record</p>
                                        </div>
                                        <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-bg-secondary rounded-full">
                                            <X className="h-5 w-5 text-text-muted" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono font-bold uppercase text-text-muted ml-1">Ticker</label>
                                                <input
                                                    required
                                                    value={formData.ticker}
                                                    onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                                                    type="text"
                                                    placeholder="AAPL, NVDA..."
                                                    className="w-full h-11 px-4 rounded-xl bg-bg-secondary border border-border text-sm font-mono focus:border-accent focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono font-bold uppercase text-text-muted ml-1">Type</label>
                                                <div className="flex h-11 bg-bg-secondary rounded-xl p-1 border border-border">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, type: 'Long' })}
                                                        className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase transition-all", formData.type === 'Long' ? 'bg-accent text-bg-sidebar shadow-sm' : 'text-text-muted hover:text-text-primary')}
                                                    >
                                                        Long
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, type: 'Short' })}
                                                        className={cn("flex-1 rounded-lg text-[10px] font-bold uppercase transition-all", formData.type === 'Short' ? 'bg-red text-white shadow-sm' : 'text-text-muted hover:text-text-primary')}
                                                    >
                                                        Short
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono font-bold uppercase text-text-muted ml-1">Entry Price</label>
                                                <input
                                                    required
                                                    value={formData.entryPrice}
                                                    onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                                                    type="number" step="any" placeholder="0.00"
                                                    className="w-full h-11 px-4 rounded-xl bg-bg-secondary border border-border text-sm font-mono focus:border-accent focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono font-bold uppercase text-text-muted ml-1">Exit Price</label>
                                                <input
                                                    required
                                                    value={formData.exitPrice}
                                                    onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                                                    type="number" step="any" placeholder="0.00"
                                                    className="w-full h-11 px-4 rounded-xl bg-bg-secondary border border-border text-sm font-mono focus:border-accent focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-mono font-bold uppercase text-text-muted ml-1">Shares</label>
                                                <input
                                                    required
                                                    value={formData.shares}
                                                    onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                                                    type="number" placeholder="100"
                                                    className="w-full h-11 px-4 rounded-xl bg-bg-secondary border border-border text-sm font-mono focus:border-accent focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-mono font-bold uppercase text-text-muted ml-1">Trade Setup & Psychology</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <select
                                                    value={formData.setup}
                                                    onChange={(e) => setFormData({ ...formData, setup: e.target.value })}
                                                    className="h-11 px-4 rounded-xl bg-bg-secondary border border-border text-xs focus:border-accent focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    <option>Breakout</option>
                                                    <option>Mean Reversion</option>
                                                    <option>Trend Follow</option>
                                                    <option>Scalp</option>
                                                </select>
                                                <select
                                                    value={formData.psychology}
                                                    onChange={(e) => setFormData({ ...formData, psychology: e.target.value })}
                                                    className="h-11 px-4 rounded-xl bg-bg-secondary border border-border text-xs focus:border-accent focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    <option>Neutral</option>
                                                    <option>Confident</option>
                                                    <option>Fearful (FOMO)</option>
                                                    <option>Anxious</option>
                                                    <option>Revenge Trading</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-mono font-bold uppercase text-text-muted ml-1">Thesis Note</label>
                                            <textarea
                                                value={formData.thesis}
                                                onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
                                                placeholder="What was the reason for this trade? What did you see?"
                                                className="w-full min-h-[80px] p-4 rounded-xl bg-bg-secondary border border-border text-xs focus:border-accent focus:outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-bg-secondary/50 border-t border-border flex gap-3">
                                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
                                    <Button type="submit" variant="primary" className="flex-1">Log Thesis</Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}

                {/* Autopsy Modal */}
                {autopsyData || isAutopsying ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <Card className="w-full max-w-2xl bg-bg-card border-accent/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="h-1 bg-accent w-full" />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="font-bebas text-3xl tracking-wide uppercase text-text-primary">Trade Autopsy</h2>
                                        <p className="text-[10px] text-text-muted font-mono uppercase tracking-[0.2em]">Post-mortem AI analysis Report</p>
                                    </div>
                                    <button onClick={() => setAutopsyData(null)} className="p-2 hover:bg-bg-secondary rounded-full">
                                        <X className="h-5 w-5 text-text-muted" />
                                    </button>
                                </div>

                                {isAutopsying ? (
                                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="h-10 w-10 text-accent animate-spin" />
                                        <p className="font-mono text-xs text-text-muted animate-pulse uppercase tracking-[0.3em]">AI Analyst is reviewing trade logs...</p>
                                    </div>
                                ) : autopsyData && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6 pb-6 border-b border-border">
                                            <div className={cn(
                                                "flex flex-col items-center justify-center h-20 w-20 rounded-2xl border-4",
                                                autopsyData.grade === 'A' || autopsyData.grade === 'B' ? 'border-accent bg-accent/5' : 'border-red bg-red/5'
                                            )}>
                                                <span className={cn("text-3xl font-bebas", autopsyData.grade === 'A' || autopsyData.grade === 'B' ? 'text-accent' : 'text-red')}>{autopsyData.grade}</span>
                                                <span className="text-[10px] font-mono font-bold text-text-muted uppercase -mt-1 tracking-tighter">Grade</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <h4 className="text-sm font-bold text-text-primary italic leading-tight">&quot;{autopsyData.oneLiner}&quot;</h4>
                                                <div className="flex gap-2">
                                                    <Badge variant={autopsyData.grade === 'A' ? 'success' : 'danger'}>{autopsyData.grade === 'A' ? 'Process Driven' : 'Outcome Driven'}</Badge>
                                                    <Badge variant="outline" className="font-mono uppercase text-[9px]">ID: {Math.random().toString(36).substring(7)}</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                                                    <CheckCircle2 className="h-3 w-3" /> Strengths
                                                </h5>
                                                {autopsyData?.strengths?.map((str: string, i: number) => (
                                                    <div key={i} className="text-[11px] text-text-secondary leading-tight pl-2 border-l border-accent/30">{str}</div>
                                                ))}
                                            </div>
                                            <div className="space-y-3">
                                                <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-red flex items-center gap-2">
                                                    <AlertCircle className="h-3 w-3" /> Mistakes
                                                </h5>
                                                {autopsyData?.mistakes?.map((mis: string, i: number) => (
                                                    <div key={i} className="text-[11px] text-text-secondary leading-tight pl-2 border-l border-red/30">{mis}</div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-bg-secondary p-4 rounded-xl border border-border">
                                            <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
                                                <Brain className="h-3.5 w-3.5 text-accent" /> Psychological Lesson
                                            </h5>
                                            <p className="text-xs text-text-primary leading-relaxed">{autopsyData.lesson}</p>
                                        </div>

                                        <Card variant="premium" className="bg-accent/5 border-accent/20">
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-accent rounded-lg text-bg-sidebar">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-text-muted uppercase">Next Strategic Shift</p>
                                                        <p className="text-xs font-bold text-text-primary">{autopsyData.nextShift}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                ) : null}
            </div>
        </PageShell>
    );
}

