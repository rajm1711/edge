"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ShieldAlert } from "lucide-react";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-full bg-[var(--bg-primary)] overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-[220px] min-w-0 max-w-full overflow-x-hidden">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 min-w-0 max-w-full overflow-x-hidden">
          {children}
        </main>

        <footer className="w-full border-t border-border/40 bg-bg-secondary/40 px-4 md:px-6 py-4 text-[11px] font-mono text-text-muted flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-text-muted max-w-3xl">
            <ShieldAlert className="h-4 w-4 text-ai-purple shrink-0" />
            <span>
              <strong>Disclaimer:</strong> EdgeIQ is an educational and analytical research tool provided for decision-support purposes only. It does not constitute financial advice, investment recommendations, or trade execution signals.
            </span>
          </div>
          <div className="shrink-0 text-text-secondary text-[10px]">
            EdgeIQ v0.1.0 • Built with Next.js & Llama 3.3
          </div>
        </footer>
      </div>
    </div>
  );
}

