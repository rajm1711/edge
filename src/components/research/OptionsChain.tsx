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

    if (isLoading) return <div className="h-64 animate-shimmer bg-[var(--background-secondary)] rounded-[16px]" />;
    if (!options) return null;

    return (
        <div className="space-y-4">
            <Card variant="ai" className="border-[var(--ai)]/30 rounded-[16px]">
                <CardHeader className="py-3.5 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[var(--ai)]" />
                        <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Options Chain Analyst</h3>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={explainOptions}
                        isLoading={isExplaining}
                        className="text-[10px] font-mono tracking-wider uppercase border-[var(--ai)]/30 text-[var(--ai)] hover:bg-[var(--ai)]/10 h-8"
                    >
                        AI Deep Analysis
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-[var(--border)]">
                        {/* CALLS */}
                        <div className="p-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--positive)] mb-3">Calls (Bullish)</h4>
                            <div className="space-y-2">
                                {options.calls.slice(0, 4).map((call: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-[var(--background-secondary)] rounded-[8px] border border-[var(--border)]">
                                        <span className="font-mono font-medium text-[var(--foreground)]">${call.strike}</span>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-[var(--foreground-muted)] uppercase">Bid/Ask</span>
                                                <span className="font-mono text-[var(--positive)]">{call.bid}/{call.ask}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-[var(--foreground-muted)] uppercase">IV</span>
                                                <span className="font-mono text-[var(--foreground)]">{formatPercent(call.impliedVolatility)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PUTS */}
                        <div className="p-4">
                            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--negative)] mb-3">Puts (Bearish)</h4>
                            <div className="space-y-2">
                                {options.puts.slice(0, 4).map((put: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-[var(--background-secondary)] rounded-[8px] border border-[var(--border)]">
                                        <span className="font-mono font-medium text-[var(--foreground)]">${put.strike}</span>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-[var(--foreground-muted)] uppercase">Bid/Ask</span>
                                                <span className="font-mono text-[var(--negative)]">{put.bid}/{put.ask}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-[var(--foreground-muted)] uppercase">IV</span>
                                                <span className="font-mono text-[var(--foreground)]">{formatPercent(put.impliedVolatility)}</span>
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
                <Card variant="default" className="bg-[var(--background-secondary)] border-[var(--accent)]/30 rounded-[16px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
                            <Info className="h-4 w-4 text-[var(--accent)]" />
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">Options Analysis Report</h4>
                            <Badge variant={aiAnalysis.sentiment === 'bullish' ? 'success' : 'danger'} className="ml-auto">
                                {aiAnalysis.sentiment}
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-[var(--card)] p-3 rounded-[12px] border border-[var(--border)]">
                                <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] mb-1">Market Expectations</p>
                                <p className="text-xs italic text-[var(--foreground)] leading-relaxed">&quot;{aiAnalysis.marketExpectation}&quot;</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] mb-1">Key Strike Levels</p>
                                    <ul className="space-y-1">
                                        {aiAnalysis.keyLevels.map((l: string, i: number) => (
                                            <li key={i} className="text-xs text-[var(--foreground-muted)] flex items-center gap-2">
                                                <div className="h-1 w-1 bg-[var(--accent)] rounded-full" /> {l}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] mb-1">Risk Assessment</p>
                                    <p className="text-xs text-[var(--foreground-muted)] leading-tight">{aiAnalysis.riskAssessment}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] mb-1">Plain English Summary</p>
                                <p className="text-xs text-[var(--foreground)] leading-relaxed">{aiAnalysis.plainEnglishSummary}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
