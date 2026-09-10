"use client";

import { useState, useEffect } from "react";
import { Filter, Zap, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type TabType = "economic" | "earnings";
type ImpactFilter = "all" | "high" | "medium" | "low";

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<TabType>("economic");
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>("all");

  const [economicEvents, setEconomicEvents] = useState<any[]>([]);
  const [earningsReports, setEarningsReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // AI Explainer Drawer State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [explainerData, setExplainerData] = useState<any | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [ecoRes, earnRes] = await Promise.all([
        apiClient.getEconomicCalendar(),
        apiClient.getEarningsCalendar(),
      ]);

      if (ecoRes.success) setEconomicEvents(ecoRes.data || []);
      if (earnRes.success) setEarningsReports(earnRes.data || []);

      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleExplainEvent = async (event: any) => {
    setSelectedEvent(event);
    setExplainerData(null);
    setIsExplaining(true);

    const res = await apiClient.eventExplainerAI({
      eventName: event.event,
      actual: event.actual || "N/A",
      estimate: event.estimate || "N/A",
      previous: event.previous || "N/A",
    });

    if (res.success && res.data) {
      setExplainerData(res.data);
    }

    setIsExplaining(false);
  };

  const closeExplainer = () => {
    setSelectedEvent(null);
    setExplainerData(null);
  };

  // Local timezone formatter helper
  const [userTimeZone, setUserTimeZone] = useState<string>("Local Time");

  useEffect(() => {
    try {
      setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "Local Time");
    } catch (e) {
      // fallback
    }
  }, []);

  const formatLocalTime = (timestamp?: number, fallback?: string) => {
    if (!timestamp) return fallback || "-";
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch (e) {
      return fallback || "-";
    }
  };

  const [currencyFilter, setCurrencyFilter] = useState<string>("all");

  const filteredEvents = economicEvents.filter((e) => {
    const matchesImpact = impactFilter === "all" ? true : e.impact?.toLowerCase() === impactFilter;
    const matchesCurrency = currencyFilter === "all" ? true : (e.currency || e.country)?.toUpperCase().includes(currencyFilter);
    return matchesImpact && matchesCurrency;
  });

  return (
    <PageShell>
      <div className="w-full max-w-[1600px] mx-auto space-y-6 font-sans min-w-0">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--info)] uppercase tracking-wider">CATALYST INTELLIGENCE</span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[var(--positive)]/10 text-[var(--positive)] border border-[var(--positive)]/20 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--positive)] animate-pulse" />
                TODAY: {format(new Date(), "EEEE, MMM d, yyyy")}
              </span>
            </div>
            <h1 className="font-sans text-2xl font-bold uppercase tracking-tight text-[var(--foreground)] mt-1">Economic &amp; Earnings Calendar</h1>
          </div>

          <div className="flex bg-[var(--background-secondary)] p-1 rounded-[10px] border border-[var(--border)]">
            <button
              onClick={() => setActiveTab("economic")}
              className={cn(
                "px-4 py-1.5 text-[12px] font-mono uppercase tracking-wider font-semibold rounded-[8px] transition-all",
                activeTab === "economic" ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              Economic Catalysts
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={cn(
                "px-4 py-1.5 text-[12px] font-mono uppercase tracking-wider font-semibold rounded-[8px] transition-all",
                activeTab === "earnings" ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              Corporate Earnings
            </button>
          </div>
        </div>

        {activeTab === "economic" && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-[var(--foreground-muted)]" />
                  <span className="font-mono text-[11px] text-[var(--foreground-muted)] uppercase">Impact:</span>
                  {(["all", "high", "medium", "low"] as ImpactFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setImpactFilter(filter)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[6px] border transition-all",
                        impactFilter === filter
                          ? "bg-[var(--accent)] text-black border-[var(--accent)] font-semibold"
                          : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] border-[var(--border)] hover:text-[var(--foreground)]"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 border-l border-[var(--border)] pl-3">
                  <span className="font-mono text-[11px] text-[var(--foreground-muted)] uppercase">Currency:</span>
                  {(["all", "USD", "EUR", "GBP", "AUD"] as string[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrencyFilter(curr)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[6px] border transition-all",
                        currencyFilter === curr
                          ? "bg-[var(--positive)] text-black border-[var(--positive)] font-semibold"
                          : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] border-[var(--border)] hover:text-[var(--foreground)]"
                      )}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <span className="font-mono text-[10px] text-[var(--foreground-muted)] uppercase flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-[var(--accent)]" /> Timezone: <strong className="text-[var(--foreground)]">{userTimeZone}</strong>
              </span>
            </div>

            {/* Economic Events Table */}
            <Card variant="terminal" className="rounded-[16px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] whitespace-nowrap">
                  <thead className="bg-[var(--background-secondary)] text-[var(--foreground-muted)] text-[10px] uppercase font-mono tracking-wider border-b border-[var(--border)] h-9">
                    <tr>
                      <th className="px-4 font-mono">Time ({userTimeZone})</th>
                      <th className="px-4 font-mono">Currency</th>
                      <th className="px-4 font-mono">Impact</th>
                      <th className="px-4 font-mono">Economic Event</th>
                      <th className="px-4 font-mono">Actual</th>
                      <th className="px-4 font-mono">Forecast</th>
                      <th className="px-4 font-mono">Previous</th>
                      <th className="px-4 font-mono text-right">AI Explainer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="p-6">
                          <Skeleton className="h-8 w-full" />
                        </td>
                      </tr>
                    ) : filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[var(--foreground-muted)] font-mono">
                          No events found matching your filter selections.
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((ev, i) => (
                        <tr
                          key={i}
                          className={cn(
                            "hover:bg-[var(--background-secondary)]/50 transition-colors h-12",
                            ev.impact?.toLowerCase() === "high" ? "border-l-[3px] border-l-[var(--negative)] bg-[var(--negative)]/5" : ""
                          )}
                        >
                          <td className="px-4 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-[var(--positive)]/10 text-[var(--positive)] font-bold text-[9px] uppercase">
                                TODAY
                              </span>
                              <span className="font-mono font-medium text-[var(--foreground)]">
                                {formatLocalTime(ev.timestamp, ev.time)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 font-mono">
                            <span className="px-2 py-0.5 rounded bg-[var(--card-secondary)] border border-[var(--border)] text-[var(--foreground)] font-bold text-[10px]">
                              {ev.currency || "USD"}
                            </span>
                          </td>
                          <td className="px-4">
                            <Badge
                              variant={
                                ev.impact?.toLowerCase() === "high"
                                  ? "high"
                                  : ev.impact?.toLowerCase() === "medium"
                                  ? "medium"
                                  : "low"
                              }
                            >
                              {ev.impact?.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-4 font-medium text-[var(--foreground)]">
                            {ev.country} {ev.event}
                          </td>
                          <td className="px-4 font-mono text-[var(--positive)] font-semibold">{ev.actual || "-"}</td>
                          <td className="px-4 font-mono text-[var(--foreground)] font-medium">{ev.estimate || ev.forecast || "-"}</td>
                          <td className="px-4 font-mono text-[var(--foreground-muted)]">{ev.previous || "-"}</td>
                          <td className="px-4 text-right">
                            <button
                              onClick={() => handleExplainEvent(ev)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--ai-dim)] border border-[var(--border)] text-[var(--ai)] hover:opacity-80 font-mono text-[10px] uppercase tracking-wider transition-colors"
                            >
                              <Zap className="h-3 w-3" /> Explain
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "earnings" && (
          <Card variant="terminal" className="rounded-[16px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] whitespace-nowrap">
                <thead className="bg-[var(--background-secondary)] text-[var(--foreground-muted)] text-[10px] uppercase font-mono tracking-wider border-b border-[var(--border)] h-9">
                  <tr>
                    <th className="px-4 font-mono">Date &amp; Session</th>
                    <th className="px-4 font-mono">Ticker &amp; Company</th>
                    <th className="px-4 font-mono">EPS Consensus</th>
                    <th className="px-4 font-mono">Revenue Est</th>
                    <th className="px-4 font-mono text-right">Research Terminal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-6">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ) : earningsReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--foreground-muted)] font-mono">
                        No upcoming earnings reports found for the next 7 days.
                      </td>
                    </tr>
                  ) : (
                    earningsReports.map((report, i) => (
                      <tr key={i} className={cn("hover:bg-[var(--background-secondary)]/50 transition-colors h-12", report.isToday ? "bg-[var(--positive)]/5" : "")}>
                        <td className="px-4 font-mono">
                          <div className="flex items-center gap-2">
                            {report.isToday && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--positive)] text-black font-bold text-[9px] uppercase">
                                TODAY
                              </span>
                            )}
                            <span className="text-[var(--foreground)] font-medium">{report.displayDate || report.date}</span>{" "}
                            <span className="text-[var(--foreground-muted)] uppercase text-[10px]">({report.hour})</span>
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-[13px] text-[var(--foreground)] uppercase">{report.ticker}</span>
                            <span className="text-[11px] text-[var(--foreground-muted)] truncate max-w-[220px]">{report.companyName || report.ticker}</span>
                          </div>
                        </td>
                        <td className="px-4 font-mono text-[var(--foreground)]">
                          {report.epsEstimate ? `$${Number(report.epsEstimate).toFixed(2)}` : "-"}
                        </td>
                        <td className="px-4 font-mono text-[var(--foreground)]">
                          {report.revenueEstimate ? `$${(Number(report.revenueEstimate) / 1e9).toFixed(2)}B` : "-"}
                        </td>
                        <td className="px-4 text-right">
                          <Link
                            href={`/research?ticker=${report.ticker}`}
                            className="inline-flex items-center text-[11px] font-mono text-[var(--accent)] hover:underline"
                          >
                            Analyze →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* AI Event Explainer SlidePanel Drawer */}
        <SlidePanel
          isOpen={!!selectedEvent}
          onClose={closeExplainer}
          title="AI Catalyst Explainer"
          badge="Live AI"
        >
          {isExplaining ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-[8px]" />
              <Skeleton className="h-32 w-full rounded-[8px]" />
              <Skeleton className="h-20 w-full rounded-[8px]" />
            </div>
          ) : (
            explainerData && (
              <div className="space-y-6 font-sans">
                <div>
                  <span className="font-mono text-[10px] text-[var(--ai)] uppercase tracking-wider block mb-1">
                    Event Overview
                  </span>
                  <p className="text-[13px] text-[var(--foreground)] leading-relaxed bg-[var(--background-secondary)] p-3.5 rounded-[8px] border border-[var(--border)]">
                    {explainerData.whatIsIt}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider block mb-1">
                    Institutional Significance
                  </span>
                  <p className="text-[12px] text-[var(--foreground-muted)] leading-relaxed">
                    {explainerData.whyItMatters}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-3 rounded-[8px] flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-[10px] text-[var(--foreground-muted)] uppercase mb-1">Implied Impact</span>
                    <Badge variant={explainerData.marketImpact?.toLowerCase() === "bullish" ? "bullish" : "bearish"}>
                      {explainerData.marketImpact?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-3 rounded-[8px] flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-[10px] text-[var(--foreground-muted)] uppercase mb-1">Affected Sectors</span>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {explainerData.affectedSectors?.map((s: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono bg-[var(--card)] px-1.5 py-0.5 rounded text-[var(--foreground)]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[8px] border-l-[3px] border-l-[var(--warning)] border-y border-r border-[var(--border)] bg-[var(--warning)]/10 p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-[var(--warning)]">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-mono text-[11px] font-medium uppercase">Trading Playbook Implication</span>
                  </div>
                  <p className="text-[12px] text-[var(--foreground)] leading-relaxed">{explainerData.tradingImplication}</p>
                </div>
              </div>
            )
          )}
        </SlidePanel>
      </div>
    </PageShell>
  );
}

