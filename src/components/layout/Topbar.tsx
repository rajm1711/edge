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
    if (pathname === "/dashboard" || pathname === "/") return "Dashboard";
    if (pathname === "/research") return "Research";
    if (pathname === "/sentiment") return "Sentiment Analysis";
    if (pathname === "/market-bias") return "Market Bias";
    if (pathname === "/calendar") return "Economic Calendar";
    if (pathname === "/journal") return "Trade Journal";
    if (pathname === "/settings") return "Settings";
    if (pathname === "/about") return "About";
    if (pathname === "/architecture") return "Architecture";
    return "Market Intelligence";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/research?ticker=${searchQuery.trim().toUpperCase()}`);
    }
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Row 1 — Ticker Tape (36px) */}
      <TickerBar />

      {/* Row 2 — Main Bar (60px) */}
      <div className="flex h-[60px] items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--background)] max-w-full overflow-x-hidden">
        {/* Left: Page Title + Date */}
        <div className="flex flex-col">
          <h1 className="font-sans text-[16px] font-semibold text-[var(--foreground)] leading-none">
            {getPageTitle()}
          </h1>
          <p className="font-sans text-[11px] text-[var(--foreground-muted)] mt-1">
            {format(currentTime, "EEEE, MMMM d, yyyy · HH:mm:ss")} ET
          </p>
        </div>

        {/* Right: Search, Notifications & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--foreground-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker... ⌘K"
              className="h-[36px] w-[200px] rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] pl-9 pr-3 text-[12px] font-sans text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--border-emphasis)] focus:outline-none transition-all"
            />
          </form>

          {/* Notification Bell */}
          <button className="relative flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[var(--border)] bg-transparent text-[var(--foreground-secondary)] hover:border-[var(--border-emphasis)] hover:text-[var(--foreground)] transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#00d084]" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[var(--border)] bg-transparent text-[var(--foreground-secondary)] hover:border-[var(--border-emphasis)] hover:text-[var(--foreground)] transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
