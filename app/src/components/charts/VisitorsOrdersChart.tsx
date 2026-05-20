import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip, formatTooltipDate } from "./ChartTooltip";
import { formatCompact, formatNumber } from "@/lib/format";

const AXIS = "hsl(220 11% 36% / 0.6)";
const GRID = "hsl(220 11% 36% / 0.12)";
const VISITORS_COLOR = "hsl(220 11% 36% / 0.45)";
const ORDERS_COLOR = "hsl(235 100% 71%)";

type AnyKey = string & { readonly __brand?: unique symbol };

export type FunnelPoint = {
  date: string;
  visitors: number;
  orders: number;
};

export function VisitorsOrdersChart({ data, height = 280 }: { data: FunnelPoint[]; height?: number }) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
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
            yAxisId="visitors"
            orientation="left"
            stroke={AXIS}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v) => formatCompact(v as number)}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            stroke={AXIS}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v) => formatCompact(v as number)}
          />
          <Tooltip
            cursor={{ fill: GRID }}
            content={(p) => {
              const point = p.payload?.[0]?.payload as FunnelPoint | undefined;
              if (!point) return null;
              const conv = point.visitors === 0 ? 0 : (point.orders / point.visitors) * 100;
              return (
                <ChartTooltip
                  title={formatTooltipDate(point.date)}
                  rows={[
                    { label: "Visitors", value: formatNumber(point.visitors), color: VISITORS_COLOR },
                    { label: "Orders", value: formatNumber(point.orders), color: ORDERS_COLOR },
                    { label: "Conversion", value: `${conv.toFixed(2)}%` },
                  ]}
                />
              );
            }}
          />
          <Bar
            yAxisId="visitors"
            dataKey={"visitors" as AnyKey}
            fill={VISITORS_COLOR}
            radius={[3, 3, 0, 0]}
            maxBarSize={14}
          />
          <Line
            yAxisId="orders"
            type="monotone"
            dataKey={"orders" as AnyKey}
            stroke={ORDERS_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
