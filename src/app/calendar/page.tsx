"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Filter, Layers, Zap, X, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

type TabType = "economic" | "earnings";
type ImpactFilter = "all" | "high" | "medium" | "low";

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<TabType>("economic");
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>("all");
  
  const [economicEvents, setEconomicEvents] = useState<any[]>([]);
  const [earningsReports, setEarningsReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Event Explainer Modal State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [explainerData, setExplainerData] = useState<any | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [ecoRes, earnRes] = await Promise.all([
        apiClient.getEconomicCalendar(),
        apiClient.getEarningsCalendar()
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
      previous: event.previous || "N/A"
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

  const filteredEvents = economicEvents.filter(e => 
    impactFilter === "all" ? true : e.impact?.toLowerCase() === impactFilter
  );

  return (
    <PageShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bebas tracking-wide text-text-primary">Market Calendar</h1>
          <p className="text-text-muted mt-1">Economic events & upcoming earnings</p>
        </div>
        
        <div className="flex bg-bg-secondary p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab("economic")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "economic" ? "bg-bg-card shadow text-text-primary" : "text-text-muted hover:text-text-primary"}`}
          >
            Economic Events
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "earnings" ? "bg-bg-card shadow text-text-primary" : "text-text-muted hover:text-text-primary"}`}
          >
            Earnings Reports
          </button>
        </div>
      </div>

      {activeTab === "economic" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-muted" />
            <span className="text-sm text-text-muted mr-2">Impact:</span>
            {["all", "high", "medium", "low"].map(filter => (
              <button
                key={filter}
                onClick={() => setImpactFilter(filter as ImpactFilter)}
                className={`px-3 py-1 text-xs rounded-full capitalize transition ${impactFilter === filter ? "bg-accent text-white" : "bg-bg-secondary text-text-secondary hover:bg-bg-card"}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <Card variant="default">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-bg-secondary text-text-muted text-xs uppercase font-mono border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Time / Impact</th>
                    <th className="px-4 py-3 font-medium">Event</th>
                    <th className="px-4 py-3 font-medium">Actual</th>
                    <th className="px-4 py-3 font-medium">Estimate</th>
                    <th className="px-4 py-3 font-medium">Previous</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-text-secondary">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-4"><Skeleton className="h-8 w-full" /></td>
                    </tr>
                  ) : filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-text-muted">No events found matching your filter.</td>
                    </tr>
                  ) : (
                    filteredEvents.map((ev, i) => (
                      <tr key={i} className={`hover:bg-bg-secondary/50 transition ${ev.impact?.toLowerCase() === 'high' ? 'border-l-2 border-l-red' : ''}`}>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-mono text-text-primary">{ev.time}</span>
                            <Badge variant={ev.impact?.toLowerCase() === 'high' ? 'danger' : ev.impact?.toLowerCase() === 'medium' ? 'warning' : 'outline'} className="w-fit text-[10px] px-1.5 py-0 leading-tight">
                              {ev.impact?.toUpperCase()}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-text-primary font-medium flex items-center gap-2">
                          {ev.country === "US" ? "🇺🇸" : ev.country} {ev.event}
                        </td>
                        <td className="px-4 py-4 font-mono">{ev.actual || "-"}</td>
                        <td className="px-4 py-4 font-mono">{ev.estimate || "-"}</td>
                        <td className="px-4 py-4 font-mono">{ev.previous || "-"}</td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => handleExplainEvent(ev)}
                            className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition bg-accent/10 hover:bg-accent/20 px-2 py-1 rounded"
                          >
                            <Zap className="h-3 w-3 fill-accent/20" /> Explain
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
        <Card variant="default">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-bg-secondary text-text-muted text-xs uppercase font-mono border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Date / Time</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">EPS Est</th>
                  <th className="px-4 py-3 font-medium">Rev Est</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-text-secondary">
                {isLoading ? (
                   <tr>
                     <td colSpan={5} className="p-4"><Skeleton className="h-8 w-full" /></td>
                   </tr>
                ) : earningsReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-muted">No upcoming earnings reports found for the next 7 days.</td>
                  </tr>
                ) : (
                  earningsReports.map((report, i) => (
                    <tr key={i} className="hover:bg-bg-secondary/50 transition">
                      <td className="px-4 py-4 font-mono">
                        {report.date} <span className="text-text-muted ml-1 text-xs uppercase">({report.hour})</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-text-primary">{report.ticker}</span>
                          <span className="text-xs text-text-muted truncate max-w-[200px]">{report.companyName || report.ticker}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono">{report.epsEstimate ? `$${Number(report.epsEstimate).toFixed(2)}` : "-"}</td>
                      <td className="px-4 py-4 font-mono">{report.revenueEstimate ? `$${(Number(report.revenueEstimate)/1e9).toFixed(2)}B` : "-"}</td>
                      <td className="px-4 py-4">
                        <Link href={`/research?ticker=${report.ticker}`} className="text-xs text-blue hover:underline">
                          Research →
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

      {/* Slide-in Panel for Event Explainer */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-bg-card h-full border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300">
             <div className="flex items-center justify-between p-6 border-b border-border">
               <div>
                 <h2 className="text-lg font-bebas tracking-wide flex items-center gap-2">
                   <Zap className="h-4 w-4 text-accent fill-accent/20" /> Event Explainer
                 </h2>
                 <p className="text-xs font-mono text-text-muted mt-1 truncate w-64">{selectedEvent.event}</p>
               </div>
               <button onClick={closeExplainer} className="p-2 hover:bg-bg-secondary rounded-full transition text-text-secondary">
                 <X className="h-5 w-5" />
               </button>
             </div>

             <div className="p-6 overflow-y-auto flex-1 bg-bg-primary">
               {isExplaining ? (
                 <div className="space-y-6">
                   <Skeleton className="h-24 w-full rounded-xl" />
                   <Skeleton className="h-32 w-full rounded-xl" />
                   <Skeleton className="h-24 w-full rounded-xl" />
                 </div>
               ) : explainerData ? (
                 <div className="space-y-8">
                   <div>
                     <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-2 block">What Is It?</span>
                     <p className="text-sm text-text-primary leading-relaxed bg-bg-secondary p-3 rounded-lg border border-border">
                       {explainerData.whatIsIt}
                     </p>
                   </div>
                   
                   <div>
                     <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted mb-2 block">Why It Matters</span>
                     <p className="text-sm text-text-secondary leading-relaxed">
                       {explainerData.whyItMatters}
                     </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-bg-card border border-border p-3 rounded-xl flex flex-col items-center justify-center text-center">
                       <span className="text-[10px] font-mono uppercase text-text-muted mb-1 block">Implied Impact</span>
                       <Badge variant={
                         explainerData.marketImpact?.toLowerCase() === "bullish" ? "success" :
                         explainerData.marketImpact?.toLowerCase() === "bearish" ? "danger" : "outline"
                       }>
                         {explainerData.marketImpact?.toUpperCase()}
                       </Badge>
                     </div>
                     <div className="bg-bg-card border border-border p-3 rounded-xl">
                       <span className="text-[10px] font-mono uppercase text-text-muted mb-2 block text-center">Affected Sectors</span>
                       <div className="flex flex-wrap gap-1 justify-center">
                         {explainerData.affectedSectors?.map((s: string, i: number) => (
                           <span key={i} className="text-[10px] bg-bg-secondary px-2 py-1 rounded text-text-primary whitespace-nowrap">{s}</span>
                         ))}
                       </div>
                     </div>
                   </div>

                   <div className="border border-yellow/30 bg-yellow/5 p-4 rounded-xl flex gap-3">
                     <AlertTriangle className="h-5 w-5 text-yellow shrink-0 mt-0.5" />
                     <div>
                       <span className="block text-xs font-bold text-yellow mb-1">Trading Implication</span>
                       <span className="text-sm text-text-primary/90 leading-snug">{explainerData.tradingImplication}</span>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="text-center text-text-muted p-8">Failed to generate explanation.</div>
               )}
             </div>
          </div>
        </div>
      )}
      </div>
    </PageShell>
  );
}
