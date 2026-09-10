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

    const list = Array.isArray(data) ? data : Array.isArray((data as any)?.earnings) ? (data as any).earnings : [];
    if (!list || list.length === 0) return null;

    const chartData = [...list].reverse().map(item => ({
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
                <CardHeader className="py-3.5 flex flex-row items-center justify-between">
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Earnings Performance</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={getAiPreview}
                        isLoading={isAnalyzing}
                        className="h-8 px-3 text-[10px] uppercase font-mono tracking-wider border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/10"
                    >
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        AI Preview
                    </Button>
                </CardHeader>
                <CardContent className="h-[250px] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis
                                dataKey="period"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "var(--foreground-muted)", fontFamily: "var(--font-jetbrains)" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "var(--foreground-muted)", fontFamily: "var(--font-jetbrains)" }}
                                tickFormatter={(val) => `$${val}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--background-secondary)', opacity: 0.4 }}
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    color: 'var(--foreground)',
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
                            <Bar dataKey="estimate" fill="var(--foreground-muted)" radius={[4, 4, 0, 0]} name="Estimate" opacity={0.4} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {aiPreview && (
                <Card variant="ai" className="bg-[rgba(167,139,250,0.04)] border-[rgba(167,139,250,0.20)] animate-in fade-in slide-in-from-top-2 duration-500 overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-primary">AI Earnings Strategy</h4>
                            <Badge variant={aiPreview.sentiment === 'bullish' ? 'success' : 'danger'} className="ml-auto uppercase text-[9px]">
                                {aiPreview.sentiment} Bias
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-[var(--foreground)] leading-relaxed font-medium">&quot;{aiPreview.keySummary}&quot;</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase font-bold text-[var(--foreground-muted)] tracking-[0.2em]">Expected Volatility</p>
                                    <div className="p-2 bg-[var(--card)] rounded-lg border border-[var(--border)]/50 text-xs font-mono font-bold text-[var(--accent)]">
                                        {aiPreview.expectedVolatility}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] uppercase font-bold text-[var(--foreground-muted)] tracking-[0.2em]">Whisper EPS</p>
                                    <div className="p-2 bg-[var(--card)] rounded-lg border border-[var(--border)]/50 text-xs font-mono font-bold text-[var(--foreground)]">
                                        {aiPreview.whisperNumber}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--card)]/50 p-3 rounded-xl border border-[var(--border)]/30">
                                <p className="text-[9px] uppercase font-bold text-[var(--foreground-muted)] mb-2 tracking-[0.2em]">Likely Catalysts</p>
                                <ul className="space-y-1">
                                    {aiPreview?.catalysts?.slice(0, 3).map((c: string, i: number) => (
                                        <li key={i} className="text-[10px] text-[var(--foreground-muted)] flex items-start gap-2">
                                            <div className="h-1 w-1 bg-[var(--accent)] rounded-full mt-1.5 flex-shrink-0" />
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
