"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun, Command } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { apiClient } from "@/lib/api-client";
import { cn, formatPercent } from "@/lib/utils";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [indices, setIndices] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    fetchIndices();
    const interval = setInterval(fetchIndices, 30000); // 30s refresh
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

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full flex-col border-b border-border bg-bg-primary/80 backdrop-blur-md">
      {/* Ticker Tape */}
      <div className="flex h-8 w-full items-center overflow-hidden bg-bg-sidebar border-b border-white/5 px-4">
        <div className="flex animate-marquee whitespace-nowrap gap-8 py-1">
          {indices.length > 0 ? (
            indices.map((index, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-bold text-white uppercase">{index.symbol.replace('^', '')}</span>
                <span className="text-text-secondary">{index.price?.toLocaleString()}</span>
                <span className={cn(
                  "font-medium",
                  index.change >= 0 ? "text-accent" : "text-red"
                )}>
                  {formatPercent(index.changePercent)}
                </span>
              </div>
            ))
          ) : (
            <div className="flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 w-32 animate-pulse bg-white/10 rounded"></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Topbar Content */}
      <div className="flex h-12 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold capitalize text-text-primary">
              Market Intelligence
            </h2>
            <p className="text-[10px] text-text-muted">
              {format(currentTime, "EEEE, MMMM do, yyyy")}
            </p>
          </div>

          <div className="relative group md:flex hidden items-center">
            <Search className="absolute left-3 h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search ticker (CMD+K)..."
              className="h-8 w-64 rounded-lg bg-bg-secondary border border-border pl-10 pr-10 text-xs focus:border-accent focus:outline-none transition-all"
            />
            <div className="absolute right-3 hidden items-center gap-1 md:flex">
                <Command className="h-3 w-3 text-text-muted" />
                <span className="text-[10px] text-text-muted">K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-1.5 hover:bg-bg-secondary transition-colors group">
            <Bell className="h-5 w-5 text-text-secondary group-hover:text-text-primary" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent border-2 border-bg-primary"></span>
          </button>
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-1.5 hover:bg-bg-secondary transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-text-secondary" />
            ) : (
              <Moon className="h-5 w-5 text-text-secondary" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
