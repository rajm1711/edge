import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "strongly-bullish"
    | "bullish"
    | "neutral"
    | "bearish"
    | "strongly-bearish"
    | "buy"
    | "sell"
    | "hold"
    | "unavailable"
    | "ai"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "outline"
    | "high"
    | "medium"
    | "low";
}

export function Badge({ children, className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)]",
    "strongly-bullish": "bg-[#00d084] text-black font-medium border border-[#00d084]",
    bullish: "bg-[rgba(0,208,132,0.12)] text-[#00d084] border border-[rgba(0,208,132,0.20)]",
    neutral: "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.20)]",
    bearish: "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.20)]",
    "strongly-bearish": "bg-[#ef4444] text-white font-medium border border-[#ef4444]",
    buy: "bg-[rgba(0,208,132,0.12)] text-[#00d084] border border-[rgba(0,208,132,0.20)]",
    sell: "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.20)]",
    hold: "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.20)]",
    unavailable: "bg-[rgba(71,85,105,0.12)] text-[#475569] border border-[rgba(71,85,105,0.20)]",
    ai: "bg-[rgba(167,139,250,0.08)] text-[#a78bfa] border border-[rgba(167,139,250,0.20)]",
    success: "bg-[rgba(0,208,132,0.12)] text-[#00d084] border border-[rgba(0,208,132,0.20)]",
    danger: "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.20)]",
    warning: "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.20)]",
    info: "bg-[rgba(59,130,246,0.12)] text-[#3b82f6] border border-[rgba(59,130,246,0.20)]",
    high: "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.20)]",
    medium: "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.20)]",
    low: "bg-[rgba(71,85,105,0.12)] text-[#475569] border border-[rgba(71,85,105,0.20)]",
    outline: "bg-transparent border border-[var(--border)] text-[var(--foreground-secondary)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide font-medium transition-colors",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
