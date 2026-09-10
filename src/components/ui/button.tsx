import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[var(--accent)] text-black font-semibold hover:opacity-90 active:scale-[0.98]",
    secondary: "bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-emphasis)] active:scale-[0.98]",
    outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-secondary)] hover:border-[var(--border-emphasis)] active:scale-[0.98]",
    ghost: "bg-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] active:scale-[0.98]",
    danger: "bg-[var(--destructive)] text-white font-semibold hover:opacity-90 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[12px]",
    md: "px-4 py-2 text-[13px]",
    lg: "px-6 py-3 text-[14px]",
    icon: "p-2",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] font-sans font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,208,132,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
