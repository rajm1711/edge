"use client";

import { Zap, ShieldCheck, ShieldAlert, Sparkles, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

interface AIResearchBriefProps {
  data: any;
  isLoading: boolean;
}

export function AIResearchBrief({ data, isLoading }: AIResearchBriefProps) {
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Card variant="premium" className="h-[400px] animate-shimmer">
        <div className="p-6 space-y-4">
            <div className="h-8 w-1/3 bg-white/5 rounded" />
            <div className="h-24 w-full bg-white/5 rounded" />
            <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-white/5 rounded" />
                <div className="h-32 bg-white/5 rounded" />
            </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const verdictStyles = {
    "STRONG BUY": "text-accent border-accent/30 bg-accent/5",
    "BUY": "text-accent border-accent/20 bg-accent/5",
    "HOLD": "text-yellow border-yellow/20 bg-yellow/5",
    "SELL": "text-red border-red/20 bg-red/5",
    "STRONG SELL": "text-red border-red/30 bg-red/5",
  };

  return (
    <Card variant="premium" className="border-accent/20 overflow-hidden">
      <div className="bg-accent/5 border-b border-accent/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="font-bebas text-xl tracking-wide uppercase text-text-primary">AI Research Brief</h3>
        </div>
        <div className={cn(
            "px-4 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-widest",
            verdictStyles[data.analystVerdict as keyof typeof verdictStyles]
        )}>
            Analyst Verdict: {data.analystVerdict}
        </div>
      </div>

      <CardContent className="p-6 space-y-8">
        <div>
          <p className="text-lg font-medium text-text-primary leading-snug italic">
            &quot;{data.oneLiner}&quot;
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase">
                    <span>AI Confidence</span>
                    <span className="text-accent">{data.confidenceScore}%</span>
                </div>
                <div className="h-1 w-full bg-bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${data.confidenceScore}%` }} />
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-text-muted uppercase">Price Target</span>
                <span className="text-sm font-bold text-text-primary">{data.priceTarget}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
            <h4 className="flex items-center gap-2 text-accent font-bebas tracking-wide mb-3">
                <TrendingUp className="h-4 w-4" /> Bull Case
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">{data.bullCase}</p>
            <div className="space-y-2">
                {data?.keyStrengths?.map((s: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-text-primary font-medium">
                        <ShieldCheck className="h-3 w-3 text-accent" /> {s}
                    </div>
                ))}
            </div>
          </div>

          <div className="bg-red/5 rounded-xl p-4 border border-red/10">
            <h4 className="flex items-center gap-2 text-red font-bebas tracking-wide mb-3">
                <TrendingDown className="h-4 w-4" /> Bear Case
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">{data.bearCase}</p>
            <div className="space-y-2">
                {data?.keyRisks?.map((r: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-text-primary font-medium">
                        <ShieldAlert className="h-3 w-3 text-red" /> {r}
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
            <div className="md:col-span-2">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                    <Zap className="h-3 w-3" /> Core Summary
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{data.summary}</p>
            </div>
            <div className="bg-bg-secondary rounded-xl p-4 border border-border">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                    <Target className="h-3 w-3" /> Potential Catalysts
                </h4>
                <div className="space-y-3">
                    {data?.catalysts?.map((c: string, i: number) => (
                        <div key={i} className="text-[11px] text-text-primary bg-bg-card p-2 rounded border border-border/50 font-medium">
                            {c}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";
