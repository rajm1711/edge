import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "terminal" | "elevated" | "ai";
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] border transition-all duration-200 font-sans",
        (variant === "default" || variant === "terminal") &&
          "bg-[var(--card)] border-[var(--border)] hover:border-[var(--border-emphasis)] hover:shadow-[0_4px_32px_rgba(0,0,0,0.2)]",
        variant === "elevated" && "bg-[var(--background-tertiary)] border-[var(--border)]",
        variant === "ai" &&
          "border-l-[3px] border-l-[var(--ai)] border-y border-r border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-emphasis)]",
        className
      )}
      style={variant === "ai" ? { background: `linear-gradient(to right, rgba(167,139,250,0.02), var(--card))` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4 border-b border-[var(--border)]", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4 border-t border-[var(--border)]", className)}>{children}</div>;
}
