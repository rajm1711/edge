import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-[8px]",
        className
      )}
      style={{
        background: `linear-gradient(90deg, var(--background-secondary) 25%, var(--background-tertiary) 50%, var(--background-secondary) 75%)`,
        backgroundSize: '200% 100%',
      }}
    />
  );
}
