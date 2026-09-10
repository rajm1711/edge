"use client";

import { useState } from "react";
import { ShieldCheck, Crosshair, Send, Loader2, Sparkles } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function PreTradeChecklist({ ticker, price }: { ticker: string; price: number }) {
  const [thesis, setThesis] = useState("");
  const [level, setLevel] = useState("");
  const [horizon, setHorizon] = useState("swing");
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeTrade = async () => {
    if (!thesis || !level) return;
    setIsLoading(true);
    const response = await apiClient.preTrade({
      ticker,
      price,
      thesis: `[${direction}] ${thesis}`,
      level,
      horizon,
      news: [],
      fundamentals: {}
    });
    if (response.success) {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  return (
    <Card variant="terminal" className="rounded-[16px]">
      <CardHeader className="py-3.5 flex flex-row items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-[var(--info)]">
          <ShieldCheck className="h-4 w-4" />
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">Pre-Trade Risk Coach</h3>
        </div>
        {result && (
          <Badge variant={result.verdict === "proceed" ? "bullish" : "bearish"} className="font-mono text-[11px]">
            {result.verdict}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {!result ? (
          <div className="space-y-3.5">
            {/* LONG / SHORT Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--background-secondary)] rounded-[8px] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setDirection("LONG")}
                className={cn(
                  "py-1.5 rounded-[6px] text-xs font-mono font-bold transition-all uppercase",
                  direction === "LONG" ? "bg-[var(--positive)] text-black shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
              >
                ▲ LONG
              </button>
              <button
                type="button"
                onClick={() => setDirection("SHORT")}
                className={cn(
                  "py-1.5 rounded-[6px] text-xs font-mono font-bold transition-all uppercase",
                  direction === "SHORT" ? "bg-[var(--negative)] text-white shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
              >
                ▼ SHORT
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Trade Thesis & Setup
              </label>
              <textarea 
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="Describe entry triggers, support/resistance, and catalysts..."
                className="w-full min-h-[80px] p-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-[12px] font-sans text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Trigger Level
                </label>
                <div className="relative flex items-center">
                  <Crosshair className="absolute left-3 h-3.5 w-3.5 text-[var(--foreground-muted)]" />
                  <input 
                    type="text" 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="e.g. $145.50"
                    className="w-full h-9 pl-9 pr-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] font-mono text-[12px] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--accent)] focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Time Horizon
                </label>
                <select 
                  value={horizon}
                  onChange={(e) => setHorizon(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-[12px] font-sans text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-all cursor-pointer"
                >
                  <option value="intraday">Intraday</option>
                  <option value="swing">Swing Trade</option>
                  <option value="positional">Positional</option>
                </select>
              </div>
            </div>

            <Button 
              onClick={analyzeTrade} 
              disabled={!thesis || !level || isLoading}
              className="w-full h-[40px] bg-[var(--accent)] text-black font-semibold hover:opacity-90 rounded-[8px] text-[12px] font-sans uppercase tracking-wider transition-all mt-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Evaluating Risk Parameters...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-3.5 w-3.5" />
                  <span>Assess My Research</span>
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Score Banner */}
            <div className="flex items-center gap-4 p-3.5 rounded-[12px] border-l-[3px] border-l-[var(--ai)] border-y border-r border-[var(--border)] bg-[var(--ai-dim)]">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-[8px] bg-[var(--card)] border border-[var(--border)] shrink-0">
                <span className="font-bebas text-2xl text-[var(--ai)] leading-none">{result.grade}</span>
                <span className="text-[9px] font-mono text-[var(--foreground-muted)] uppercase">Grade</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1 font-mono text-[11px]">
                  <span className="text-[var(--foreground-muted)] uppercase">Research Score</span>
                  <span className="text-[var(--positive)] font-medium">{result.overallScore}/100</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--positive)]" style={{ width: `${result.overallScore}%` }} />
                </div>
              </div>
            </div>

            {/* Flags */}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <h5 className="font-sans text-[11px] font-medium uppercase tracking-wider text-[var(--positive)]">Green Flags</h5>
                {result.greenFlags?.map((flag: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--foreground)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--positive)] shrink-0 mt-1.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <h5 className="font-sans text-[11px] font-medium uppercase tracking-wider text-[var(--negative)]">Red Flags</h5>
                {result.redFlags?.map((flag: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--foreground)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--negative)] shrink-0 mt-1.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestion */}
            <div className="rounded-[8px] bg-[var(--background-secondary)] p-3 border border-[var(--border)]">
              <span className="text-[10px] font-mono text-[var(--ai)] uppercase block mb-0.5">Coach Suggestion</span>
              <p className="text-[12px] text-[var(--foreground-muted)] italic leading-relaxed">&quot;{result.suggestion}&quot;</p>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              className="w-full h-8 bg-transparent border border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)] rounded-[6px] text-[10px] font-mono uppercase tracking-wider"
            >
              Reset & New Analysis
            </Button>

            <p className="text-[11px] text-[var(--foreground-muted)] italic mt-2">
              AI-generated analysis is for informational and educational purposes only. This is not financial advice or a recommendation to buy or sell securities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


