"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const accentColors: Record<ToastType, string> = {
  success: "#00d084",
  error: "#ef4444",
  info: "#3b82f6",
  warning: "#f59e0b",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-[12px] border border-[var(--border-emphasis)] bg-[var(--background-tertiary)] p-4 shadow-xl animate-in slide-in-from-right-5 duration-300 w-[360px] max-w-[calc(100vw-3rem)]"
            style={{
              borderLeft: `3px solid ${accentColors[t.type]}`,
            }}
          >
            {t.type === "success" && <CheckCircle className="h-5 w-5 shrink-0" style={{ color: accentColors.success }} />}
            {t.type === "error" && <AlertCircle className="h-5 w-5 shrink-0" style={{ color: accentColors.error }} />}
            {t.type === "info" && <Info className="h-5 w-5 shrink-0" style={{ color: accentColors.info }} />}
            {t.type === "warning" && <AlertCircle className="h-5 w-5 shrink-0" style={{ color: accentColors.warning }} />}
            <span className="text-[13px] font-sans font-medium text-[var(--foreground)] flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
