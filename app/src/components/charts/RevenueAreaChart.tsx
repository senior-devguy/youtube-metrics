import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { ChartTooltip, formatTooltipDate } from "./ChartTooltip";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";

export type RevenuePoint = {
  date: string;
  ytRevenue: number;
  storeRevenue: number;
};

const YT = "hsl(0 72% 51%)";
const STORE = "hsl(235 100% 71%)";
const AXIS = "hsl(220 11% 36% / 0.6)";
const GRID = "hsl(220 11% 36% / 0.12)";

export function RevenueAreaChart({ data, mode = "combined" }: { data: RevenuePoint[]; mode?: "combined" | "youtube" | "store" }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="ytFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={YT} stopOpacity={0.32} />
              <stop offset="100%" stopColor={YT} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="storeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={STORE} stopOpacity={0.32} />
              <stop offset="100%" stopColor={STORE} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) => formatCurrencyCompact(v as number)}
          />
          <Tooltip
            cursor={{ stroke: GRID, strokeWidth: 1 }}
            content={(p) => {
              const a = p.active;
              const point = p.payload?.[0]?.payload as RevenuePoint | undefined;
              if (!a || !point) return null;
              const rows = [] as { label: string; value: string; color: string }[];
              if (mode !== "store") {
                rows.push({ label: "YouTube", value: formatCurrency(point.ytRevenue), color: YT });
              }
              if (mode !== "youtube") {
                rows.push({ label: "Store", value: formatCurrency(point.storeRevenue), color: STORE });
              }
              if (mode === "combined") {
                rows.push({
                  label: "Total",
                  value: formatCurrency(point.ytRevenue + point.storeRevenue),
                  color: "hsl(220 11% 36%)",
                });
              }
              return <ChartTooltip title={formatTooltipDate(point.date)} rows={rows} />;
            }}
          />
          {mode === "combined" ? (
            <Legend
              verticalAlign="top"
              height={28}
              iconType="circle"
              wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
            />
          ) : null}
          {mode !== "store" ? (
            <Area
              type="monotone"
              dataKey="ytRevenue"
              name="YouTube"
              stroke={YT}
              strokeWidth={2}
              fill="url(#ytFill)"
              activeDot={{ r: 4 }}
            />
          ) : null}
          {mode !== "youtube" ? (
            <Area
              type="monotone"
              dataKey="storeRevenue"
              name="Store"
              stroke={STORE}
              strokeWidth={2}
              fill="url(#storeFill)"
              activeDot={{ r: 4 }}
            />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
