import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Row = {
  label: string;
  value: ReactNode;
  color?: string;
};

export function ChartTooltip({
  title,
  rows,
  className,
}: {
  title: string;
  rows: Row[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md",
        className,
      )}
    >
      <div className="text-muted-foreground mb-1.5">{title}</div>
      <div className="space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-foreground">
              {r.color ? <span className="h-2 w-2 rounded-full" style={{ background: r.color }} /> : null}
              {r.label}
            </span>
            <span className="font-medium tabular-nums">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function formatTooltipDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
