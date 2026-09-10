"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { StockHeader } from "@/components/research/StockHeader";
import { FundamentalsGrid } from "@/components/research/FundamentalsGrid";
import { AIResearchBrief } from "@/components/research/AIResearchBrief";
import { TechnicalSignals } from "@/components/research/TechnicalSignals";
import { EarningsHistory } from "@/components/research/EarningsHistory";
import { InsiderTransactions } from "@/components/research/InsiderTransactions";
import { PreTradeChecklist } from "@/components/research/PreTradeChecklist";
import { NewsSection } from "@/components/research/NewsSection";
import { OptionsChain } from "@/components/research/OptionsChain";
import { TradingViewTerminalChart } from "@/components/terminal/TradingViewTerminalChart";
import { OrderBookDepth } from "@/components/terminal/OrderBookDepth";
import { OrderDeskWidget } from "@/components/terminal/OrderDeskWidget";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, History, Sparkles, TrendingUp, AlertCircle, RefreshCw, Activity, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ResearchContent() {
  const searchParams = useSearchParams();
  const [ticker, setTicker] = useState(searchParams.get("ticker")?.toUpperCase() || "");
  const [inputValue, setInputValue] = useState(ticker);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("edgeiq_recent_searches") || "[]");
    setRecentSearches(saved);
    if (ticker) {
      handleSearch(ticker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  const handleSearch = async (symbol: string) => {
    if (!symbol) return;
    setIsLoading(true);
    setTicker(symbol.toUpperCase());
    
    // Save to recent
    const updated = [symbol.toUpperCase(), ...recentSearches.filter(s => s !== symbol.toUpperCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("edgeiq_recent_searches", JSON.stringify(updated));

    const [quote, profile, fundamentals, signals, news, earnings, insiders, options] = await Promise.all([
      apiClient.getQuote(symbol),
      apiClient.getProfile(symbol),
      apiClient.getFundamentals(symbol),
      apiClient.detectSignalsAI(symbol),
      apiClient.getNews(symbol),
      apiClient.getEarnings(symbol),
      apiClient.getInsiders(symbol),
      apiClient.getOptions(symbol),
    ]);

    const res: any = {
      quote: quote.data,
      profile: profile.data,
      fundamentals: fundamentals.data,
      signals: signals.data,
      news: news.data,
      earnings: earnings.data,
      insiders: insiders.data,
      options: options.data,
    };

    // Subsequent AI calls
    const [researchBrief, insiderAnalysis] = await Promise.all([
        apiClient.researchStockAI(symbol, res),
        apiClient.analyzeInsidersAI(symbol, insiders.data || []),
    ]);

    res.researchBrief = researchBrief.data;
    res.insiderAnalysis = insiderAnalysis.data;

    setData(res);
    setIsLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-[1500px] mx-auto space-y-6 pb-12 min-w-0"
    >
        {/* Search Section */}
        <div className="flex flex-col gap-3">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--foreground-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(inputValue)}
                    placeholder="Search stock ticker (e.g. NVDA, MSFT, AAPL)..."
                    className="w-full h-14 pl-12 pr-32 rounded-[10px] bg-[var(--background-secondary)] border border-[var(--border)] text-base font-mono focus:border-[var(--accent)] focus:outline-none transition-all text-[var(--foreground)] placeholder-[var(--foreground-muted)]"
                />
                <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleSearch(inputValue)}
                    className="absolute right-2 top-2 h-10 px-6 font-sans font-medium text-sm tracking-wide uppercase bg-[var(--accent)] text-black hover:opacity-90"
                >
                    Research
                </Button>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <div className="flex items-center gap-1 text-[11px] font-mono uppercase text-[var(--foreground-muted)] whitespace-nowrap">
                    <History className="h-3 w-3" /> Recent:
                </div>
                {recentSearches.map(s => (
                    <button 
                        key={s} 
                        onClick={() => handleSearch(s)}
                        className="px-2.5 py-1 bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)] rounded-[6px] text-[11px] font-mono text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors border border-[var(--border)] uppercase"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        {!data && !isLoading && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-70">
                <div className="h-20 w-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-5">
                    <Sparkles className="h-10 w-10 text-[var(--accent)]" />
                </div>
                <h2 className="font-sans text-2xl font-semibold tracking-tight text-[var(--foreground)]">Institutional Terminal Ready</h2>
                <p className="text-xs font-mono text-[var(--foreground-muted)] max-w-sm mt-2">Enter a ticker symbol above to load Binance & Zerodha tier trading analytics.</p>
            </div>
        )}

        {isLoading ? (
            <div className="space-y-6">
                <div className="h-36 w-full animate-shimmer bg-[var(--background-secondary)] rounded-[16px]" />
                <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-20 bg-[var(--background-secondary)] rounded-[16px] animate-shimmer" />)}
                </div>
                <div className="h-96 w-full animate-shimmer bg-[var(--background-secondary)] rounded-[16px]" />
            </div>
        ) : data && (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* 1. Header & Quick Metrics */}
                <div className="space-y-6">
                    <StockHeader profile={data.profile} quote={data.quote} />
                    <FundamentalsGrid data={data.fundamentals} />
                </div>

                {/* 2. Binance & Zerodha Tier Pro Terminal Grid (65/35 split) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left & Middle Columns (65% -> col-span-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* TradingView Interactive Chart Terminal */}
                        <TradingViewTerminalChart
                          ticker={ticker}
                          currentPrice={data.quote.currentPrice}
                          change={data.quote.change}
                          changePercent={data.quote.changePercent}
                          high24h={data.quote.high}
                          low24h={data.quote.low}
                        />

                        {/* AI Research Brief */}
                        <section>
                            <AIResearchBrief data={data.researchBrief} isLoading={false} />
                        </section>

                        {/* AI Market Observations */}
                        <section className="space-y-3">
                           <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
                                <h3 className="font-sans text-base font-semibold uppercase tracking-wider text-[var(--foreground)]">AI Market Observations</h3>
                           </div>
                           <TechnicalSignals data={data.signals} isLoading={false} />
                        </section>

                        {/* Earnings & Fundamentals Depth */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <EarningsHistory ticker={ticker} data={data.earnings} />
                            <InsiderTransactions transactions={data.insiders} isLoading={false} aiAnalysis={data.insiderAnalysis} />
                        </div>

                        {/* Options Volatility */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-[var(--accent)]" />
                                <h3 className="font-sans text-base font-semibold uppercase tracking-wider text-[var(--foreground)]">Advanced Volatility</h3>
                            </div>
                            <OptionsChain ticker={ticker} options={data.options} isLoading={false} />
                        </section>
                    </div>

                    {/* Right Column (35% -> col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Zerodha Kite Order Entry Desk */}
                        <OrderDeskWidget ticker={ticker} currentPrice={data.quote.currentPrice} />

                        {/* Binance Order Book Depth Visualizer */}
                        <OrderBookDepth ticker={ticker} currentPrice={data.quote.currentPrice} />

                        {/* Pre-Trade Coach */}
                        <PreTradeChecklist ticker={ticker} price={data.quote.currentPrice} />

                        {/* Intelligence Feed */}
                        <section className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-sans text-base font-semibold uppercase tracking-wider text-[var(--foreground)]">Intelligence Feed</h3>
                                <Badge variant="outline" className="text-[10px]">{data.news.length} Items</Badge>
                            </div>
                            <NewsSection news={data.news} isLoading={false} />
                        </section>
                    </div>
                </div>
            </div>
        )}
    </motion.div>
  );
}

export default function ResearchPage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="p-8 text-center text-text-muted font-mono animate-pulse">Initializing Institutional Terminal...</div>}>
        <ResearchContent />
      </Suspense>
    </PageShell>
  );
}
