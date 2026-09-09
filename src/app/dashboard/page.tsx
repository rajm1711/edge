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
    if (economicsRes.success) setEconomics((economicsRes.data || []).slice(0, 8));

    const savedTrades = JSON.parse(localStorage.getItem("edgeiq_trades") || "[]");
    setJournal(savedTrades.slice(-3).reverse());

    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const marketPulseItems = [
    { label: "S&P 500", value: "5,812.40", change: "+0.21%", positive: true },
    { label: "NASDAQ", value: "18,415.20", change: "-0.24%", positive: false },
    { label: "DOW", value: "42,110.50", change: "+0.25%", positive: true },
    { label: "VIX", value: "15.42", change: "-5.22%", positive: true },
    { label: "GOLD", value: "$2,735.10", change: "+0.45%", positive: true },
    { label: "BTC-USD", value: "$68,420.00", change: "+2.16%", positive: true },
  ];

  return (
    <PageShell>
      <div className="w-full max-w-[1600px] mx-auto space-y-6 font-sans min-w-0">
        {/* ROW 1: Market Pulse Strip (Static Horizontal Snapshot) */}
        <div className="rounded-[12px] border border-border bg-bg-card px-6 py-3">
          <div className="flex items-center justify-between overflow-x-auto gap-6 scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2 w-2 rounded-full bg-positive animate-pulse" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                MARKET PULSE
              </span>
            </div>
            <div className="flex items-center gap-6 divide-x divide-border overflow-x-auto">
              {marketPulseItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 pl-6 first:pl-0 font-mono text-[12px] shrink-0">
                  <span className="text-[11px] text-text-muted uppercase font-sans font-medium">{item.label}</span>
                  <span className="text-text-primary font-medium">{item.value}</span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-[4px] px-1.5 py-0.5 text-[11px] font-medium",
                      item.positive
                        ? "bg-[rgba(0,208,132,0.10)] text-positive"
                        : "bg-[rgba(255,77,77,0.10)] text-negative"
                    )}
                  >
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
              <CardHeader className="flex flex-row justify-between items-center py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Watchlist Intelligence</h3>
                  <Badge variant="outline" className="font-mono text-[10px]">{watchlist.length} Symbols</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[11px] text-text-muted">
                    Last updated {format(lastUpdated, "HH:mm:ss")} ET
                  </span>
                  <button
                    onClick={fetchData}
                    disabled={isLoading}
                    className="p-1.5 hover:bg-border rounded-[6px] transition-colors text-text-secondary hover:text-text-primary"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
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
                <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Market Mood Gauge</h3>
              </CardHeader>
              <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                {/* Visual Gauge */}
                <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden mb-3">
                  <div className="w-44 h-44 rounded-full border-[12px] border-border border-t-positive border-r-neutral border-l-negative rotate-45" />
                  <div className="absolute bottom-0 font-mono text-[32px] font-medium text-text-primary">
                    68
                  </div>
                </div>
                <span className="font-mono text-[12px] font-medium text-positive uppercase tracking-wider bg-[rgba(0,208,132,0.10)] px-3 py-1 rounded-[4px]">
                  GREED MODE
                </span>
                <p className="text-[11px] text-text-secondary mt-2">
                  Institutional risk appetite elevated. Momentum favors breakout setups.
                </p>
              </CardContent>
            </Card>

            {/* Daily Debrief Action Box */}
            <div className="rounded-[12px] border-l-[3px] border-l-ai-purple border-y border-r border-border bg-ai-purple-dim p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-ai-purple uppercase tracking-wider">AI DEBRIEF GENERATOR</span>
                <Badge variant="ai">Live AI</Badge>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed mb-4">
                Generate an instant session debrief with AI analyst takeaways, top winners/losers, and tomorrow&apos;s watch strategy.
              </p>
              <DailyDebriefModal watchlist={watchlist} marketData={indices} />
            </div>

            {/* Key Events Today */}
            <Card variant="terminal">
              <CardHeader className="py-3 flex flex-row items-center gap-2">
                <Calendar className="h-4 w-4 text-negative" />
                <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Key Events Today</h3>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {economics.length > 0 ? (
                  economics.slice(0, 4).map((event, i) => (
                    <div key={i} className="flex flex-col gap-1 pb-2.5 border-b border-border last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[12px] font-medium text-text-primary leading-tight flex-1 pr-3 truncate">
                          {event.event}
                        </span>
                        {event.impact === "high" && (
                          <AlertTriangle className="h-3.5 w-3.5 text-negative shrink-0" />
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[10px] font-mono text-text-muted">{event.time}</span>
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
                  <p className="text-[11px] text-text-muted font-mono py-4 text-center">No major events scheduled today</p>
                )}
                <Link
                  href="/calendar"
                  className="block w-full py-2 text-center text-[11px] font-mono font-medium uppercase tracking-wider text-positive hover:bg-positive-dim rounded-[6px] transition-colors border border-[rgba(0,208,132,0.15)] mt-2"
                >
                  View Full Calendar →
                </Link>
              </CardContent>
            </Card>

            {/* Recent Journal Entries */}
            <Card variant="terminal">
              <CardHeader className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-positive" />
                  <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Recent Trade Journal</h3>
                </div>
                <Link href="/journal" className="text-[11px] font-mono text-positive hover:underline">
                  View All
                </Link>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {journal.length > 0 ? (
                  journal.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-mono font-medium text-[13px] text-text-primary uppercase">{entry.ticker}</span>
                        <span className="text-[10px] text-text-muted font-mono">{entry.date}</span>
                      </div>
                      <Badge variant={entry.outcome === "Won" ? "buy" : "sell"} className="font-mono">
                        {entry.pnlPercent >= 0 ? "+" : ""}{entry.pnlPercent?.toFixed(2)}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <LineChart className="h-8 w-8 text-text-muted mx-auto mb-2 opacity-30" />
                    <p className="text-[11px] text-text-muted font-mono uppercase">No recent trade entries</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ROW 4: Economic Events Horizontal Scroll */}
        <Card variant="terminal">
          <CardHeader className="py-3 flex flex-row items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-info" />
              <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Economic Catalyst Horizon</h3>
            </div>
            <Link href="/calendar" className="text-[11px] font-mono text-positive hover:underline">
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
                    "min-w-[240px] flex-1 rounded-[8px] border-l-[3px] border-y border-r border-border bg-bg-secondary p-3.5 shrink-0 transition-colors hover:border-border-emphasis",
                    evt.impact === "high"
                      ? "border-l-negative"
                      : evt.impact === "medium"
                      ? "border-l-neutral"
                      : "border-l-text-secondary"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-text-muted">{evt.time}</span>
                    <Badge variant={evt.impact === "high" ? "high" : evt.impact === "medium" ? "medium" : "low"}>
                      {evt.impact}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-medium text-text-primary truncate">{evt.event}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

