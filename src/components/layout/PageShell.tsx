"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-full bg-[var(--bg-primary)] overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-[220px] min-w-0 max-w-full overflow-x-hidden">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 min-w-0 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
