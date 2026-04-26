"use client";

import { useState } from "react";
import { ShieldCheck, Crosshair, History, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
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
    <Card variant="default">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-blue">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-bebas text-lg tracking-wide uppercase text-text-primary">Pre-Trade Risk Coach</h3>
        </div>
        {result && (
            <Badge variant={result.verdict === 'proceed' ? 'success' : 'danger'} className="font-bebas px-4">
                {result.verdict}
            </Badge>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!result ? (
          <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted ml-1">Trade Thesis</label>
                <textarea 
                    value={thesis}
                    onChange={(e) => setThesis(e.target.value)}
                    placeholder="Why are you taking this trade? (e.g. Broken resistance at $150, strong earnings momentum...)"
                    className="w-full min-h-[100px] p-3 rounded-xl bg-bg-secondary border border-border text-xs focus:border-accent focus:outline-none transition-all placeholder:text-text-muted/50"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted ml-1">Price Level</label>
                    <div className="relative flex items-center">
                        <Crosshair className="absolute left-3 h-4 w-4 text-text-muted" />
                        <input 
                            type="text" 
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            placeholder="e.g. $145.50"
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-bg-secondary border border-border text-xs focus:border-accent focus:outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted ml-1">Horizon</label>
                    <select 
                        value={horizon}
                        onChange={(e) => setHorizon(e.target.value)}
                        className="w-full h-10 px-4 rounded-xl bg-bg-secondary border border-border text-xs focus:border-accent focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="intraday">Intraday</option>
                        <option value="swing">Swing</option>
                        <option value="positional">Positional</option>
                    </select>
                </div>
            </div>

            <Button 
                onClick={analyzeTrade} 
                className="w-full bg-blue text-white hover:bg-blue/90"
                isLoading={isLoading}
                disabled={!thesis || !level}
            >
                <Send className="h-4 w-4 mr-2" />
                Analyze Trade Idea
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between gap-6 pb-6 border-b border-border">
                <div className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-border/20 border-2 border-accent">
                    <span className="text-2xl font-bebas text-accent">{result.grade}</span>
                    <span className="text-[8px] font-mono font-bold text-text-muted uppercase -mt-1">Grade</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-text-muted">Research Score</span>
                        <span className="text-xs font-mono font-bold text-accent">{result.overallScore}/100</span>
                    </div>
                    <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${result.overallScore}%` }} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">Green Flags</h5>
                    {result.greenFlags.map((flag: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-text-secondary leading-tight">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                            {flag}
                        </div>
                    ))}
                </div>
                <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-red">Red Flags</h5>
                    {result.redFlags.map((flag: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-text-secondary leading-tight">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red flex-shrink-0" />
                            {flag}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue/5 rounded-xl p-4 border border-blue/10">
                <h5 className="text-[10px] font-mono font-bold uppercase text-blue mb-2 flex items-center gap-2">
                    <History className="h-3 w-3" /> Coach Insight
                </h5>
                <p className="text-xs text-text-primary italic leading-relaxed">&quot;{result.suggestion}&quot;</p>
            </div>

            <Button 
                variant="outline" 
                onClick={() => setResult(null)} 
                className="w-full text-[10px] uppercase font-bold tracking-widest"
            >
                Reset & New Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
