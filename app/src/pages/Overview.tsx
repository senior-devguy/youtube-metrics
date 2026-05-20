import { useMemo, useState } from "react";
import { DollarSign, Eye, Package, Target } from "lucide-react";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RangeSelect } from "@/components/dashboard/RangeSelect";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueAreaChart } from "@/components/charts/RevenueAreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { HorizontalBarChart, type HBar } from "@/components/charts/HorizontalBarChart";
import {
  channelSeries,
  channelTotals,
  combinedDaily,
  conversionRate,
  pctDelta,
  storeSeries,
  storeTotals,
  type DateRange,
} from "@/lib/mock-data";
import { formatCompact, formatCurrency, formatCurrencyCompact, formatDelta, formatNumber, formatPercent } from "@/lib/format";
import { channelPalette, colorFor, storePalette } from "@/lib/palette";

export default function Overview() {
  const [range, setRange] = useState<DateRange>(30);

  const data = useMemo(() => {
    const channels = channelSeries.map((s) => channelTotals(s, range));
    const stores = storeSeries.map((s) => storeTotals(s, range));
    return {
      channels,
      stores,
      ytViews: channels.reduce((a, c) => a + c.views, 0),
      ytViewsPrev: channels.reduce((a, c) => a + c.prevViews, 0),
      ytRevenue: channels.reduce((a, c) => a + c.revenue, 0),
      ytRevenuePrev: channels.reduce((a, c) => a + c.prevRevenue, 0),
      units: stores.reduce((a, s) => a + s.units, 0),
      unitsPrev: stores.reduce((a, s) => a + s.prevUnits, 0),
      storeRevenue: stores.reduce((a, s) => a + s.revenue, 0),
      storeRevenuePrev: stores.reduce((a, s) => a + s.prevRevenue, 0),
      visitors: stores.reduce((a, s) => a + s.visitors, 0),
      visitorsPrev: stores.reduce((a, s) => a + s.prevVisitors, 0),
      orders: stores.reduce((a, s) => a + s.orders, 0),
      ordersPrev: stores.reduce((a, s) => a + s.prevOrders, 0),
      daily: combinedDaily("all", "all", range),
    };
  }, [range]);

  const totalRevenue = data.ytRevenue + data.storeRevenue;
  const totalRevenuePrev = data.ytRevenuePrev + data.storeRevenuePrev;
  const conv = conversionRate(data.visitors, data.orders);
  const convPrev = conversionRate(data.visitorsPrev, data.ordersPrev);

  const topChannels = [...data.channels]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)
    .map((c) => ({
      id: c.channel.id,
      primary: c.channel.name,
      secondary: c.channel.handle,
      metric: formatCurrency(c.revenue),
      metricLabel: `${formatCompact(c.views)} views`,
      delta: (
        <DeltaBadge value={pctDelta(c.revenue, c.prevRevenue)} />
      ),
      accent: "bg-[hsl(var(--youtube))]/10 text-[hsl(var(--youtube))]",
    }));

  const topStores = [...data.stores]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)
    .map((s) => ({
      id: s.store.id,
      primary: s.store.name,
      secondary: s.store.domain,
      metric: formatCurrency(s.revenue),
      metricLabel: `${formatNumber(s.units)} units · ${formatPercent(conversionRate(s.visitors, s.orders))}`,
      delta: <DeltaBadge value={pctDelta(s.revenue, s.prevRevenue)} />,
      accent: "bg-[hsl(var(--store))]/10 text-[hsl(var(--store))]",
    }));

  const donutSlices = [
    { name: "YouTube", value: data.ytRevenue, color: "hsl(0 72% 51%)" },
    { name: "Store", value: data.storeRevenue, color: "hsl(235 100% 71%)" },
  ];
  const ytShare = totalRevenue === 0 ? 0 : (data.ytRevenue / totalRevenue) * 100;

  const sourceBars: HBar[] = [
    ...data.channels.map((c, i) => ({
      id: c.channel.id,
      name: c.channel.name,
      value: c.revenue,
      color: colorFor(i, channelPalette),
      hint: `YouTube · ${formatCompact(c.views)} views`,
    })),
    ...data.stores.map((s, i) => ({
      id: s.store.id,
      name: s.store.name,
      value: s.revenue,
      color: colorFor(i, storePalette),
      hint: `Store · ${formatNumber(s.units)} units`,
    })),
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="px-6 pt-8 pb-12 space-y-8">
      <PageHeader
        title="Overview"
        description="Revenue from YouTube and your web stores, side by side."
        actions={<RangeSelect value={range} onChange={setRange} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total revenue"
          value={formatCurrency(totalRevenue)}
          delta={pctDelta(totalRevenue, totalRevenuePrev)}
          hint="YouTube + store"
          icon={DollarSign}
          tone="primary"
        />
        <StatCard
          label="YouTube views"
          value={formatCompact(data.ytViews)}
          delta={pctDelta(data.ytViews, data.ytViewsPrev)}
          hint={`${formatCurrency(data.ytRevenue)} earned`}
          icon={Eye}
          tone="youtube"
        />
        <StatCard
          label="Units sold"
          value={formatNumber(data.units)}
          delta={pctDelta(data.units, data.unitsPrev)}
          hint={`${formatCurrency(data.storeRevenue)} store revenue`}
          icon={Package}
          tone="store"
        />
        <StatCard
          label="Store conversion"
          value={formatPercent(conv)}
          delta={pctDelta(conv, convPrev)}
          hint={`${formatNumber(data.orders)} orders / ${formatCompact(data.visitors)} visitors`}
          icon={Target}
          tone="info"
        />
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                Revenue by source
              </CardTitle>
              <CardDescription>
                Daily revenue for the last {range} days — YouTube ads vs. web store.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--youtube))]" /> YouTube
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--store))]" /> Store
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RevenueAreaChart
            data={data.daily.map((d) => ({ date: d.date, ytRevenue: d.ytRevenue, storeRevenue: d.storeRevenue }))}
            mode="combined"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold leading-none tracking-tight">Revenue mix</CardTitle>
            <CardDescription>YouTube vs. store, last {range} days</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={donutSlices}
              formatValue={formatCurrency}
              centerValue={formatCurrencyCompact(totalRevenue)}
              centerLabel="Total"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-muted/40 px-3 py-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">YouTube</div>
                <div className="font-semibold tabular-nums">{formatCurrency(data.ytRevenue)}</div>
                <div className="text-xs text-muted-foreground">{ytShare.toFixed(1)}% of total</div>
              </div>
              <div className="rounded-md bg-muted/40 px-3 py-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Store</div>
                <div className="font-semibold tabular-nums">{formatCurrency(data.storeRevenue)}</div>
                <div className="text-xs text-muted-foreground">{(100 - ytShare).toFixed(1)}% of total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold leading-none tracking-tight">By source</CardTitle>
            <CardDescription>Every channel and store ranked by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart
              data={sourceBars}
              formatValue={formatCurrency}
              formatAxis={(v) => `$${formatCompact(v)}`}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Leaderboard
          title="Top channels"
          description="By revenue this period"
          rows={topChannels}
        />
        <Leaderboard title="Top stores" description="By revenue this period" rows={topStores} />
      </div>
    </div>
  );
}

function DeltaBadge({ value }: { value: number }) {
  const variant = value > 0.5 ? "success" : value < -0.5 ? "destructive" : "muted";
  return (
    <StatusBadge variant={variant} dot>
      {formatDelta(value)}
    </StatusBadge>
  );
}
