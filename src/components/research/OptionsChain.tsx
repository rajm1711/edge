"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Loader2, Info, ChevronDown } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface OptionsChainProps {
    ticker: string;
    options: any;
    isLoading: boolean;
}

export function OptionsChain({ ticker, options, isLoading }: OptionsChainProps) {
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);
    const [isExplaining, setIsExplaining] = useState(false);

    const explainOptions = async () => {
        if (!options) return;
        setIsExplaining(true);
        const response = await apiClient.optionsExplainerAI({
            ticker,
            options,
            currentPrice: 0 // Will be handled by prompt
        });
        if (response.success) {
            setAiAnalysis(response.data);
        }
        setIsExplaining(false);
    };

    if (isLoading) return <div className="h-64 animate-shimmer bg-bg-secondary rounded-xl" />;
    if (!options) return null;

    return (
        <div className="space-y-6">
            <Card variant="ai" className="border-[rgba(167,139,250,0.20)]">
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <h3 className="font-bebas text-lg tracking-wide uppercase">Options Chain Analyst</h3>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={explainOptions}
                        isLoading={isExplaining}
                        className="text-[10px] font-bold tracking-widest uppercase border-accent/20 text-accent hover:bg-accent/5 h-8"
                    >
                        AI Deep Analysis
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border">
                        {/* CALLS */}
                        <div className="p-4">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent mb-3">Calls (Bullish)</h4>
                            <div className="space-y-2">
                                {options.calls.slice(0, 4).map((call: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-bg-secondary/50 rounded-lg border border-border/30">
                                        <span className="font-mono font-bold">${call.strike}</span>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-text-muted uppercase">Bid/Ask</span>
                                                <span className="font-mono text-accent">{call.bid}/{call.ask}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-text-muted uppercase">IV</span>
                                                <span className="font-mono">{formatPercent(call.impliedVolatility)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PUTS */}
                        <div className="p-4">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-red mb-3">Puts (Bearish)</h4>
                            <div className="space-y-2">
                                {options.puts.slice(0, 4).map((put: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-bg-secondary/50 rounded-lg border border-border/30">
                                        <span className="font-mono font-bold">${put.strike}</span>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-text-muted uppercase">Bid/Ask</span>
                                                <span className="font-mono text-red">{put.bid}/{put.ask}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-text-muted uppercase">IV</span>
                                                <span className="font-mono">{formatPercent(put.impliedVolatility)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {aiAnalysis && (
                <Card variant="default" className="bg-bg-secondary/50 border-accent/20 animate-in fade-in slide-in-from-top-2 duration-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                            <Info className="h-4 w-4 text-accent" />
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-primary">Options Analysis Report</h4>
                            <Badge variant={aiAnalysis.sentiment === 'bullish' ? 'success' : 'danger'} className="ml-auto">
                                {aiAnalysis.sentiment}
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-bg-card p-3 rounded-xl border border-border/50">
                                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Market Expectations</p>
                                <p className="text-sm italic text-text-primary leading-relaxed">&quot;{aiAnalysis.marketExpectation}&quot;</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Key Strike Levels</p>
                                    <ul className="space-y-1">
                                        {aiAnalysis.keyLevels.map((l: string, i: number) => (
                                            <li key={i} className="text-xs text-text-secondary flex items-center gap-2">
                                                <div className="h-1 w-1 bg-accent rounded-full" /> {l}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Risk Assessment</p>
                                    <p className="text-xs text-text-secondary leading-tight">{aiAnalysis.riskAssessment}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Plain English Summary</p>
                                <p className="text-xs text-text-primary leading-relaxed">{aiAnalysis.plainEnglishSummary}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
