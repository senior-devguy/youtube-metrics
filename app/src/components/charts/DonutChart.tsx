import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartTooltip } from "./ChartTooltip";

export type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

export function DonutChart({
  data,
  formatValue,
  centerValue,
  centerLabel,
  height = 220,
}: {
  data: DonutSlice[];
  formatValue: (n: number) => string;
  centerValue: string;
  centerLabel: string;
  height?: number;
}) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="relative w-full" style={{ height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="64%"
            outerRadius="88%"
            paddingAngle={2}
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            content={(p) => {
              const slice = p.payload?.[0]?.payload as DonutSlice | undefined;
              if (!slice) return null;
              const pct = total === 0 ? 0 : (slice.value / total) * 100;
              return (
                <ChartTooltip
                  title={slice.name}
                  rows={[
                    { label: "Value", value: formatValue(slice.value), color: slice.color },
                    { label: "Share", value: `${pct.toFixed(1)}%` },
                  ]}
                />
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{centerValue}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{centerLabel}</div>
      </div>
    </div>
  );
}
