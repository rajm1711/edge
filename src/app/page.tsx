"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { PageShell } from "@/components/layout/PageShell";
import { EarningsStocksTable } from "@/components/dashboard/EarningsStocksTable";
import { WatchlistTable } from "@/components/dashboard/WatchlistTable";
import { Pagination } from "@/components/ui/Pagination";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Calendar, TrendingUp, Star, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DEFAULT_WATCHLIST = "AAPL,NVDA,TSLA,MSFT,AMZN,META,GOOGL,AMD,NFLX,PLTR,COIN,JPM,V,WMT,DIS";
const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [earningsStocks, setEarningsStocks] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [quotesMap, setQuotesMap] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [showEarnings, setShowEarnings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    const [earningsRes, watchlistRes] = await Promise.all([
      apiClient.getEarningsCalendar(),
      apiClient.getWatchlist(DEFAULT_WATCHLIST),
    ]);

    if (earningsRes.success) setEarningsStocks(earningsRes.data || []);
    if (watchlistRes.success) setWatchlist(watchlistRes.data || []);

    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Filter data based on search query
  const filterData = (data: any[]) => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      if (showEarnings) {
        return (
          item.ticker?.toLowerCase().includes(query) ||
          item.companyName?.toLowerCase().includes(query)
        );
      } else {
        return item.symbol?.toLowerCase().includes(query);
      }
    });
  };

  // Reset page when switching between earnings and watchlist or searching
  const handleToggle = (showEarningsData: boolean) => {
    setShowEarnings(showEarningsData);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Get current page data
  const currentData = showEarnings ? earningsStocks : watchlist;
  const filteredData = filterData(currentData);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Fetch real-time quotes for visible earnings tickers
  useEffect(() => {
    if (showEarnings && paginatedData.length > 0) {
      const tickersToFetch = paginatedData
        .map((item: any) => item.ticker)
        .filter((t: string) => t && !watchlist.some((w: any) => w.symbol === t) && !quotesMap[t]);

      if (tickersToFetch.length > 0) {
        apiClient.getWatchlist(tickersToFetch.join(",")).then((res) => {
          if (res.success && res.data) {
            const newMap: Record<string, any> = {};
            res.data.forEach((q: any) => {
              newMap[q.symbol] = q;
            });
            setQuotesMap((prev) => ({ ...prev, ...newMap }));
          }
        });
      }
    }
  }, [showEarnings, currentPage, earningsStocks, watchlist, quotesMap]);

  // Merge earnings data with stock data for display
  const displayData = paginatedData.map((item: any) => {
    if (showEarnings) {
      const stockData = watchlist.find((stock: any) => stock.symbol === item.ticker) || quotesMap[item.ticker];
      return {
        ...item,
        price: stockData?.price,
        change: stockData?.change,
        changePercent: stockData?.changePercent,
        high: stockData?.high,
        low: stockData?.low,
        volume: stockData?.volume,
      };
    }
    return item;
  });

  return (
    <PageShell>
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-sans text-[28px] font-semibold text-[var(--foreground)]">Market Intelligence</h1>
            <p className="text-[var(--foreground-muted)] mt-1 uppercase font-sans text-[11px] tracking-[0.06em] font-medium">Earnings & Watchlist Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 bg-[var(--background-secondary)] rounded-[10px] px-4 py-2 border border-[var(--border)] h-[40px]">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-sans font-medium text-[var(--foreground-muted)] uppercase">Last Updated</span>
                <span className="text-[12px] font-mono font-medium text-[var(--foreground)]">
                  {format(lastUpdated, "HH:mm:ss")} ET
                </span>
              </div>
              <button
                onClick={fetchData}
                disabled={isLoading}
                className={cn(
                  "p-2 hover:bg-[var(--background-tertiary)] rounded-[8px] transition-all active:scale-95 disabled:opacity-50",
                  isLoading && "animate-spin"
                )}
              >
                <RefreshCw className="h-4 w-4 text-[#00d084]" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Toggle Section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder={`Search ${showEarnings ? 'ticker or company name' : 'ticker'}...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-[8px] font-mono text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--border-emphasis)] transition-all"
            />
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleToggle(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[8px] font-sans text-[12px] font-medium uppercase tracking-wider transition-all",
                showEarnings
                  ? "bg-[#00d084] text-black"
                  : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-[var(--background-tertiary)] border border-[var(--border)]"
              )}
            >
              <Calendar className="h-4 w-4" />
              Earnings Stocks ({earningsStocks.length})
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[8px] font-sans text-[12px] font-medium uppercase tracking-wider transition-all",
                !showEarnings
                  ? "bg-[#00d084] text-black"
                  : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-[var(--background-tertiary)] border border-[var(--border)]"
              )}
            >
              <Star className="h-4 w-4" />
              Watchlist ({watchlist.length})
            </button>
          </div>
        </div>

        {/* Main Content */}
        <Card variant="default">
          <CardHeader className="flex flex-row justify-between items-center py-3">
            <div className="flex flex-col">
              <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
                {showEarnings ? "Upcoming Earnings" : "Watchlist Overview"}
              </h3>
              {searchQuery && (
                <span className="text-[10px] font-mono text-[var(--foreground-muted)] mt-1">
                  Search results for "{searchQuery}"
                </span>
              )}
            </div>
            <Badge variant="outline" className="font-mono">
              {filteredData.length} {searchQuery ? 'found' : 'symbols'} {searchQuery && `of ${currentData.length}`}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {showEarnings ? (
              <EarningsStocksTable data={displayData} isLoading={isLoading} />
            ) : (
              <WatchlistTable data={displayData} isLoading={isLoading} />
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-[var(--border)] p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mb-4"
                />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length}
                    {searchQuery && ` (found of ${currentData.length} total)`}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
