"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { PageShell } from "@/components/layout/PageShell";
import { KPICards } from "@/components/dashboard/KPICards";
import { AIMarketBias } from "@/components/dashboard/AIMarketBias";
import { SectorHeatmap } from "@/components/dashboard/SectorHeatmap";
import { WatchlistTable } from "@/components/dashboard/WatchlistTable";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DEFAULT_WATCHLIST = "AAPL,NVDA,TSLA,MSFT,AMZN,META,GOOGL,AMD,NFLX,PLTR,COIN,JPM,V,WMT,DIS";

import { DailyDebriefModal } from "@/components/dashboard/DailyDebriefModal";
import { BookOpen, LineChart } from "lucide-react";

export default function DashboardPage() {
  const [indices, setIndices] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [economics, setEconomics] = useState<any[]>([]);
  const [journal, setJournal] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    setIsLoading(true);
    const [indicesRes, watchlistRes, economicsRes] = await Promise.all([
      apiClient.getIndices(),
      apiClient.getWatchlist(DEFAULT_WATCHLIST),
      apiClient.getEconomicCalendar(),
    ]);

    if (indicesRes.success) setIndices(indicesRes.data || []);
    if (watchlistRes.success) setWatchlist(watchlistRes.data || []);
    if (economicsRes.success) setEconomics((economicsRes.data || []).slice(0, 5));

    // Fetch journal from localStorage
    const savedTrades = JSON.parse(localStorage.getItem("edgeiq_trades") || "[]");
    setJournal(savedTrades.slice(-5).reverse());

    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell>
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-bebas text-5xl tracking-tight text-text-primary">Dashboard</h1>
            <p className="text-text-muted mt-1 uppercase font-mono text-[10px] tracking-[0.3em]">Market Intelligence Terminal</p>
          </div>
          <div className="flex items-center gap-3">
            <DailyDebriefModal watchlist={watchlist} marketData={indices} />
            <div className="flex items-center gap-4 bg-bg-secondary/50 rounded-xl px-4 py-2 border border-border h-[44px]">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-text-muted uppercase">Last Updated</span>
                <span className="text-xs font-mono font-bold text-text-primary italic">
                  {format(lastUpdated, "HH:mm:ss")} ET
                </span>
              </div>
              <button
                onClick={fetchData}
                disabled={isLoading}
                className={cn(
                  "p-2 hover:bg-bg-card rounded-lg transition-all active:scale-95 disabled:opacity-50",
                  isLoading && "animate-spin"
                )}
              >
                <RefreshCw className="h-4 w-4 text-accent" />
              </button>
            </div>
          </div>
        </div>

        {/* Market Overview Grid */}
        <div className="space-y-6">
          <KPICards data={indices} isLoading={isLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AIMarketBias />

              <SectorHeatmap data={watchlist} />

              <Card variant="default">
                <CardHeader className="flex flex-row justify-between items-center py-3">
                  <h3 className="font-bebas text-lg tracking-wide uppercase">Watchlist Overview</h3>
                  <Badge variant="outline" className="font-mono">{watchlist.length} Symbols</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <WatchlistTable data={watchlist} isLoading={isLoading} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Economic Calendar Small */}
              <Card variant="premium" className="border-red/10">
                <CardHeader className="py-3 flex flex-row items-center gap-2">
                  <Calendar className="h-4 w-4 text-red" />
                  <h3 className="font-bebas text-lg tracking-wide uppercase">Key Events Today</h3>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {economics.length > 0 ? economics.map((event, i) => (
                    <div key={i} className="flex flex-col gap-1 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-text-primary leading-tight flex-1 pr-4 truncate">
                          {event.event}
                        </span>
                        {event.impact === 'high' && (
                          <AlertTriangle className="h-3 w-3 text-red fill-red/10 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] font-mono text-text-muted uppercase">{event.time}</span>
                        <Badge variant={event.impact === 'high' ? 'danger' : event.impact === 'medium' ? 'warning' : 'default'} className="scale-75 origin-right">
                          {event.impact}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[10px] text-text-muted font-mono py-4 text-center">No major events today</p>
                  )}
                  <button className="w-full py-2 text-[10px] font-bold font-mono uppercase tracking-widest text-accent hover:bg-accent/5 rounded-lg transition-colors border border-accent/10 mt-2">
                    View Full Calendar
                  </button>
                </CardContent>
              </Card>

              {/* Recent Journal Entries */}
              <Card variant="default">
                <CardHeader className="py-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <h3 className="font-bebas text-lg tracking-wide uppercase">Recent Thesis</h3>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {journal.length > 0 ? journal.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-sm uppercase">{entry.ticker}</span>
                        <span className="text-[10px] text-text-muted uppercase">{entry.date}</span>
                      </div>
                      <Badge variant={entry.outcome === 'Won' ? 'success' : 'danger'} className="font-mono">
                        {entry.pnlPercent >= 0 ? '+' : ''}{entry.pnlPercent?.toFixed(2)}%
                      </Badge>
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <LineChart className="h-8 w-8 text-text-muted mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] text-text-muted font-mono uppercase">No recent entries</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
