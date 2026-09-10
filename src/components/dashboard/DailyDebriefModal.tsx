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
        className="flex items-center gap-2 h-[36px] px-4 rounded-[8px] border border-[rgba(167,139,250,0.20)] bg-[rgba(167,139,250,0.08)] text-[#a78bfa] hover:bg-[rgba(167,139,250,0.15)] transition-colors font-sans text-[12px] font-medium"
      >
        <Sparkles className="h-4 w-4" />
        Get Today&apos;s Debrief
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-[16px] shadow-2xl overflow-hidden font-sans border-l-[3px] border-l-[#a78bfa]" style={{ background: `linear-gradient(to right, rgba(167,139,250,0.02), var(--card))` }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-[#a78bfa]" />
                    <span className="text-[11px] text-[#a78bfa] uppercase tracking-[0.06em] font-sans font-medium">AI DEBRIEF ENGINE</span>
                    <span className="rounded-[6px] bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.20)] px-2 py-0.5 font-mono text-[10px] uppercase text-[#a78bfa]">AI</span>
                  </div>
                  <h2 className="font-sans text-[18px] font-semibold text-[var(--foreground)]">Daily Market Debrief</h2>
                  <p className="text-[11px] text-[var(--foreground-muted)] font-mono mt-0.5">{format(new Date(), "MMMM d, yyyy")}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-[var(--background-tertiary)] rounded-[8px] transition-colors text-[var(--foreground-secondary)]">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 text-[#a78bfa] animate-spin" />
                  <p className="font-sans text-[13px] text-[var(--foreground-secondary)] animate-pulse">
                    AI Analyst is processing session data...
                  </p>
                </div>
              ) : data ? (
                <div className="space-y-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-[var(--background-secondary)] rounded-[12px] p-4 border border-[var(--border)]">
                      <Badge variant={data.sessionMood === "bullish" ? "bullish" : "bearish"} className="mb-2 uppercase">
                        {data.sessionMood} Mood
                      </Badge>
                      <p className="text-[13px] text-[var(--foreground)] leading-relaxed">{data.marketSummary}</p>
                    </div>
                    <div className="md:w-1/3 flex flex-col items-center justify-center rounded-[12px] border border-[var(--border)] p-4" style={{ background: 'rgba(167,139,250,0.04)' }}>
                      <Lightbulb className="h-5 w-5 text-[#a78bfa] mb-2" />
                      <p className="text-[11px] font-sans font-medium text-[#a78bfa] uppercase tracking-[0.06em] text-center">Analyst Tip</p>
                      <p className="text-[11px] text-[var(--foreground-secondary)] text-center italic mt-1 leading-tight">{data.analystTip}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">Watchlist Winners</h4>
                      {data?.watchlistWinners?.map((winner: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-[12px] text-[#00d084]">
                          <ChevronRight className="h-3 w-3" />
                          <span>{winner}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">Watchlist Losers</h4>
                      {data?.watchlistLosers?.map((loser: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-[12px] text-[#ef4444]">
                          <ChevronRight className="h-3 w-3" />
                          <span>{loser}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] pt-4">
                    <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)] mb-3">Tomorrow&apos;s Watchlist</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {data?.tomorrowWatchlist?.map((item: string, i: number) => (
                        <div key={i} className="bg-[var(--background-secondary)] p-2.5 rounded-[8px] text-[12px] text-[var(--foreground-secondary)] border border-[var(--border)]">
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
