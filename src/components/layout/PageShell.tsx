"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-bg-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-[220px]">
        <Topbar />
        <main className="flex-1 p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
