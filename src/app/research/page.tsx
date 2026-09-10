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
      className="w-full max-w-[1500px] mx-auto space-y-8 pb-12 min-w-0"
    >
        {/* Search Section */}
        <div className="flex flex-col gap-4">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(inputValue)}
                    placeholder="Search stock ticker (e.g. NVDA, MSFT, AAPL)..."
                    className="w-full h-14 pl-12 pr-28 rounded-2xl bg-bg-secondary border border-border text-lg font-mono focus:border-accent focus:outline-none transition-all shadow-sm text-text-primary placeholder-text-muted"
                />
                <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleSearch(inputValue)}
                    className="absolute right-2 top-2 h-10 px-6 font-bebas text-lg tracking-widest uppercase"
                >
                    Research
                </Button>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-text-muted whitespace-nowrap">
                    <History className="h-3 w-3" /> Recent:
                </div>
                {recentSearches.map(s => (
                    <button 
                        key={s} 
                        onClick={() => handleSearch(s)}
                        className="px-3 py-1 bg-bg-secondary hover:bg-border rounded-full text-[10px] font-mono font-bold text-text-secondary transition-colors border border-border/50 uppercase"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        {!data && !isLoading && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-50">
                <div className="h-24 w-24 rounded-full bg-accent/5 flex items-center justify-center mb-6">
                    <Sparkles className="h-12 w-12 text-accent" />
                </div>
                <h2 className="font-bebas text-4xl tracking-tight text-text-primary">Institutional Terminal Ready</h2>
                <p className="text-sm font-mono text-text-muted max-w-sm mt-2">Enter a ticker symbol above to load Binance & Zerodha tier trading analytics.</p>
            </div>
        )}

        {isLoading ? (
            <div className="space-y-12">
                <div className="h-40 w-full animate-shimmer bg-bg-secondary rounded-2xl" />
                <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-bg-secondary rounded-xl animate-shimmer" />)}
                </div>
                <div className="h-96 w-full animate-shimmer bg-bg-secondary rounded-2xl" />
            </div>
        ) : data && (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* 1. Header & Quick Metrics */}
                <div className="space-y-6">
                    <StockHeader profile={data.profile} quote={data.quote} />
                    <FundamentalsGrid data={data.fundamentals} />
                </div>

                {/* 2. Binance & Zerodha Tier Pro Terminal Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle Columns (Pro Chart & Deep Research) */}
                    <div className="lg:col-span-2 space-y-8">
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
                        <section className="space-y-4">
                           <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-accent" />
                                <h3 className="font-bebas text-2xl tracking-wide uppercase text-text-primary">AI Market Observations</h3>
                           </div>
                           <TechnicalSignals data={data.signals} isLoading={false} />
                        </section>

                        {/* Earnings & Fundamentals Depth */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <EarningsHistory ticker={ticker} data={data.earnings} />
                            <InsiderTransactions transactions={data.insiders} isLoading={false} aiAnalysis={data.insiderAnalysis} />
                        </div>

                        {/* Options Volatility */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-accent" />
                                <h3 className="font-bebas text-2xl tracking-wide uppercase text-text-primary">Advanced Volatility</h3>
                            </div>
                            <OptionsChain ticker={ticker} options={data.options} isLoading={false} />
                        </section>
                    </div>

                    {/* Right Column (Order Desk, Order Book Depth & Intelligence) */}
                    <div className="space-y-8">
                        {/* Zerodha Kite Order Entry Desk */}
                        <OrderDeskWidget ticker={ticker} currentPrice={data.quote.currentPrice} />

                        {/* Binance Order Book Depth Visualizer */}
                        <OrderBookDepth ticker={ticker} currentPrice={data.quote.currentPrice} />

                        {/* Pre-Trade Coach */}
                        <PreTradeChecklist ticker={ticker} price={data.quote.currentPrice} />

                        {/* Catch-up News */}
                        <section className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bebas text-xl tracking-wide uppercase text-text-primary">Intelligence Feed</h3>
                                <Badge variant="outline" className="scale-75">{data.news.length} Items</Badge>
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
