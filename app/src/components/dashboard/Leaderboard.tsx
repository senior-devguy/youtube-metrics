import type { ReactNode } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type LeaderboardRow = {
  id: string;
  primary: string;
  secondary?: string;
  metric: ReactNode;
  metricLabel?: string;
  delta?: ReactNode;
  badge?: ReactNode;
  accent?: string;
};

export function Leaderboard({
  title,
  description,
  rows,
  actions,
}: {
  title: string;
  description?: string;
  rows: LeaderboardRow[];
  actions?: ReactNode;
}) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold leading-none tracking-tight">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div
                className={cn(
                  "h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-xs font-semibold",
                  r.accent ?? "bg-muted text-muted-foreground",
                )}
              >
                {r.badge ?? r.primary.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{r.primary}</div>
                {r.secondary ? (
                  <div className="text-xs text-muted-foreground truncate">{r.secondary}</div>
                ) : null}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold tabular-nums">{r.metric}</div>
                {r.metricLabel ? (
                  <div className="text-xs text-muted-foreground">{r.metricLabel}</div>
                ) : null}
                {r.delta ? <div className="text-xs mt-0.5">{r.delta}</div> : null}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
