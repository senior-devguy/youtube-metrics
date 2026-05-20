import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "./ChartTooltip";

const AXIS = "hsl(220 11% 36% / 0.6)";
const GRID = "hsl(220 11% 36% / 0.12)";

type AnyKey = string & { readonly __brand?: unique symbol };

export type HBar = {
  id: string;
  name: string;
  value: number;
  color: string;
  hint?: string;
};

export function HorizontalBarChart({
  data,
  formatValue,
  formatAxis,
  height,
}: {
  data: HBar[];
  formatValue: (v: number) => string;
  formatAxis: (v: number) => string;
  height?: number;
}) {
  // Sized so each row has comfortable padding regardless of count.
  const computed = height ?? Math.max(180, data.length * 44 + 24);
  return (
    <div className="w-full" style={{ height: computed }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} horizontal={false} />
          <XAxis
            type="number"
            stroke={AXIS}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatAxis(v as number)}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={AXIS}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <Tooltip
            cursor={{ fill: GRID }}
            content={(p) => {
              const row = p.payload?.[0]?.payload as HBar | undefined;
              if (!row) return null;
              return (
                <ChartTooltip
                  title={row.name}
                  rows={[
                    { label: "Value", value: formatValue(row.value), color: row.color },
                    ...(row.hint ? [{ label: "Detail", value: row.hint }] : []),
                  ]}
                />
              );
            }}
          />
          <Bar dataKey={"value" as AnyKey} radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((d) => (
              <Cell key={d.id} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
