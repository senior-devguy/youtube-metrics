import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip, formatTooltipDate } from "./ChartTooltip";

const AXIS = "hsl(220 11% 36% / 0.6)";
const GRID = "hsl(220 11% 36% / 0.12)";

type AnyKey = string & { readonly __brand?: unique symbol };

export type LineSpec = {
  id: string;
  label: string;
  color: string;
};

export type MultiLinePoint = { date: string } & Record<string, number | string>;

export function MultiLineChart({
  data,
  lines,
  formatValue,
  formatAxis,
  height = 280,
}: {
  data: MultiLinePoint[];
  lines: LineSpec[];
  formatValue: (v: number) => string;
  formatAxis: (v: number) => string;
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis
            dataKey="date"
            stroke={AXIS}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(d) => {
              const date = new Date(d + "T00:00:00");
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
            minTickGap={32}
          />
          <YAxis
            stroke={AXIS}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v) => formatAxis(v as number)}
          />
          <Tooltip
            cursor={{ stroke: GRID, strokeWidth: 1 }}
            content={(p) => {
              const point = p.payload?.[0]?.payload as MultiLinePoint | undefined;
              if (!point) return null;
              const rows = lines
                .map((l) => ({
                  label: l.label,
                  value: formatValue(Number(point[l.id] ?? 0)),
                  color: l.color,
                  _v: Number(point[l.id] ?? 0),
                }))
                .sort((a, b) => b._v - a._v)
                .map(({ label, value, color }) => ({ label, value, color }));
              return <ChartTooltip title={formatTooltipDate(String(point.date))} rows={rows} />;
            }}
          />
          {lines.map((l) => (
            <Line
              key={l.id}
              type="monotone"
              dataKey={l.id as AnyKey}
              name={l.label}
              stroke={l.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineLegend({ items }: { items: LineSpec[] }) {
  return (
    <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
      {items.map((i) => (
        <span key={i.id} className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
