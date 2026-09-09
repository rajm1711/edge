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
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeTrade = async () => {
    if (!thesis || !level) return;
    setIsLoading(true);
    const response = await apiClient.preTrade({
      ticker,
      price,
      thesis,
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
    <Card variant="terminal">
      <CardHeader className="py-3 flex flex-row items-center justify-between border-b border-border">
        <div className="flex items-center gap-2 text-info">
          <ShieldCheck className="h-4 w-4" />
          <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Pre-Trade Risk Coach</h3>
        </div>
        {result && (
          <Badge variant={result.verdict === "proceed" ? "buy" : "sell"} className="font-mono text-[11px]">
            {result.verdict}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {!result ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
                Trade Thesis & Setup
              </label>
              <textarea 
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="Describe entry triggers, support/resistance, and catalysts..."
                className="w-full min-h-[90px] p-3 rounded-[8px] bg-bg-secondary border border-border text-[12px] font-sans text-text-primary placeholder-text-muted focus:border-border-emphasis focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
                  Trigger Level
                </label>
                <div className="relative flex items-center">
                  <Crosshair className="absolute left-3 h-3.5 w-3.5 text-text-muted" />
                  <input 
                    type="text" 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="e.g. $145.50"
                    className="w-full h-9 pl-9 pr-3 rounded-[8px] bg-bg-secondary border border-border font-mono text-[12px] text-text-primary placeholder-text-muted focus:border-border-emphasis focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-text-muted">
                  Time Horizon
                </label>
                <select 
                  value={horizon}
                  onChange={(e) => setHorizon(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] bg-bg-secondary border border-border text-[12px] font-sans text-text-primary focus:border-border-emphasis focus:outline-none transition-all cursor-pointer"
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
              className="w-full h-[38px] bg-positive text-black font-medium hover:bg-positive/90 rounded-[8px] text-[12px] font-mono uppercase tracking-wider transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Evaluating Risk Parameters...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-3.5 w-3.5" />
                  <span>Score My Research</span>
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Score Banner */}
            <div className="flex items-center gap-4 p-4 rounded-[8px] border-l-[3px] border-l-ai-purple border-y border-r border-border bg-ai-purple-dim">
              <div className="flex flex-col items-center justify-center h-14 w-14 rounded-[8px] bg-bg-card border border-border shrink-0">
                <span className="font-bebas text-[28px] text-ai-purple leading-none">{result.grade}</span>
                <span className="text-[9px] font-mono text-text-muted uppercase">Grade</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1 font-mono text-[11px]">
                  <span className="text-text-muted uppercase">Research Score</span>
                  <span className="text-positive font-medium">{result.overallScore}/100</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-positive" style={{ width: `${result.overallScore}%` }} />
                </div>
              </div>
            </div>

            {/* Flags */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <h5 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-positive">Green Flags</h5>
                {result.greenFlags?.map((flag: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-positive shrink-0 mt-1.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <h5 className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-negative">Red Flags</h5>
                {result.redFlags?.map((flag: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-negative shrink-0 mt-1.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestion */}
            <div className="rounded-[8px] bg-bg-secondary p-3.5 border border-border">
              <span className="text-[10px] font-mono text-ai-purple uppercase block mb-1">Coach Suggestion</span>
              <p className="text-[12px] text-text-secondary italic leading-relaxed">&quot;{result.suggestion}&quot;</p>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              className="w-full h-8 bg-transparent border border-border text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-[6px] text-[10px] font-mono uppercase tracking-wider"
            >
              Reset & New Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

