import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "buy"
    | "sell"
    | "hold"
    | "bullish"
    | "bearish"
    | "neutral"
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
    buy: "bg-positive text-black font-semibold",
    sell: "bg-negative text-white font-semibold",
    hold: "bg-neutral text-black font-semibold",
    bullish: "bg-positive/10 text-positive",
    bearish: "bg-negative/10 text-negative",
    neutral: "bg-neutral/10 text-neutral",
    ai: "bg-ai-purple-dim text-ai-purple",
    success: "bg-positive/10 text-positive",
    danger: "bg-negative/10 text-negative",
    warning: "bg-neutral/10 text-neutral",
    info: "bg-info/10 text-info",
    high: "bg-negative/10 text-negative",
    medium: "bg-neutral/10 text-neutral",
    low: "bg-bg-secondary text-text-secondary border border-border",
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

