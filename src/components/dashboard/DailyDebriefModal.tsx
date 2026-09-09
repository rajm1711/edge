"use client";

import { useState } from "react";
import { Zap, Loader2, Sparkles, X, ChevronRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";

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
      topNews: []
    });
    if (response.success) {
      setData(response.data);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button 
        onClick={getDebrief}
        className="flex items-center gap-2 h-[44px] px-4 rounded-[8px] border border-[rgba(167,139,250,0.2)] bg-[rgba(167,139,250,0.08)] text-[#a78bfa] hover:bg-[rgba(167,139,250,0.15)] transition-colors font-mono text-[12px] font-medium uppercase tracking-wider"
      >
        <Sparkles className="h-4 w-4" />
        Get Today&apos;s Debrief
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-bg-card border border-border rounded-[12px] shadow-2xl overflow-hidden font-sans border-l-[3px] border-l-ai-purple">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-ai-purple" />
                    <span className="font-mono text-[10px] text-ai-purple uppercase tracking-wider">AI DEBRIEF ENGINE</span>
                  </div>
                  <h2 className="font-bebas text-[28px] tracking-wide uppercase text-text-primary">Daily Market Debrief</h2>
                  <p className="text-[11px] text-text-muted font-mono">{format(new Date(), "MMMM d, yyyy")}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-bg-hover rounded-[6px] transition-colors text-text-secondary">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 text-ai-purple animate-spin" />
                  <p className="font-mono text-[11px] text-text-secondary uppercase tracking-wider animate-pulse">
                    AI Analyst is processing session data...
                  </p>
                </div>
              ) : data ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-bg-secondary rounded-[8px] p-4 border border-border">
                      <Badge variant={data.sessionMood === "bullish" ? "bullish" : "bearish"} className="mb-2 uppercase">
                        {data.sessionMood} Mood
                      </Badge>
                      <p className="text-[13px] text-text-primary leading-relaxed">{data.marketSummary}</p>
                    </div>
                    <div className="md:w-1/3 flex flex-col items-center justify-center bg-ai-purple-dim rounded-[8px] border border-border p-4">
                      <Lightbulb className="h-5 w-5 text-ai-purple mb-2" />
                      <p className="text-[11px] font-mono font-medium text-ai-purple uppercase tracking-wider text-center">Analyst Tip</p>
                      <p className="text-[11px] text-text-secondary text-center italic mt-1 leading-tight">{data.analystTip}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-mono font-medium uppercase tracking-wider text-text-muted">Watchlist Winners</h4>
                      {data?.watchlistWinners?.map((winner: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-[12px] text-positive">
                          <ChevronRight className="h-3 w-3" />
                          <span>{winner}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-mono font-medium uppercase tracking-wider text-text-muted">Watchlist Losers</h4>
                      {data?.watchlistLosers?.map((loser: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-[12px] text-negative">
                          <ChevronRight className="h-3 w-3" />
                          <span>{loser}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="text-[11px] font-mono font-medium uppercase tracking-wider text-text-muted mb-3">Tomorrow&apos;s Watchlist</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {data?.tomorrowWatchlist?.map((item: string, i: number) => (
                        <div key={i} className="bg-bg-secondary p-2.5 rounded-[6px] text-[12px] text-text-secondary border border-border">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

