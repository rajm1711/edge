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
      <div className="h-[360px] w-full rounded-[16px] border-l-[3px] border-l-[var(--ai)] border-y border-r border-[var(--border)] bg-[var(--ai-dim)] p-6 font-sans">
        <div className="flex items-center gap-2 text-[var(--ai)]">
          <Zap className="h-4 w-4 animate-bounce" />
          <span className="font-mono text-[11px] uppercase tracking-wider font-medium">
            AI Research Assistant is compiling ticker report...
          </span>
        </div>
        <Skeleton className="mt-4 h-12 w-full rounded-[8px]" />
        <Skeleton className="mt-4 h-36 w-full rounded-[8px]" />
      </div>
    );
  }

  if (!data) return null;

  const verdict = (data.analyticalOutlook || data.analystVerdict || "NEUTRAL").toUpperCase();

  const getVerdictStyles = (v: string) => {
    switch (v) {
      case "STRONGLY BULLISH":
      case "STRONG BUY":
        return "bg-[var(--positive)] text-black font-semibold";
      case "BULLISH":
      case "BUY":
        return "bg-[var(--positive)]/15 text-[var(--positive)] border border-[var(--positive)]";
      case "NEUTRAL":
      case "HOLD":
        return "bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]";
      case "BEARISH":
      case "SELL":
        return "bg-[var(--negative)]/15 text-[var(--negative)] border border-[var(--negative)]";
      case "STRONGLY BEARISH":
      case "STRONG SELL":
        return "bg-[var(--negative)] text-white font-semibold";
      default:
        return "bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]";
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="relative overflow-hidden rounded-[16px] border-l-[3px] border-l-[var(--ai)] border-y border-r border-[var(--border)] bg-[var(--ai-dim)] p-6 transition-all space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--ai)]" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--ai)]">
              AI QUALITATIVE RESEARCH REPORT
            </span>
          </div>
          {/* Full Verdict Banner Pill */}
          <div className={cn("px-3.5 py-1.5 rounded-[6px] font-mono text-[11px] uppercase tracking-wider text-center", getVerdictStyles(verdict))}>
            OUTLOOK: {verdict}
          </div>
        </div>

        {/* One Liner & Valuation Context */}
        <div>
          <p className="text-[14px] font-medium text-[var(--foreground)] leading-relaxed italic">
            &quot;{data.oneLiner}&quot;
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex-1 space-y-1 w-full">
              <div className="flex justify-between font-mono text-[11px] text-[var(--foreground-muted)]">
                <span>AI Confidence Score</span>
                <span className="text-[var(--positive)] font-medium">{data.confidenceScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--positive)]" style={{ width: `${data.confidenceScore}%` }} />
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end shrink-0">
              <span className="font-sans text-[11px] text-[var(--foreground-muted)] uppercase">Illustrative Valuation Range</span>
              <span className="font-mono text-[14px] font-medium text-[var(--foreground)]">
                {data.illustrativeValuationRange || data.priceTarget || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Bull Case & Bear Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Bull Case */}
          <div className="rounded-[12px] border-l-[3px] border-l-[var(--positive)] border-y border-r border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
            <div className="flex items-center gap-2 text-[var(--positive)]">
              <TrendingUp className="h-4 w-4" />
              <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">Bull Case Growth Thesis</h4>
            </div>
            <p className="text-[12px] text-[var(--foreground-muted)] leading-relaxed">{data.bullCase}</p>
            <div className="space-y-1.5 pt-2">
              {data?.keyStrengths?.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--foreground)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--positive)] shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bear Case */}
          <div className="rounded-[12px] border-l-[3px] border-l-[var(--negative)] border-y border-r border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
            <div className="flex items-center gap-2 text-[var(--negative)]">
              <TrendingDown className="h-4 w-4" />
              <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">Bear Case Risk Thesis</h4>
            </div>
            <p className="text-[12px] text-[var(--foreground-muted)] leading-relaxed">{data.bearCase}</p>
            <div className="space-y-1.5 pt-2">
              {data?.keyRisks?.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--foreground)]">
                  <ShieldAlert className="h-3.5 w-3.5 text-[var(--negative)] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary & Catalysts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[var(--border)]">
          <div className="md:col-span-2">
            <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)] mb-2 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[var(--ai)]" /> Qualitative Summary
            </h4>
            <p className="text-[12px] text-[var(--foreground-muted)] leading-relaxed whitespace-pre-wrap">{data.summary}</p>
          </div>
          <div className="rounded-[12px] bg-[var(--background-secondary)] border border-[var(--border)] p-4">
            <h4 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)] mb-3 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-[var(--info)]" /> Key Catalysts
            </h4>
            <div className="space-y-2">
              {data?.catalysts?.map((c: string, i: number) => (
                <div key={i} className="text-[11px] text-[var(--foreground)] bg-[var(--card)] p-2 rounded-[6px] border border-[var(--border)]">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[var(--foreground-muted)] italic mt-2">
        AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
      </p>
    </div>
  );
}
