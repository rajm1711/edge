"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, TrendingUp, TrendingDown, Minus, Info, MessageSquare, Gauge } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

    return (
        <PageShell>
            <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="font-bebas text-5xl tracking-tight text-text-primary">Sentiment Terminal</h1>
                        <p className="text-text-muted mt-1 uppercase font-mono text-[10px] tracking-[0.3em]">AI-Powered Emotional Intelligence</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(inputValue)}
                            placeholder="Ticker symbol..."
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-bg-secondary border border-border text-xs focus:border-accent focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {!data && !isLoading && (
                    <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-40">
                        <MessageSquare className="h-16 w-16 text-accent mb-4" />
                        <h2 className="font-bebas text-3xl uppercase tracking-tighter">Enter a ticker to start analysis</h2>
                        <p className="text-xs font-mono text-text-muted max-w-xs mt-1 italic">Analyzing 7-day social and news headlines for real-time market bias.</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Skeleton className="h-44 rounded-2xl" />
                            <Skeleton className="h-44 md:col-span-2 rounded-2xl" />
                        </div>
                        <Skeleton className="h-96 rounded-2xl" />
                    </div>
                ) : data && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Score Card */}
                            <Card variant="premium" className="relative overflow-hidden border-accent/20">
                                <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full">
                                    <Gauge className="h-10 w-10 text-accent mb-4" />
                                    <h3 className="font-bebas text-lg uppercase tracking-widest text-text-muted mb-1">Sentiment Score</h3>
                                    <div className="text-6xl font-bebas text-accent tracking-tighter">{data.overallScore}%</div>
                                    <div className="mt-2">
                                        <Badge variant={data.sentimentType === 'bullish' ? 'success' : 'danger'}>
                                            {data.sentimentType} Overload
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Insight */}
                            <Card variant="default" className="md:col-span-2">
                                <CardHeader className="py-3 flex flex-row items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-accent" />
                                    <h3 className="font-bebas text-lg tracking-wide uppercase">AI Insight Overview</h3>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-lg font-medium text-text-primary italic leading-relaxed">
                                        &quot;{data.summary}&quot;
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {data?.topBuzzwords?.map((word: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-bg-secondary rounded-full text-[10px] font-mono font-bold text-text-secondary border border-border/50 uppercase">
                                                #{word}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Key Drivers */}
                            <Card variant="default">
                                <CardHeader className="py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Bullish Drivers</CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {data?.bullishKeyDrivers?.map((driver: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 text-xs text-text-secondary bg-accent/5 p-3 rounded-xl border border-accent/10">
                                            <TrendingUp className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                            {driver}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card variant="default">
                                <CardHeader className="py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Bearish Drivers</CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {data?.bearishKeyDrivers?.map((driver: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 text-xs text-text-secondary bg-red/5 p-3 rounded-xl border border-red/10">
                                            <TrendingDown className="h-4 w-4 text-red flex-shrink-0 mt-0.5" />
                                            {driver}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Analyst Note */}
                        <Card variant="premium" className="bg-bg-secondary/50 border-border/50">
                            <CardContent className="p-6 flex items-start gap-4">
                                <Info className="h-6 w-6 text-accent flex-shrink-0" />
                                <div>
                                    <h4 className="font-bebas text-lg tracking-widest text-text-primary uppercase mb-1">Analyst Perspective</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed">{data.analystOpinion}</p>
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 inline-block">
                                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted mr-2">Tomorrow&apos;s Prediction:</span>
                                        <span className="text-xs font-bold text-accent">{data.tomorrowOutlook}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </PageShell>
    );
}
