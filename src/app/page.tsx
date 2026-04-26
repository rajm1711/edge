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
        // Search in ticker, company name for earnings stocks
        return (
          item.ticker?.toLowerCase().includes(query) ||
          item.companyName?.toLowerCase().includes(query)
        );
      } else {
        // Search in symbol for watchlist
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

  // Merge earnings data with stock data for display
  const displayData = paginatedData.map((item: any) => {
    if (showEarnings) {
      // Find corresponding stock data from watchlist
      const stockData = watchlist.find((stock: any) => stock.symbol === item.ticker);
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
            <h1 className="font-bebas text-5xl tracking-tight text-text-primary">Market Intelligence</h1>
            <p className="text-text-muted mt-1 uppercase font-mono text-[10px] tracking-[0.3em]">Earnings & Watchlist Overview</p>
          </div>
          <div className="flex items-center gap-3">
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

        {/* Search and Toggle Section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder={`Search ${showEarnings ? 'ticker or company name' : 'ticker'}...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border rounded-lg font-mono text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleToggle(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all",
                showEarnings
                  ? "bg-accent text-bg-sidebar shadow-md"
                  : "bg-bg-secondary text-text-muted hover:bg-border"
              )}
            >
              <Calendar className="h-4 w-4" />
              Earnings Stocks ({earningsStocks.length})
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all",
                !showEarnings
                  ? "bg-accent text-bg-sidebar shadow-md"
                  : "bg-bg-secondary text-text-muted hover:bg-border"
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
              <h3 className="font-bebas text-lg tracking-wide uppercase">
                {showEarnings ? "Upcoming Earnings" : "Watchlist Overview"}
              </h3>
              {searchQuery && (
                <span className="text-[10px] font-mono text-text-muted mt-1">
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
              <div className="border-t border-border p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mb-4"
                />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-text-muted">
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
