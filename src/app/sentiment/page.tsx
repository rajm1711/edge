"use client";

import { useState } from "react";
import { Search, Sparkles, TrendingUp, TrendingDown, Info, MessageSquare, Gauge } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export default function SentimentPage() {
  const [ticker, setTicker] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleSearch = async (symbol: string) => {
    if (!symbol) return;
    setIsLoading(true);
    setTicker(symbol.toUpperCase());

    const newsRes = await apiClient.getNews(symbol);
    if (newsRes.success && newsRes.data) {
      const sentimentRes = await apiClient.sentimentAI(symbol, newsRes.data);
      if (sentimentRes.success) {
        setData(sentimentRes.data);
      }
    }
    setIsLoading(false);
  };

  const donutData = data
    ? [
        { name: "Bullish", value: data.overallScore || 65, color: "#00d084" },
        { name: "Bearish", value: 100 - (data.overallScore || 65), color: "#ff4d4d" },
      ]
    : [
        { name: "Bullish", value: 62, color: "#00d084" },
        { name: "Bearish", value: 38, color: "#ff4d4d" },
      ];

  return (
    <PageShell>
      <div className="w-full max-w-[1400px] mx-auto space-y-6 font-sans min-w-0">
        {/* Section 1 — Sticky Search Bar */}
        <div className="rounded-[12px] border border-border bg-bg-card p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(inputValue)}
              placeholder="Enter ticker symbol (e.g. NVDA, AAPL, TSLA)..."
              className="w-full h-11 pl-10 pr-4 rounded-[8px] bg-bg-secondary border border-border font-mono text-[13px] text-text-primary placeholder-text-muted focus:border-border-emphasis focus:outline-none transition-all"
            />
          </div>
          <Button
            onClick={() => handleSearch(inputValue)}
            disabled={!inputValue || isLoading}
            className="w-full md:w-auto h-11 px-6 bg-positive text-black font-medium hover:bg-positive/90 rounded-[8px] font-mono text-[12px] uppercase tracking-wider transition-colors shrink-0"
          >
            Analyze Sentiment
          </Button>
        </div>

        {!data && !isLoading && (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-40">
            <MessageSquare className="h-16 w-16 text-positive mb-4" />
            <h2 className="font-bebas text-[32px] uppercase tracking-wide text-text-primary">
              Enter Ticker Symbol for Sentiment Analysis
            </h2>
            <p className="text-[12px] font-mono text-text-muted max-w-sm mt-1">
              FinBERT NLP headline classification & Groq LLaMA 3.3 narrative intelligence synthesis.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-44 rounded-[12px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 rounded-[12px]" />
              <Skeleton className="h-64 rounded-[12px]" />
            </div>
          </div>
        ) : (
          data && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section 2 — Overall Sentiment 3-Column Summary Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Donut Chart */}
                <Card variant="terminal" className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-bebas text-[28px] text-positive leading-none">
                        {data.overallScore || 65}%
                      </span>
                      <span className="font-mono text-[9px] text-text-muted uppercase">BULLISH</span>
                    </div>
                  </div>
                  <Badge variant={data.sentimentType === "bullish" ? "bullish" : "bearish"} className="mt-3">
                    {data.sentimentType || "BULLISH"} INTENSITY
                  </Badge>
                </Card>

                {/* Column 2: Score Gauge */}
                <Card variant="terminal" className="flex flex-col justify-between p-6">
                  <div>
                    <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-2 flex items-center gap-1.5">
                      <Gauge className="h-4 w-4 text-positive" /> Sentiment Index Bar
                    </h4>
                    <div className="flex justify-between font-mono text-[12px] text-text-primary mb-2">
                      <span>Market Sentiment Score</span>
                      <span className="font-medium text-positive">{data.overallScore}/100</span>
                    </div>
                    <div className="h-3 w-full bg-border rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-positive transition-all duration-1000"
                        style={{ width: `${data.overallScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data?.topBuzzwords?.map((word: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-bg-secondary rounded-[4px] font-mono text-[10px] text-text-secondary border border-border">
                        #{word}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Column 3: Narrative & Market Impact */}
                <Card variant="terminal" className="flex flex-col justify-between p-6">
                  <div>
                    <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-ai-purple" /> AI Key Theme Summary
                    </h4>
                    <p className="text-[13px] text-text-primary italic leading-relaxed">
                      &quot;{data.summary}&quot;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between items-center text-[11px]">
                    <span className="text-text-muted">Market Impact:</span>
                    <Badge variant="high">HIGH VOLATILITY</Badge>
                  </div>
                </Card>
              </div>

              {/* Section 3 — News Cards Grid (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bullish Drivers */}
                <Card variant="terminal">
                  <CardHeader className="py-3 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-positive" />
                      <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Bullish News Catalysts</h3>
                    </div>
                    <Badge variant="bullish">BULLISH DRIVERS</Badge>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {data?.bullishKeyDrivers?.map((driver: string, i: number) => (
                      <div key={i} className="rounded-[8px] border-l-[3px] border-l-positive border-y border-r border-border bg-[rgba(0,208,132,0.04)] p-3.5 space-y-2">
                        <p className="text-[12px] text-text-primary leading-relaxed">{driver}</p>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-text-muted">FinBERT Classification</span>
                          <Badge variant="bullish">HIGH CONFIDENCE</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Bearish Drivers */}
                <Card variant="terminal">
                  <CardHeader className="py-3 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-negative" />
                      <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Bearish Risk Headwinds</h3>
                    </div>
                    <Badge variant="bearish">BEARISH RISKS</Badge>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {data?.bearishKeyDrivers?.map((driver: string, i: number) => (
                      <div key={i} className="rounded-[8px] border-l-[3px] border-l-negative border-y border-r border-border bg-[rgba(255,77,77,0.04)] p-3.5 space-y-2">
                        <p className="text-[12px] text-text-primary leading-relaxed">{driver}</p>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-text-muted">FinBERT Classification</span>
                          <Badge variant="bearish">HIGH RISK</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Analyst Perspective Banner */}
              <div className="rounded-[12px] border-l-[3px] border-l-ai-purple border-y border-r border-border bg-ai-purple-dim p-6 font-sans">
                <div className="flex items-start gap-4">
                  <Info className="h-5 w-5 text-ai-purple shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-bebas text-[20px] tracking-wide uppercase text-text-primary">Analyst Terminal Synthesis</h4>
                    <p className="text-[13px] text-text-secondary leading-relaxed">{data.analystOpinion}</p>
                    <div className="pt-2 flex items-center gap-3">
                      <span className="font-sans text-[11px] text-text-muted uppercase">Tomorrow&apos;s Forecast:</span>
                      <Badge variant="ai">{data.tomorrowOutlook}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </PageShell>
  );
}

