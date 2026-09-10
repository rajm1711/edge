"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  width?: string;
  children: React.ReactNode;
}

export function SlidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  width = "w-full md:w-[400px]",
  children,
}: SlidePanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[4px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide Drawer */}
      <div
        className={cn(
          "relative z-[101] flex h-full flex-col bg-[var(--background-secondary)] border-l border-[var(--border)] shadow-2xl font-sans animate-in slide-in-from-right duration-250 ease-out",
          width
        )}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans text-[16px] font-semibold text-[var(--foreground)]">
                {title}
              </h2>
              {badge && (
                <span className="rounded-[6px] bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.20)] px-2 py-0.5 font-mono text-[10px] uppercase text-[#a78bfa]">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="font-sans text-[11px] text-[var(--foreground-muted)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}
