import { useMemo, useState } from "react";
import { DollarSign, Eye, Users, Youtube as YouTubeIcon } from "lucide-react";

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
import { HorizontalBarChart, type HBar } from "@/components/charts/HorizontalBarChart";
import {
  channelSeries,
  channelTotals,
  channels,
  pctDelta,
  sliceDaily,
  type DateRange,
} from "@/lib/mock-data";
import { formatCompact, formatCurrency, formatDelta, formatNumber } from "@/lib/format";
import { channelPalette, colorFor } from "@/lib/palette";

const YT_COLOR = "hsl(0 72% 51%)";

export default function YouTubePage() {
  const [range, setRange] = useState<DateRange>(30);
  const [channelId, setChannelId] = useState<string | "all">("all");

  const data = useMemo(() => {
    const filteredSeries = channelId === "all" ? channelSeries : channelSeries.filter((s) => s.channel.id === channelId);
    const totals = filteredSeries.map((s) => channelTotals(s, range));
    const views = totals.reduce((a, c) => a + c.views, 0);
    const viewsPrev = totals.reduce((a, c) => a + c.prevViews, 0);
    const revenue = totals.reduce((a, c) => a + c.revenue, 0);
    const revenuePrev = totals.reduce((a, c) => a + c.prevRevenue, 0);
    const subscribers = filteredSeries.reduce((a, s) => a + s.channel.subscribers, 0);
    // Combine selected channels' daily series, summing per-date.
    const sample = filteredSeries[0]?.daily ?? [];
    const dates = sliceDaily(sample, range).map((d) => d.date);
    const daily = dates.map((date) => ({
      date,
      views: filteredSeries.reduce((acc, s) => acc + (s.daily.find((d) => d.date === date)?.views ?? 0), 0),
      revenue: filteredSeries.reduce((acc, s) => acc + (s.daily.find((d) => d.date === date)?.ytRevenue ?? 0), 0),
    }));
    const rpm = views > 0 ? (revenue / views) * 1000 : 0;
    const rpmPrev = viewsPrev > 0 ? (revenuePrev / viewsPrev) * 1000 : 0;

    // Per-channel breakdown for the comparison chart — every channel gets
    // its own series regardless of the picker, since the value is in seeing
    // how channels compare against each other over time.
    const compareDates = sliceDaily(channelSeries[0]?.daily ?? [], range).map((d) => d.date);
    const compareData: MultiLinePoint[] = compareDates.map((date) => {
      const row: MultiLinePoint = { date };
      for (const s of channelSeries) {
        row[s.channel.id] = s.daily.find((d) => d.date === date)?.ytRevenue ?? 0;
      }
      return row;
    });
    const compareLines: LineSpec[] = channelSeries.map((s, i) => ({
      id: s.channel.id,
      label: s.channel.name,
      color: colorFor(i, channelPalette),
    }));

    // Views ranking — quick visual showing where audience attention sits.
    const viewsRanking: HBar[] = channelSeries
      .map((s, i) => {
        const t = channelTotals(s, range);
        return {
          id: s.channel.id,
          name: s.channel.name,
          value: t.views,
          color: colorFor(i, channelPalette),
          hint: `${formatCurrency(t.revenue)} earned`,
        };
      })
      .sort((a, b) => b.value - a.value);

    return {
      totals,
      views,
      viewsPrev,
      revenue,
      revenuePrev,
      subscribers,
      daily,
      rpm,
      rpmPrev,
      compareData,
      compareLines,
      viewsRanking,
    };
  }, [range, channelId]);

  const allChannelRows = channelSeries
    .map((s) => channelTotals(s, range))
    .sort((a, b) => b.revenue - a.revenue)
    .map((c) => ({
      id: c.channel.id,
      primary: c.channel.name,
      secondary: `${c.channel.handle} · ${formatCompact(c.channel.subscribers)} subs`,
      metric: formatCurrency(c.revenue),
      metricLabel: `${formatCompact(c.views)} views`,
      delta: (
        <StatusBadge
          variant={pctDelta(c.revenue, c.prevRevenue) >= 0 ? "success" : "destructive"}
          dot
        >
          {formatDelta(pctDelta(c.revenue, c.prevRevenue))}
        </StatusBadge>
      ),
      accent: "bg-[hsl(var(--youtube))]/10 text-[hsl(var(--youtube))]",
      badge: <YouTubeIcon className="h-4 w-4" strokeWidth={2} />,
    }));

  return (
    <div className="px-6 pt-8 pb-12 space-y-8">
      <PageHeader
        title="YouTube"
        description="Views and ad revenue across your channels."
        actions={
          <>
            <SourcePicker
              value={channelId}
              onChange={setChannelId}
              allLabel="All channels"
              options={channels.map((c) => ({ id: c.id, label: c.name }))}
            />
            <RangeSelect value={range} onChange={setRange} />
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Views"
          value={formatCompact(data.views)}
          delta={pctDelta(data.views, data.viewsPrev)}
          icon={Eye}
          tone="youtube"
          hint={`${formatNumber(data.views)} total`}
        />
        <StatCard
          label="Ad revenue"
          value={formatCurrency(data.revenue)}
          delta={pctDelta(data.revenue, data.revenuePrev)}
          icon={DollarSign}
          tone="success"
          hint={`Avg ${formatCurrency(data.revenue / range)}/day`}
        />
        <StatCard
          label="Effective RPM"
          value={`$${data.rpm.toFixed(2)}`}
          delta={pctDelta(data.rpm, data.rpmPrev)}
          icon={DollarSign}
          tone="primary"
          hint="Revenue per 1k views"
        />
        <StatCard
          label="Subscribers"
          value={formatCompact(data.subscribers)}
          icon={Users}
          tone="info"
          hint={channelId === "all" ? `${channels.length} channels` : "Selected channel"}
        />
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold leading-none tracking-tight">Performance</CardTitle>
          <CardDescription>
            {channelId === "all" ? "All channels combined" : channels.find((c) => c.id === channelId)?.name} ·
            last {range} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="views">
            <TabsList>
              <TabsTrigger value="views">Views</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            <TabsContent value="views" className="mt-4">
              <BarSeriesChart
                data={data.daily}
                dataKey="views"
                color={YT_COLOR}
                label="Views"
                formatValue={formatNumber}
                formatAxis={(v) => formatCompact(v)}
              />
            </TabsContent>
            <TabsContent value="revenue" className="mt-4">
              <LineSeriesChart
                data={data.daily}
                dataKey="revenue"
                color={YT_COLOR}
                label="Revenue"
                formatValue={formatCurrency}
                formatAxis={(v) => `$${formatCompact(v)}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold leading-none tracking-tight">Channel comparison</CardTitle>
              <CardDescription>Daily revenue per channel · last {range} days</CardDescription>
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold leading-none tracking-tight">Views by channel</CardTitle>
            <CardDescription>Where the attention is</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart
              data={data.viewsRanking}
              formatValue={formatNumber}
              formatAxis={(v) => formatCompact(v)}
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Leaderboard
            title="All channels"
            description={`Ranked by revenue · ${range}-day window`}
            rows={allChannelRows}
          />
        </div>
      </div>
    </div>
  );
}
