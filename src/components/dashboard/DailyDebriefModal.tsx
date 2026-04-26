"use client";

import { useState } from "react";
import { Zap, Moon, Sun, Loader2, Sparkles, X, ChevronRight, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function DailyDebriefModal({ watchlist, marketData }: { watchlist: any[], marketData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDebrief = async () => {
    setIsLoading(true);
    setIsOpen(true);
    const response = await apiClient.dailyDebriefAI({
      watchlist: watchlist.map(w => ({ symbol: w.symbol, change: w.changePercent })),
      marketData,
      topNews: [] // Optional
    });
    if (response.success) {
      setData(response.data);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button 
        variant="primary" 
        size="md" 
        onClick={getDebrief}
        className="group relative overflow-hidden bg-accent text-bg-sidebar hover:bg-accent/90"
      >
        <Sparkles className="h-4 w-4 mr-2 group-hover:animate-pulse" />
        Get Today&apos;s Debrief
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl bg-bg-card border-accent/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="h-1 bg-accent w-full" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-bebas text-3xl tracking-wide uppercase text-text-primary">Daily Market Debrief</h2>
                  <p className="text-xs text-text-muted font-mono uppercase tracking-widest">{format(new Date(), "MMMM do, yyyy")}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
                  <X className="h-5 w-5 text-text-muted" />
                </button>
              </div>

              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 text-accent animate-spin" />
                  <p className="font-mono text-xs text-text-muted animate-pulse">AI ANALYST IS PROCESSING SESSION DATA...</p>
                </div>
              ) : data ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-bg-secondary rounded-xl p-4 border border-border/50">
                        <Badge variant={data.sessionMood === 'bullish' ? 'success' : 'danger'} className="mb-2 uppercase">
                            {data.sessionMood} Mood
                        </Badge>
                        <p className="text-sm text-text-primary leading-relaxed">{data.marketSummary}</p>
                    </div>
                    <div className="md:w-1/3 flex flex-col items-center justify-center bg-accent/5 rounded-xl border border-accent/10 p-4">
                        <Lightbulb className="h-6 w-6 text-accent mb-2" />
                        <p className="text-[11px] font-bold text-accent uppercase tracking-widest text-center">Analyst Tip</p>
                        <p className="text-[10px] text-text-secondary text-center italic mt-1 leading-tight">{data.analystTip}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Watchlist Winners</h4>
                        {data?.watchlistWinners?.map((winner: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-accent">
                                <ChevronRight className="h-3 w-3" />
                                <span>{winner}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Watchlist Losers</h4>
                        {data?.watchlistLosers?.map((loser: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-red">
                                <ChevronRight className="h-3 w-3" />
                                <span>{loser}</span>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-3">Tomorrow&apos;s Watchlist</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {data?.tomorrowWatchlist?.map((item: string, i: number) => (
                            <div key={i} className="bg-bg-secondary/50 p-2 rounded-lg text-xs text-text-secondary border border-border/30">
                                {item}
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
