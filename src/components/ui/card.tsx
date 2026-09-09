import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "terminal" | "elevated" | "ai";
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[12px] border transition-all duration-150 font-sans",
        (variant === "default" || variant === "terminal") &&
          "bg-bg-card border-border hover:border-border-emphasis hover:bg-bg-hover",
        variant === "elevated" && "bg-bg-elevated border-border",
        variant === "ai" &&
          "bg-ai-purple-dim border-l-[3px] border-l-ai-purple border-y border-r border-border hover:border-border-emphasis",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4 border-b border-border", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4 border-t border-border", className)}>{children}</div>;
}

