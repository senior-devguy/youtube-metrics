import { useMemo, useState } from "react";
import { DollarSign, Package, ShoppingBag, Target, Users } from "lucide-react";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RangeSelect } from "@/components/dashboard/RangeSelect";
import { SourcePicker } from "@/components/dashboard/SourcePicker";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarSeriesChart } from "@/components/charts/BarSeriesChart";
import { LineSeriesChart } from "@/components/charts/LineSeriesChart";
import { MultiLineChart, LineLegend, type MultiLinePoint, type LineSpec } from "@/components/charts/MultiLineChart";
import { VisitorsOrdersChart, type FunnelPoint } from "@/components/charts/VisitorsOrdersChart";
import {
  conversionRate,
  pctDelta,
  sliceDaily,
  storeSeries,
  storeTotals,
  stores,
  type DateRange,
} from "@/lib/mock-data";
import { formatCompact, formatCurrency, formatDelta, formatNumber, formatPercent } from "@/lib/format";
import { colorFor, storePalette } from "@/lib/palette";

const STORE_COLOR = "hsl(235 100% 71%)";

export default function WebStorePage() {
  const [range, setRange] = useState<DateRange>(30);
  const [storeId, setStoreId] = useState<string | "all">("all");

  const data = useMemo(() => {
    const filteredSeries = storeId === "all" ? storeSeries : storeSeries.filter((s) => s.store.id === storeId);
    const totals = filteredSeries.map((s) => storeTotals(s, range));
    const units = totals.reduce((a, c) => a + c.units, 0);
    const unitsPrev = totals.reduce((a, c) => a + c.prevUnits, 0);
    const revenue = totals.reduce((a, c) => a + c.revenue, 0);
    const revenuePrev = totals.reduce((a, c) => a + c.prevRevenue, 0);
    const visitors = totals.reduce((a, c) => a + c.visitors, 0);
    const visitorsPrev = totals.reduce((a, c) => a + c.prevVisitors, 0);
    const orders = totals.reduce((a, c) => a + c.orders, 0);
    const ordersPrev = totals.reduce((a, c) => a + c.prevOrders, 0);
    const conv = conversionRate(visitors, orders);
    const convPrev = conversionRate(visitorsPrev, ordersPrev);
    const aov = orders === 0 ? 0 : revenue / orders;
    const aovPrev = ordersPrev === 0 ? 0 : revenuePrev / ordersPrev;
    const sample = filteredSeries[0]?.daily ?? [];
    const dates = sliceDaily(sample, range).map((d) => d.date);
    const daily = dates.map((date) => {
      const sums = filteredSeries.reduce(
        (acc, s) => {
          const p = s.daily.find((x) => x.date === date);
          if (!p) return acc;
          acc.units += p.units;
          acc.revenue += p.storeRevenue;
          acc.visitors += p.visitors;
          acc.orders += p.orders;
          return acc;
        },
        { units: 0, revenue: 0, visitors: 0, orders: 0 },
      );
      return {
        date,
        units: sums.units,
        revenue: sums.revenue,
        conversion: conversionRate(sums.visitors, sums.orders) * 100,
      };
    });

    // Visitors-to-orders funnel for the picker's current scope.
    const funnel: FunnelPoint[] = dates.map((date) => {
      const sums = filteredSeries.reduce(
        (acc, s) => {
          const p = s.daily.find((x) => x.date === date);
          if (!p) return acc;
          acc.visitors += p.visitors;
          acc.orders += p.orders;
          return acc;
        },
        { visitors: 0, orders: 0 },
      );
      return { date, visitors: sums.visitors, orders: sums.orders };
    });

    // Per-store revenue comparison (always all stores — that's the value).
    const compareDates = sliceDaily(storeSeries[0]?.daily ?? [], range).map((d) => d.date);
    const compareData: MultiLinePoint[] = compareDates.map((date) => {
      const row: MultiLinePoint = { date };
      for (const s of storeSeries) {
        row[s.store.id] = s.daily.find((d) => d.date === date)?.storeRevenue ?? 0;
      }
      return row;
    });
    const compareLines: LineSpec[] = storeSeries.map((s, i) => ({
      id: s.store.id,
      label: s.store.name,
      color: colorFor(i, storePalette),
    }));

    return {
      totals,
      units,
      unitsPrev,
      revenue,
      revenuePrev,
      visitors,
      visitorsPrev,
      orders,
      ordersPrev,
      conv,
      convPrev,
      aov,
      aovPrev,
      daily,
      funnel,
      compareData,
      compareLines,
    };
  }, [range, storeId]);

  const allStoreRows = storeSeries
    .map((s) => storeTotals(s, range))
    .sort((a, b) => b.revenue - a.revenue)
    .map((c) => {
      const conv = conversionRate(c.visitors, c.orders);
      const convPrev = conversionRate(c.prevVisitors, c.prevOrders);
      return {
        id: c.store.id,
        primary: c.store.name,
        secondary: `${c.store.domain} · ${formatNumber(c.units)} units`,
        metric: formatCurrency(c.revenue),
        metricLabel: `${formatPercent(conv)} conv`,
        delta: (
          <StatusBadge
            variant={pctDelta(c.revenue, c.prevRevenue) >= 0 ? "success" : "destructive"}
            dot
          >
            {formatDelta(pctDelta(c.revenue, c.prevRevenue))} rev · {formatDelta(pctDelta(conv, convPrev))} conv
          </StatusBadge>
        ),
        accent: "bg-[hsl(var(--store))]/10 text-[hsl(var(--store))]",
        badge: <ShoppingBag className="h-4 w-4" strokeWidth={2} />,
      };
    });

  return (
    <div className="px-6 pt-8 pb-12 space-y-8">
      <PageHeader
        title="Web Store"
        description="Sales, conversion, and AOV across your storefronts."
        actions={
          <>
            <SourcePicker
              value={storeId}
              onChange={setStoreId}
              allLabel="All stores"
              options={stores.map((s) => ({ id: s.id, label: s.name }))}
            />
            <RangeSelect value={range} onChange={setRange} />
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue"
          value={formatCurrency(data.revenue)}
          delta={pctDelta(data.revenue, data.revenuePrev)}
          icon={DollarSign}
          tone="store"
          hint={`AOV ${formatCurrency(data.aov)}`}
        />
        <StatCard
          label="Units sold"
          value={formatNumber(data.units)}
          delta={pctDelta(data.units, data.unitsPrev)}
          icon={Package}
          tone="primary"
          hint={`${formatNumber(data.orders)} orders`}
        />
        <StatCard
          label="Conversion rate"
          value={formatPercent(data.conv)}
          delta={pctDelta(data.conv, data.convPrev)}
          icon={Target}
          tone="info"
          hint={`${formatCompact(data.visitors)} visitors`}
        />
        <StatCard
          label="Average order"
          value={formatCurrency(data.aov)}
          delta={pctDelta(data.aov, data.aovPrev)}
          icon={Users}
          tone="success"
          hint={`Across ${formatNumber(data.orders)} orders`}
        />
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold leading-none tracking-tight">Performance</CardTitle>
          <CardDescription>
            {storeId === "all" ? "All stores combined" : stores.find((s) => s.id === storeId)?.name} ·
            last {range} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="units">Units</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue" className="mt-4">
              <BarSeriesChart
                data={data.daily}
                dataKey="revenue"
                color={STORE_COLOR}
                label="Revenue"
                formatValue={formatCurrency}
                formatAxis={(v) => `$${formatCompact(v)}`}
              />
            </TabsContent>
            <TabsContent value="units" className="mt-4">
              <BarSeriesChart
                data={data.daily}
                dataKey="units"
                color={STORE_COLOR}
                label="Units"
                formatValue={formatNumber}
                formatAxis={(v) => formatCompact(v)}
              />
            </TabsContent>
            <TabsContent value="conversion" className="mt-4">
              <LineSeriesChart
                data={data.daily}
                dataKey="conversion"
                color={STORE_COLOR}
                label="Conversion"
                formatValue={(v) => `${v.toFixed(2)}%`}
                formatAxis={(v) => `${v.toFixed(1)}%`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold leading-none tracking-tight">Visitors → orders</CardTitle>
            <CardDescription>
              How much traffic is converting · {storeId === "all" ? "all stores" : stores.find((s) => s.id === storeId)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VisitorsOrdersChart data={data.funnel} />
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold leading-none tracking-tight">Store comparison</CardTitle>
                <CardDescription>Daily revenue per store · last {range} days</CardDescription>
              </div>
              <LineLegend items={data.compareLines} />
            </div>
          </CardHeader>
          <CardContent>
            <MultiLineChart
              data={data.compareData}
              lines={data.compareLines}
              formatValue={formatCurrency}
              formatAxis={(v) => `$${formatCompact(v)}`}
            />
          </CardContent>
        </Card>
      </div>

      <Leaderboard
        title="All stores"
        description={`Ranked by revenue · ${range}-day window`}
        rows={allStoreRows}
      />
    </div>
  );
}
