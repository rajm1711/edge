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

  const filteredEvents = economicEvents.filter((e) =>
    impactFilter === "all" ? true : e.impact?.toLowerCase() === impactFilter
  );

  return (
    <PageShell>
      <div className="w-full max-w-[1600px] mx-auto space-y-6 font-sans min-w-0">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] text-info uppercase tracking-wider">CATALYST INTELLIGENCE</span>
            <h1 className="font-bebas text-[28px] tracking-wide uppercase text-text-primary">Economic & Earnings Calendar</h1>
          </div>

          <div className="flex bg-bg-secondary p-1 rounded-[8px] border border-border">
            <button
              onClick={() => setActiveTab("economic")}
              className={cn(
                "px-5 py-2 text-[12px] font-mono uppercase tracking-wider font-medium rounded-[6px] transition-colors",
                activeTab === "economic" ? "bg-bg-hover text-positive shadow" : "text-text-secondary hover:text-text-primary"
              )}
            >
              Economic Catalysts
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={cn(
                "px-5 py-2 text-[12px] font-mono uppercase tracking-wider font-medium rounded-[6px] transition-colors",
                activeTab === "earnings" ? "bg-bg-hover text-positive shadow" : "text-text-secondary hover:text-text-primary"
              )}
            >
              Corporate Earnings
            </button>
          </div>
        </div>

        {activeTab === "economic" && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-text-muted" />
              <span className="font-mono text-[11px] text-text-muted uppercase mr-2">Impact Level:</span>
              {(["all", "high", "medium", "low"] as ImpactFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setImpactFilter(filter)}
                  className={cn(
                    "px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[4px] border transition-colors",
                    impactFilter === filter
                      ? "bg-bg-hover text-positive border-positive"
                      : "bg-bg-secondary text-text-secondary border-border hover:text-text-primary"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Economic Events Table */}
            <Card variant="terminal">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] whitespace-nowrap">
                  <thead className="bg-bg-secondary text-text-muted text-[11px] uppercase font-sans font-medium border-b border-border">
                    <tr>
                      <th className="px-5 py-3 font-sans">Time / Impact</th>
                      <th className="px-5 py-3 font-sans">Economic Event</th>
                      <th className="px-5 py-3 font-sans">Actual</th>
                      <th className="px-5 py-3 font-sans">Estimate</th>
                      <th className="px-5 py-3 font-sans">Previous</th>
                      <th className="px-5 py-3 font-sans text-right">AI Explainer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-text-primary">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="p-6">
                          <Skeleton className="h-8 w-full" />
                        </td>
                      </tr>
                    ) : filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-text-muted font-mono">
                          No events found matching your impact filter.
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((ev, i) => (
                        <tr
                          key={i}
                          className={cn(
                            "hover:bg-bg-hover transition-colors",
                            ev.impact?.toLowerCase() === "high" ? "border-l-[3px] border-l-negative" : ""
                          )}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex flex-col gap-1">
                              <span className="font-mono text-text-primary">{ev.time}</span>
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
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-text-primary">
                            {ev.country === "US" ? "🇺🇸" : ev.country} {ev.event}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-positive font-medium">{ev.actual || "-"}</td>
                          <td className="px-5 py-3.5 font-mono text-text-secondary">{ev.estimate || "-"}</td>
                          <td className="px-5 py-3.5 font-mono text-text-muted">{ev.previous || "-"}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleExplainEvent(ev)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-ai-purple-dim border border-border text-ai-purple hover:bg-ai-purple-dim/80 font-mono text-[11px] uppercase tracking-wider transition-colors"
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
          <Card variant="terminal">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] whitespace-nowrap">
                <thead className="bg-bg-secondary text-text-muted text-[11px] uppercase font-sans font-medium border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-sans">Date & Session</th>
                    <th className="px-5 py-3 font-sans">Ticker & Company</th>
                    <th className="px-5 py-3 font-sans">EPS Consensus</th>
                    <th className="px-5 py-3 font-sans">Revenue Est</th>
                    <th className="px-5 py-3 font-sans text-right">Research Terminal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text-primary">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-6">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ) : earningsReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-text-muted font-mono">
                        No upcoming earnings reports found for the next 7 days.
                      </td>
                    </tr>
                  ) : (
                    earningsReports.map((report, i) => (
                      <tr key={i} className="hover:bg-bg-hover transition-colors">
                        <td className="px-5 py-3.5 font-mono">
                          <span className="text-text-primary">{report.date}</span>{" "}
                          <span className="text-text-muted uppercase text-[10px]">({report.hour})</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-mono font-medium text-[13px] text-text-primary uppercase">{report.ticker}</span>
                            <span className="text-[11px] text-text-secondary truncate max-w-[220px]">{report.companyName || report.ticker}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-text-primary">
                          {report.epsEstimate ? `$${Number(report.epsEstimate).toFixed(2)}` : "-"}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-text-primary">
                          {report.revenueEstimate ? `$${(Number(report.revenueEstimate) / 1e9).toFixed(2)}B` : "-"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/research?ticker=${report.ticker}`}
                            className="inline-flex items-center text-[11px] font-mono text-positive hover:underline"
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
                  <span className="font-mono text-[10px] text-ai-purple uppercase tracking-wider block mb-1">
                    Event Overview
                  </span>
                  <p className="text-[13px] text-text-primary leading-relaxed bg-bg-secondary p-3.5 rounded-[8px] border border-border">
                    {explainerData.whatIsIt}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1">
                    Institutional Significance
                  </span>
                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    {explainerData.whyItMatters}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg-secondary border border-border p-3 rounded-[8px] flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-[10px] text-text-muted uppercase mb-1">Implied Impact</span>
                    <Badge variant={explainerData.marketImpact?.toLowerCase() === "bullish" ? "bullish" : "bearish"}>
                      {explainerData.marketImpact?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-bg-secondary border border-border p-3 rounded-[8px] flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-[10px] text-text-muted uppercase mb-1">Affected Sectors</span>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {explainerData.affectedSectors?.map((s: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono bg-bg-card px-1.5 py-0.5 rounded text-text-primary">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[8px] border-l-[3px] border-l-neutral border-y border-r border-border bg-neutral/10 p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-mono text-[11px] font-medium uppercase">Trading Playbook Implication</span>
                  </div>
                  <p className="text-[12px] text-text-primary leading-relaxed">{explainerData.tradingImplication}</p>
                </div>
              </div>
            )
          )}
        </SlidePanel>
      </div>
    </PageShell>
  );
}

