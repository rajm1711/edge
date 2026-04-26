"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface EarningsHistoryProps {
    ticker: string;
    data: any[];
}

export function EarningsHistory({ ticker, data }: EarningsHistoryProps) {
    const [aiPreview, setAiPreview] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    if (!data || data.length === 0) return null;

    const chartData = [...data].reverse().map(item => ({
        period: item.period,
        actual: item.actual,
        estimate: item.estimate,
        surprise: item.surprisePercent,
    }));

    const getAiPreview = async () => {
        setIsAnalyzing(true);
        const response = await apiClient.earningsPreviewAI(ticker, data);
        if (response.success) {
            setAiPreview(response.data);
        }
        setIsAnalyzing(false);
    };

    return (
        <div className="space-y-4">
            <Card variant="default">
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <h3 className="font-bebas text-lg tracking-wide uppercase text-text-primary">Earnings Performance</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={getAiPreview}
                        isLoading={isAnalyzing}
                        className="h-8 px-3 text-[10px] uppercase font-bold tracking-widest border-accent/20 text-accent hover:bg-accent/5"
                    >
                        <Sparkles className="h-3 w-3 mr-2" />
                        AI Preview
                    </Button>
                </CardHeader>
                <CardContent className="h-[250px] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.2} />
                            <XAxis
                                dataKey="period"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
                                tickFormatter={(val) => `$${val}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--bg-secondary)', opacity: 0.4 }}
                                contentStyle={{
                                    backgroundColor: 'var(--bg-card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontFamily: 'var(--font-jetbrains)'
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '9px', fontFamily: 'var(--font-jetbrains)', textTransform: 'uppercase', paddingBottom: '15px' }}
                            />
                            <Bar dataKey="actual" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Actual" />
                            <Bar dataKey="estimate" fill="var(--text-muted)" radius={[4, 4, 0, 0]} name="Estimate" opacity={0.5} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {aiPreview && (
                <Card variant="premium" className="bg-accent/5 border-accent/20 animate-in fade-in slide-in-from-top-2 duration-500 overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-primary">AI Earnings Strategy</h4>
                            <Badge variant={aiPreview.sentiment === 'bullish' ? 'success' : 'danger'} className="ml-auto uppercase text-[9px]">
                                {aiPreview.sentiment} Bias
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-text-primary leading-relaxed font-medium">&quot;{aiPreview.keySummary}&quot;</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase font-bold text-text-muted tracking-[0.2em]">Expected Volatility</p>
                                    <div className="p-2 bg-bg-card rounded-lg border border-border/50 text-xs font-mono font-bold text-accent">
                                        {aiPreview.expectedVolatility}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase font-bold text-text-muted tracking-[0.2em]">Whisper EPS</p>
                                    <div className="p-2 bg-bg-card rounded-lg border border-border/50 text-xs font-mono font-bold text-text-primary">
                                        {aiPreview.whisperNumber}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-bg-card/50 p-3 rounded-xl border border-border/30">
                                <p className="text-[9px] uppercase font-bold text-text-muted mb-2 tracking-[0.2em]">Likely Catalysts</p>
                                <ul className="space-y-1">
                                    {aiPreview?.catalysts?.slice(0, 3).map((c: string, i: number) => (
                                        <li key={i} className="text-[10px] text-text-secondary flex items-start gap-2">
                                            <div className="h-1 w-1 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
