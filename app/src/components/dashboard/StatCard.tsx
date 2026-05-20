import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/format";

type Tone = "primary" | "youtube" | "store" | "success" | "info" | "warning";

const toneStyles: Record<Tone, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  youtube: { bg: "bg-[hsl(var(--youtube))]/10", text: "text-[hsl(var(--youtube))]" },
  store: { bg: "bg-[hsl(var(--store))]/10", text: "text-[hsl(var(--store))]" },
  success: { bg: "bg-success/10", text: "text-success" },
  info: { bg: "bg-info/10", text: "text-info" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
};

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}) {
  const t = toneStyles[tone];
  const deltaDir = delta === undefined ? "flat" : delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat";
  const DeltaIcon = deltaDir === "up" ? TrendingUp : deltaDir === "down" ? TrendingDown : Minus;
  const deltaColor =
    deltaDir === "up" ? "text-success" : deltaDir === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className="rounded-xl p-5 flex items-start gap-4">
      <div className={cn("rounded-lg p-2.5 shrink-0", t.bg)}>
        <Icon className={cn("h-5 w-5", t.text)} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {delta !== undefined ? (
            <span className={cn("inline-flex items-center gap-1 font-medium tabular-nums", deltaColor)}>
              <DeltaIcon className="h-3.5 w-3.5" strokeWidth={2} />
              {formatDelta(delta)}
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      </div>
    </Card>
  );
}
