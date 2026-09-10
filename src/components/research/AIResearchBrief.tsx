"use client";

import { Zap, ShieldCheck, ShieldAlert, Sparkles, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AIResearchBriefProps {
  data: any;
  isLoading: boolean;
}

export function AIResearchBrief({ data, isLoading }: AIResearchBriefProps) {
  if (isLoading) {
    return (
      <div className="h-[360px] w-full rounded-[12px] border-l-[3px] border-l-ai-purple border-y border-r border-border bg-ai-purple-dim p-6 font-sans">
        <div className="flex items-center gap-2 text-ai-purple">
          <Zap className="h-4 w-4 animate-bounce" />
          <span className="font-mono text-[11px] uppercase tracking-wider font-medium">
            AI Research Assistant is compiling ticker report...
          </span>
        </div>
        <Skeleton className="mt-4 h-12 w-full rounded-[6px]" />
        <Skeleton className="mt-4 h-36 w-full rounded-[6px]" />
      </div>
    );
  }

  if (!data) return null;

  const verdict = (data.analyticalOutlook || data.analystVerdict || "NEUTRAL").toUpperCase();

  const getVerdictStyles = (v: string) => {
    switch (v) {
      case "STRONGLY BULLISH":
      case "STRONG BUY":
        return "bg-[#00d084] text-black font-semibold";
      case "BULLISH":
      case "BUY":
        return "bg-[rgba(0,208,132,0.15)] text-[#00d084] border border-[#00d084]";
      case "NEUTRAL":
      case "HOLD":
        return "bg-[rgba(245,166,35,0.15)] text-[#f5a623] border border-[#f5a623]";
      case "BEARISH":
      case "SELL":
        return "bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] border border-[#ff4d4d]";
      case "STRONGLY BEARISH":
      case "STRONG SELL":
        return "bg-[#ff4d4d] text-white font-semibold";
      default:
        return "bg-[rgba(245,166,35,0.15)] text-[#f5a623] border border-[#f5a623]";
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="relative overflow-hidden rounded-[12px] border-l-[3px] border-l-ai-purple border-y border-r border-border bg-ai-purple-dim p-6 transition-all hover:border-border-emphasis space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ai-purple" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ai-purple">
              AI QUALITATIVE RESEARCH REPORT
            </span>
          </div>
          {/* Full Verdict Banner Pill */}
          <div className={cn("px-4 py-1.5 rounded-[6px] font-mono text-[12px] uppercase tracking-wider text-center", getVerdictStyles(verdict))}>
            OUTLOOK: {verdict}
          </div>
        </div>

        {/* One Liner & Valuation Context */}
        <div>
          <p className="text-[15px] font-medium text-text-primary leading-relaxed italic">
            &quot;{data.oneLiner}&quot;
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex-1 space-y-1 w-full">
              <div className="flex justify-between font-mono text-[11px] text-text-muted">
                <span>AI Confidence Score</span>
                <span className="text-positive font-medium">{data.confidenceScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-positive" style={{ width: `${data.confidenceScore}%` }} />
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end shrink-0">
              <span className="font-sans text-[11px] text-text-muted uppercase">Illustrative Valuation Range</span>
              <span className="font-mono text-[15px] font-medium text-text-primary">
                {data.illustrativeValuationRange || data.priceTarget || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Bull Case & Bear Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Bull Case */}
          <div className="rounded-[8px] border-l-[3px] border-l-positive border-y border-r border-border bg-bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-positive">
              <TrendingUp className="h-4 w-4" />
              <h4 className="font-bebas text-[18px] tracking-wide uppercase">Bull Case Growth Thesis</h4>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed">{data.bullCase}</p>
            <div className="space-y-1.5 pt-2">
              {data?.keyStrengths?.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-text-primary">
                  <ShieldCheck className="h-3.5 w-3.5 text-positive shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bear Case */}
          <div className="rounded-[8px] border-l-[3px] border-l-negative border-y border-r border-border bg-bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-negative">
              <TrendingDown className="h-4 w-4" />
              <h4 className="font-bebas text-[18px] tracking-wide uppercase">Bear Case Risk Thesis</h4>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed">{data.bearCase}</p>
            <div className="space-y-1.5 pt-2">
              {data?.keyRisks?.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-text-primary">
                  <ShieldAlert className="h-3.5 w-3.5 text-negative shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary & Catalysts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-border">
          <div className="md:col-span-2">
            <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-2 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-ai-purple" /> Qualitative Summary
            </h4>
            <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-wrap">{data.summary}</p>
          </div>
          <div className="rounded-[8px] bg-bg-secondary border border-border p-4">
            <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-3 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-neutral" /> Key Catalysts
            </h4>
            <div className="space-y-2">
              {data?.catalysts?.map((c: string, i: number) => (
                <div key={i} className="text-[11px] text-text-primary bg-bg-card p-2 rounded-[6px] border border-border">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FIX 3 — AI Section Financial Disclaimer */}
      <p className="text-[11px] text-[#4a5568] italic mt-3">
        AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
      </p>
    </div>
  );
}
