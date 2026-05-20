import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "destructive" | "info" | "default" | "muted";

const variantStyles: Record<Variant, { bg: string; text: string; border: string; dot: string }> = {
  success: { bg: "bg-success/10", text: "text-success", border: "border-success/20", dot: "bg-success" },
  warning: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", dot: "bg-warning" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", dot: "bg-destructive" },
  info: { bg: "bg-info/10", text: "text-info", border: "border-info/20", dot: "bg-info" },
  default: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", dot: "bg-primary" },
  muted: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    dot: "bg-muted-foreground",
  },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
}

export function StatusBadge({ className, variant = "default", dot = false, children, ...props }: StatusBadgeProps) {
  const v = variantStyles[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        v.bg,
        v.text,
        v.border,
        className,
      )}
      {...props}
    >
      {dot ? <span className={cn("h-1.5 w-1.5 rounded-full", v.dot)} /> : null}
      {children}
    </span>
  );
}
