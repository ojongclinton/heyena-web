import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
}

export function Button({
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50",
        variant === "outline" &&
          "border border-zinc-200 bg-transparent hover:bg-zinc-100 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-600",
        variant === "destructive" &&
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-700 dark:hover:bg-red-800",
        className
      )}
      {...props}
    />
  );
}
