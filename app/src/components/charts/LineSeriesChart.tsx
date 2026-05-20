import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip, formatTooltipDate } from "./ChartTooltip";

type AnyKey = string & { readonly __brand?: unique symbol };

const AXIS = "hsl(220 11% 36% / 0.6)";
const GRID = "hsl(220 11% 36% / 0.12)";

export function LineSeriesChart<T extends { date: string }>({
  data,
  dataKey,
  color,
  label,
  formatValue,
  formatAxis,
  height = 260,
}: {
  data: T[];
  dataKey: keyof T & string;
  color: string;
  label: string;
  formatValue: (v: number) => string;
  formatAxis: (v: number) => string;
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
            width={48}
            tickFormatter={(v) => formatAxis(v as number)}
          />
          <Tooltip
            cursor={{ stroke: GRID, strokeWidth: 1 }}
            content={(p) => {
              const point = p.payload?.[0]?.payload as T | undefined;
              if (!point) return null;
              return (
                <ChartTooltip
                  title={formatTooltipDate(point.date)}
                  rows={[{ label, value: formatValue(point[dataKey] as number), color }]}
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey as AnyKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
