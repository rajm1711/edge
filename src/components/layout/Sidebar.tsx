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
  Settings,
  Circle,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[220px] flex-col border-r border-border bg-bg-sidebar px-4 py-6 text-white md:flex">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-accent" />
            <h1 className="font-bebas text-3xl tracking-wider text-accent">EDGEIQ</h1>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Pro Analyst</p>
        </div>

        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">AI Engine Live</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group",
                  isActive 
                    ? "bg-accent/10 text-accent font-medium" 
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-accent" : "text-text-muted group-hover:text-white"
                )} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 pt-6 border-t border-white/10">
          <Link
            href="/alerts"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-secondary hover:bg-white/5 hover:text-white transition-all"
          >
            <Bell className="h-5 w-5" />
            <span className="text-sm">Alerts</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-secondary hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm">Settings</span>
          </Link>
          
          <div className="mt-4 flex items-center gap-3 px-3 py-4 bg-white/5 rounded-xl border border-white/10">
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">John Doe</p>
              <p className="text-[10px] text-text-muted truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-border bg-bg-sidebar px-2 py-3 md:hidden">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 transition-all",
                isActive ? "text-accent" : "text-text-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
