"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { cn, formatPercent } from "@/lib/utils";
import { TickerBar } from "@/components/terminal/TickerBar";

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
      {/* Live Market Ticker Tape */}
      <TickerBar />

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

