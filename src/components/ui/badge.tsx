import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info" | "outline";
}

export function Badge({ children, className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-bg-secondary text-text-primary",
    success: "bg-accent/10 text-accent border border-accent/20",
    danger: "bg-red/10 text-red border border-red/20",
    warning: "bg-yellow/10 text-yellow border border-yellow/20",
    info: "bg-blue/10 text-blue border border-blue/20",
    outline: "bg-transparent border border-border text-text-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
