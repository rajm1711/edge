"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { cn, formatPercent } from "@/lib/utils";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [indices, setIndices] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchIndices();
    const interval = setInterval(fetchIndices, 30000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  async function fetchIndices() {
    const response = await apiClient.getIndices();
    if (response.success && response.data) {
      setIndices(response.data);
    }
  }

  const getPageTitle = () => {
    if (pathname === "/dashboard" || pathname === "/") return "DASHBOARD";
    if (pathname === "/research") return "RESEARCH TERMINAL";
    if (pathname === "/sentiment") return "SENTIMENT ANALYSIS";
    if (pathname === "/market-bias") return "AI MARKET BIAS";
    if (pathname === "/calendar") return "ECONOMIC CALENDAR";
    if (pathname === "/journal") return "TRADE JOURNAL";
    if (pathname === "/settings") return "SETTINGS";
    return "MARKET INTELLIGENCE";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/research?ticker=${searchQuery.trim().toUpperCase()}`);
    }
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 flex flex-col w-full max-w-full overflow-x-hidden bg-[var(--bg-primary)]">
      {/* Ticker Tape Row (Height: 36px, Background: #040810) */}
      <div className="flex h-[36px] w-full max-w-full items-center overflow-hidden bg-[#040810] border-b border-[#1a2540] px-4">
        <div className="flex animate-marquee whitespace-nowrap gap-6 py-1 items-center">
          {(indices.length > 0 ? indices : [
            { symbol: "^GSPC", name: "S&P 500", price: 5812.40, change: 12.3, changePercent: 0.21 },
            { symbol: "^IXIC", name: "NASDAQ", price: 18415.20, change: -45.1, changePercent: -0.24 },
            { symbol: "^DJI", name: "DOW", price: 42110.50, change: 105.8, changePercent: 0.25 },
            { symbol: "^VIX", name: "VIX", price: 15.42, change: -0.85, changePercent: -5.22 },
            { symbol: "BTC-USD", name: "BTC", price: 68420.00, change: 1450.0, changePercent: 2.16 }
          ]).concat(indices).map((item, i) => {
            const isPos = item.change >= 0;
            return (
              <div key={i} className="flex items-center gap-2 font-mono text-[12px]">
                <span className="text-[11px] text-[#4a5568] uppercase font-mono">
                  {item.symbol?.replace('^', '') || item.name}
                </span>
                <span className="text-white font-medium font-mono">
                  {typeof item.price === "number" ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price}
                </span>
                <span className={cn("font-mono text-[11px] font-medium", isPos ? "text-[#00d084]" : "text-[#ff4d4d]")}>
                  {isPos ? "+" : ""}{formatPercent(item.changePercent)}
                </span>
                <span className="text-[#4a5568] ml-2">·</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Bar Row (Height: 68px, Border-bottom: 1px border) */}
      <div className="flex h-[68px] items-center justify-between px-6 border-b border-border bg-[var(--bg-primary)] max-w-full overflow-x-hidden">
        {/* Left: Title & Date */}
        <div className="flex flex-col">
          <h1 className="font-bebas text-[24px] tracking-wide text-text-primary leading-none">
            {getPageTitle()}
          </h1>
          <p className="font-sans text-[11px] text-text-muted mt-0.5">
            {format(currentTime, "EEEE, MMMM d, yyyy · HH:mm:ss")} ET
          </p>
        </div>

        {/* Right: Search, Notifications & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker... ⌘K"
              className="h-[34px] w-[160px] rounded-[8px] border border-border bg-bg-card pl-9 pr-3 text-[12px] font-sans text-text-primary placeholder-text-muted focus:border-border-emphasis focus:outline-none focus:w-[200px] transition-all"
            />
          </form>

          {/* Bell Icon Button */}
          <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-border bg-bg-card transition-colors hover:border-border-emphasis">
            <Bell className="h-[15px] w-[15px] text-text-secondary" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-border bg-bg-card transition-colors hover:border-border-emphasis"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[15px] w-[15px] text-text-secondary" />
            ) : (
              <Moon className="h-[15px] w-[15px] text-text-secondary" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

