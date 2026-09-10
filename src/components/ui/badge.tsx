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
  const variants = {
    default: "bg-bg-secondary text-text-primary border border-border",
    "strongly-bullish": "bg-[#00d084] text-black font-medium",
    bullish: "bg-[rgba(0,208,132,0.15)] text-[#00d084] border border-[#00d084]",
    neutral: "bg-[rgba(245,166,35,0.15)] text-[#f5a623] border border-[#f5a623]",
    bearish: "bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] border border-[#ff4d4d]",
    "strongly-bearish": "bg-[#ff4d4d] text-white font-medium",
    buy: "bg-[rgba(0,208,132,0.15)] text-[#00d084] border border-[#00d084]",
    sell: "bg-[rgba(255,77,77,0.15)] text-[#ff4d4d] border border-[#ff4d4d]",
    hold: "bg-[rgba(245,166,35,0.15)] text-[#f5a623] border border-[#f5a623]",
    unavailable: "bg-[rgba(113,128,150,0.12)] text-[#718096]",
    ai: "bg-ai-purple-dim text-ai-purple",
    success: "bg-positive/10 text-positive",
    danger: "bg-negative/10 text-negative",
    warning: "bg-neutral/10 text-neutral",
    info: "bg-info/10 text-info",
    high: "bg-[rgba(255,77,77,0.12)] text-[#ff4d4d]",
    medium: "bg-[rgba(245,166,35,0.12)] text-[#f5a623]",
    low: "bg-[rgba(113,128,150,0.12)] text-[#718096]",
    outline: "bg-transparent border border-border text-text-secondary",
  };


  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide transition-colors",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}


