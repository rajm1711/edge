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
  Info,
  Cpu,
  MoreHorizontal,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Research", href: "/research", icon: Search },
      { name: "Sentiment", href: "/sentiment", icon: TrendingUp },
    ],
  },
  {
    label: "MARKET",
    items: [
      { name: "Market Bias", href: "/market-bias", icon: BarChart2 },
      { name: "Calendar", href: "/calendar", icon: Calendar },
    ],
  },
  {
    label: "PERSONAL",
    items: [
      { name: "Journal", href: "/journal", icon: BookOpen },
    ],
  },
  {
    label: "INFO",
    items: [
      { name: "About", href: "/about", icon: Info },
      { name: "Architecture", href: "/architecture", icon: Cpu },
    ],
  },
];

// Flat items for mobile
const MOBILE_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Research", href: "/research", icon: Search },
  { name: "Sentiment", href: "/sentiment", icon: TrendingUp },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "More", href: "/about", icon: MoreHorizontal },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar — 248px fixed, always dark */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[248px] flex-col border-r border-[var(--border)] bg-[var(--sidebar)] text-white md:flex">
        {/* Logo Section — 60px */}
        <div className="flex h-[60px] items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-sm bg-[#00d084]" />
            <span className="font-sans text-[16px] font-semibold text-white">EdgeIQ</span>
          </Link>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#475569] hover:text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            title="Search (⌘K)"
          >
            <Command className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Navigation — scrollable */}
        <nav className="flex-1 overflow-y-auto pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {/* Section Label */}
              <div className="px-4 pt-4 pb-1.5">
                <span className="text-[10px] uppercase tracking-[0.08em] text-[#475569] font-sans font-medium">
                  {group.label}
                </span>
              </div>

              {/* Nav Items */}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "mx-2 flex h-[36px] items-center gap-2.5 rounded-[8px] px-3 text-[13px] font-sans transition-all duration-150",
                      isActive
                        ? "bg-[rgba(0,208,132,0.10)] text-[#e2e8f0] font-medium"
                        : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-[#00d084]" : "text-[#64748b]"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* AI Status Badge */}
        <div className="px-3 pb-3">
          <div className="rounded-[10px] border border-[rgba(0,208,132,0.12)] bg-[rgba(0,208,132,0.06)] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d084] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00d084]" />
              </span>
              <span className="font-sans text-[11px] font-medium text-[#00d084]">
                AI Engine Live
              </span>
            </div>
            <p className="text-[10px] text-[#475569] mt-0.5 ml-3.5">
              Groq · FinBERT
            </p>
          </div>
        </div>

        {/* Bottom Section — User Card */}
        <div className="border-t border-[rgba(255,255,255,0.06)] px-3 py-3">
          <div className="flex items-center gap-3 rounded-[8px] px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00d084] text-[11px] font-bold text-black shrink-0">
              RP
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[13px] font-medium text-[#e2e8f0] truncate leading-tight font-sans">Raj Puthawala</p>
              <p className="text-[11px] text-[#475569] truncate font-sans">Personal Project</p>
            </div>
            <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#475569] hover:text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)] transition-colors shrink-0">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>


      {/* Mobile Bottom Tab Bar — 64px */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-[64px] w-full items-center justify-around border-t border-[var(--border)] bg-[var(--sidebar)] px-2 md:hidden">
        {MOBILE_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-[#00d084]" : "text-[#475569] hover:text-[#94a3b8]"
              )}
            >
              <item.icon className="h-[22px] w-[22px]" />
              {isActive && (
                <span className="text-[10px] font-sans font-medium">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
