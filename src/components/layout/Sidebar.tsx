"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  BookOpen, 
  BarChart2, 
  Calendar, 
  Bell, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Research", href: "/research", icon: Search },
  { name: "Sentiment", href: "/sentiment", icon: TrendingUp },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Market Bias", href: "/market-bias", icon: BarChart2 },
  { name: "Economic Calendar", href: "/calendar", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar (fixed 220px width, #060a0f background always) */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[220px] flex-col border-r border-[#1a2540] bg-[#060a0f] py-6 text-white md:flex">
        {/* Logo Section */}
        <div className="mb-6 px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-sm bg-[#00d084]" />
            <span className="font-bebas text-[22px] tracking-wider text-white">EDGEIQ</span>
          </Link>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">
            PRO ANALYST
          </p>
        </div>

        {/* AI Badge */}
        <div className="mx-4 mb-6">
          <div className="flex items-center gap-2 rounded-[6px] border border-[rgba(0,208,132,0.20)] bg-[rgba(0,208,132,0.10)] px-2.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d084] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00d084]" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#00d084]">
              AI ENGINE LIVE
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 pr-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-xs transition-all duration-150 font-sans",
                  isActive
                    ? "rounded-r-[8px] border-l-2 border-l-[#00d084] bg-[rgba(0,208,132,0.12)] text-white font-semibold"
                    : "rounded-[8px] ml-3 text-[#94a3b8] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#00d084]" : "text-[#94a3b8] group-hover:text-white"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-1.5 px-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-[8px] px-3 py-2 text-xs transition-colors font-sans",
              pathname === "/settings"
                ? "bg-[rgba(255,255,255,0.08)] text-white font-medium"
                : "text-[#94a3b8] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>

          {/* User Card */}
          <div className="flex items-center gap-3 rounded-[8px] bg-[rgba(255,255,255,0.06)] p-2.5 border border-[rgba(255,255,255,0.08)] mt-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00d084] text-xs font-bold text-black">
              GS
            </div>
            <div className="overflow-hidden">
              <p className="text-[12px] font-medium text-white truncate leading-tight">Analyst Terminal</p>
              <p className="text-[11px] text-[#94a3b8] truncate">Institutional Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (64px height, #060a0f background) */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-[64px] w-full items-center justify-around border-t border-[#1a2540] bg-[#060a0f] px-2 md:hidden">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-[#00d084]" : "text-[#94a3b8] hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-sans font-medium">
                {item.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

