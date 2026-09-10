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
import { DailyDebriefModal } from "@/components/dashboard/DailyDebriefModal";
import { RefreshCw, Calendar, AlertTriangle, BookOpen, LineChart, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn, formatPercent } from "@/lib/utils";
import Link from "next/link";

const DEFAULT_WATCHLIST = "AAPL,NVDA,TSLA,MSFT,AMZN,META,GOOGL,AMD,NFLX,PLTR,COIN,JPM,V,WMT,DIS";

import { motion } from "framer-motion";

export default function DashboardPage() {
  const [indices, setIndices] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [economics, setEconomics] = useState<any[]>([]);
  const [journal, setJournal] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async (isInitial = false) => {
    if (isInitial || indices.length === 0) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [indicesRes, watchlistRes, economicsRes] = await Promise.all([
        apiClient.getIndices(),
        apiClient.getWatchlist(DEFAULT_WATCHLIST),
        apiClient.getEconomicCalendar(),
      ]);

      if (indicesRes.success) setIndices(indicesRes.data || []);
      if (watchlistRes.success) setWatchlist(watchlistRes.data || []);
      if (economicsRes.success) setEconomics((economicsRes.data || []).slice(0, 8));

      const savedTrades = JSON.parse(localStorage.getItem("edgeiq_trades") || "[]");
      setJournal(savedTrades.slice(-3).reverse());
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[1600px] mx-auto space-y-6 font-sans min-w-0"
      >

        {/* ROW 2: 4 KPI Stat Cards */}
        <KPICards data={indices} isLoading={isLoading} />

        {/* ROW 3: Main Content Grid (2/3 + 1/3 Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2/3 COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Market Bias Card */}
            <AIMarketBias />

            {/* Watchlist Overview Table */}
            <Card variant="terminal">
              <CardHeader className="flex flex-row justify-between items-center py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">Watchlist Intelligence</h3>
                  <Badge variant="outline" className="font-mono text-[10px]">{watchlist.length} Symbols</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[11px] text-[var(--foreground-muted)]">
                    Last updated {format(lastUpdated, "HH:mm:ss")} ET
                  </span>
                  <button
                    onClick={() => fetchData(false)}
                    disabled={isLoading || isRefreshing}
                    className="p-1.5 hover:bg-[var(--background-tertiary)] rounded-[8px] transition-colors text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", (isLoading || isRefreshing) && "animate-spin")} />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <WatchlistTable data={watchlist} isLoading={isLoading} />
              </CardContent>
            </Card>

            {/* Sector Treemap */}
            <SectorHeatmap data={watchlist} />
          </div>

          {/* RIGHT 1/3 COLUMN */}
          <div className="space-y-6">
            {/* Market Mood Card */}
            <Card variant="terminal">
              <CardHeader className="py-3">
                <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">Market Mood Gauge</h3>
              </CardHeader>
              <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                {/* Visual Gauge */}
                <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden mb-3">
                  <div className="w-44 h-44 rounded-full border-[12px] border-[var(--border)] border-t-[#00d084] border-r-[#f59e0b] border-l-[#ef4444] rotate-45" />
                  <div className="absolute bottom-0 font-mono text-[32px] font-medium text-[var(--foreground)]">
                    68
                  </div>
                </div>
                <span className="font-mono text-[12px] font-medium text-[#00d084] uppercase tracking-wider bg-[rgba(0,208,132,0.12)] border border-[rgba(0,208,132,0.20)] px-3 py-1 rounded-[6px]">
                  GREED MODE
                </span>
                <p className="text-[11px] text-[var(--foreground-secondary)] mt-2">
                  Institutional risk appetite elevated. Momentum favors breakout setups.
                </p>
              </CardContent>
            </Card>

            {/* Daily Debrief Action Box */}
            <div className="rounded-[16px] border-l-[3px] border-l-[#a78bfa] border-y border-r border-[var(--border)] p-5" style={{ background: `linear-gradient(to right, rgba(167,139,250,0.02), var(--card))` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-[#a78bfa] uppercase tracking-[0.06em] font-sans font-medium">AI DEBRIEF GENERATOR</span>
                <Badge variant="ai">Live AI</Badge>
              </div>
              <p className="text-[12px] text-[var(--foreground-secondary)] leading-relaxed mb-4">
                Generate an instant session debrief with AI analyst takeaways, top winners/losers, and tomorrow&apos;s watch strategy.
              </p>
              <DailyDebriefModal watchlist={watchlist} marketData={indices} />
            </div>

            {/* Key Events Today */}
            <Card variant="terminal">
              <CardHeader className="py-3 flex flex-row items-center gap-2">
                <Calendar className="h-4 w-4 text-[#ef4444]" />
                <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">Key Events Today</h3>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {economics.length > 0 ? (
                  economics.slice(0, 4).map((event, i) => (
                    <div key={i} className="flex flex-col gap-1 pb-2.5 border-b border-[var(--border)] last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[12px] font-medium text-[var(--foreground)] leading-tight flex-1 pr-3 truncate">
                          {event.event}
                        </span>
                        {event.impact === "high" && (
                          <AlertTriangle className="h-3.5 w-3.5 text-[#ef4444] shrink-0" />
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[10px] font-mono text-[var(--foreground-muted)]">{event.time}</span>
                        <Badge
                          variant={
                            event.impact === "high"
                              ? "high"
                              : event.impact === "medium"
                                ? "medium"
                                : "low"
                          }
                        >
                          {event.impact}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[var(--foreground-muted)] font-mono py-4 text-center">No major events scheduled today</p>
                )}
                <Link
                  href="/calendar"
                  className="block w-full py-2 text-center text-[11px] font-sans font-medium uppercase tracking-wider text-[#00d084] hover:bg-[rgba(0,208,132,0.06)] rounded-[8px] transition-colors border border-[rgba(0,208,132,0.15)] mt-2"
                >
                  View Full Calendar →
                </Link>
              </CardContent>
            </Card>

            {/* Recent Journal Entries */}
            <Card variant="terminal">
              <CardHeader className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#00d084]" />
                  <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">Recent Trade Journal</h3>
                </div>
                <Link href="/journal" className="text-[11px] font-sans font-medium text-[#00d084] hover:underline">
                  View All
                </Link>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {journal.length > 0 ? (
                  journal.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-2 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-mono font-semibold text-[13px] text-[var(--foreground)] uppercase">{entry.ticker}</span>
                        <span className="text-[10px] text-[var(--foreground-muted)] font-mono">{entry.date}</span>
                      </div>
                      <Badge variant={entry.outcome === "Won" ? "bullish" : "bearish"} className="font-mono">
                        {entry.pnlPercent >= 0 ? "+" : ""}{entry.pnlPercent?.toFixed(2)}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <LineChart className="h-8 w-8 text-[var(--foreground-muted)] mx-auto mb-2 opacity-30" />
                    <p className="text-[11px] text-[var(--foreground-muted)] font-mono uppercase">No recent trade entries</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ROW 4: Economic Events Horizontal Scroll */}
        <Card variant="terminal">
          <CardHeader className="py-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--info)]" />
              <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">Economic Catalyst Horizon</h3>
            </div>
            <Link href="/calendar" className="text-[11px] font-sans font-medium text-[#00d084] hover:underline">
              View Calendar →
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {(economics.length > 0
                ? economics
                : [
                  { event: "Fed Interest Rate Decision", time: "14:00 ET", impact: "high" },
                  { event: "Non-Farm Payrolls", time: "08:30 ET", impact: "high" },
                  { event: "Core CPI Inflation YoY", time: "08:30 ET", impact: "high" },
                  { event: "Initial Jobless Claims", time: "08:30 ET", impact: "medium" },
                  { event: "S&P Global US Manufacturing PMI", time: "09:45 ET", impact: "medium" },
                ]
              ).map((evt, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "min-w-[240px] flex-1 rounded-[10px] border-l-[3px] border-y border-r border-[var(--border)] bg-[var(--background-secondary)] p-3.5 shrink-0 transition-colors hover:border-[var(--border-emphasis)]",
                    evt.impact === "high"
                      ? "border-l-[#ef4444]"
                      : evt.impact === "medium"
                        ? "border-l-[#f59e0b]"
                        : "border-l-[var(--foreground-muted)]"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-[var(--foreground-muted)]">{evt.time}</span>
                    <Badge variant={evt.impact === "high" ? "high" : evt.impact === "medium" ? "medium" : "low"}>
                      {evt.impact}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-medium text-[var(--foreground)] truncate">{evt.event}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </PageShell>
  );
}


