// Deterministic mock data for the prototype. Generated once at module load
// so the dashboard is stable across re-renders and easy to reason about.
// Source numbers chosen to feel plausible for mid-sized creator businesses.

export type YouTubeChannel = {
  id: string;
  name: string;
  handle: string;
  subscribers: number;
};

export type WebStore = {
  id: string;
  name: string;
  domain: string;
};

export type DailyPoint = {
  date: string; // ISO YYYY-MM-DD
  // YouTube
  views: number;
  ytRevenue: number;
  // Store
  units: number;
  storeRevenue: number;
  visitors: number;
  orders: number;
};

export type ChannelSeries = {
  channel: YouTubeChannel;
  daily: DailyPoint[];
};

export type StoreSeries = {
  store: WebStore;
  daily: DailyPoint[];
};

export const channels: YouTubeChannel[] = [
  { id: "ch-1", name: "Northwind Workshop", handle: "@northwindworkshop", subscribers: 412_300 },
  { id: "ch-2", name: "Pixel & Pine", handle: "@pixelandpine", subscribers: 184_750 },
  { id: "ch-3", name: "Quiet Kitchen", handle: "@quietkitchen", subscribers: 96_120 },
  { id: "ch-4", name: "Outbound Lab", handle: "@outboundlab", subscribers: 261_540 },
];

export const stores: WebStore[] = [
  { id: "st-1", name: "Northwind Goods", domain: "shop.northwind.co" },
  { id: "st-2", name: "Pine Press", domain: "pinepress.store" },
  { id: "st-3", name: "Quiet Pantry", domain: "quietpantry.com" },
  { id: "st-4", name: "Field Notes Co.", domain: "fieldnotes.gg" },
];

// Mulberry32 PRNG — small, fast, deterministic given a seed.
function mulberry(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAYS = 90;

function lastNDates(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function generateChannel(channel: YouTubeChannel, seed: number): ChannelSeries {
  const rand = mulberry(seed);
  // Base traffic scales with subscriber count, but with a wide spread.
  const baseViews = channel.subscribers * (0.04 + rand() * 0.06);
  // RPM in the $2–$8 range — typical for English-language YT channels.
  const rpm = 2 + rand() * 6;
  const dates = lastNDates(DAYS);
  const daily: DailyPoint[] = dates.map((date, i) => {
    const d = new Date(date);
    const dow = d.getDay();
    const weekendBoost = dow === 0 || dow === 6 ? 1.18 : 1.0;
    // Gentle upward trend across the window.
    const trend = 1 + (i / DAYS) * 0.25;
    const noise = 0.78 + rand() * 0.44;
    const views = Math.round(baseViews * weekendBoost * trend * noise);
    const ytRevenue = (views / 1000) * rpm;
    return {
      date,
      views,
      ytRevenue,
      units: 0,
      storeRevenue: 0,
      visitors: 0,
      orders: 0,
    };
  });
  return { channel, daily };
}

function generateStore(store: WebStore, seed: number): StoreSeries {
  const rand = mulberry(seed);
  const baseVisitors = 1_400 + rand() * 6_200;
  const conversion = 0.018 + rand() * 0.028; // 1.8%–4.6%
  const aov = 38 + rand() * 64; // average order value $38–$102
  const unitsPerOrder = 1.1 + rand() * 0.9;
  const dates = lastNDates(DAYS);
  const daily: DailyPoint[] = dates.map((date, i) => {
    const d = new Date(date);
    const dow = d.getDay();
    // Stores convert better on weekdays for these audiences.
    const weekdayBoost = dow === 0 || dow === 6 ? 0.85 : 1.05;
    const trend = 1 + (i / DAYS) * 0.18;
    const noise = 0.7 + rand() * 0.6;
    const visitors = Math.round(baseVisitors * trend * noise);
    const conv = conversion * weekdayBoost * (0.85 + rand() * 0.3);
    const orders = Math.max(0, Math.round(visitors * conv));
    const units = Math.round(orders * unitsPerOrder);
    const storeRevenue = orders * aov * (0.9 + rand() * 0.2);
    return {
      date,
      views: 0,
      ytRevenue: 0,
      units,
      storeRevenue,
      visitors,
      orders,
    };
  });
  return { store, daily };
}

export const channelSeries: ChannelSeries[] = channels.map((c, i) => generateChannel(c, 1000 + i * 37));
export const storeSeries: StoreSeries[] = stores.map((s, i) => generateStore(s, 5000 + i * 41));

// --- Aggregation helpers --------------------------------------------------

export type DateRange = 7 | 30 | 90;

export function sliceDaily<T extends { date: string }>(daily: T[], range: DateRange): T[] {
  return daily.slice(-range);
}

export type ChannelTotals = {
  channel: YouTubeChannel;
  views: number;
  revenue: number;
  prevViews: number;
  prevRevenue: number;
};

export function channelTotals(series: ChannelSeries, range: DateRange): ChannelTotals {
  const current = sliceDaily(series.daily, range);
  const prevStart = Math.max(0, series.daily.length - range * 2);
  const previous = series.daily.slice(prevStart, prevStart + range);
  const sum = (arr: DailyPoint[], key: keyof DailyPoint) =>
    arr.reduce((acc, p) => acc + (p[key] as number), 0);
  return {
    channel: series.channel,
    views: sum(current, "views"),
    revenue: sum(current, "ytRevenue"),
    prevViews: sum(previous, "views"),
    prevRevenue: sum(previous, "ytRevenue"),
  };
}

export type StoreTotals = {
  store: WebStore;
  units: number;
  revenue: number;
  visitors: number;
  orders: number;
  prevUnits: number;
  prevRevenue: number;
  prevVisitors: number;
  prevOrders: number;
};

export function storeTotals(series: StoreSeries, range: DateRange): StoreTotals {
  const current = sliceDaily(series.daily, range);
  const prevStart = Math.max(0, series.daily.length - range * 2);
  const previous = series.daily.slice(prevStart, prevStart + range);
  const sum = (arr: DailyPoint[], key: keyof DailyPoint) =>
    arr.reduce((acc, p) => acc + (p[key] as number), 0);
  return {
    store: series.store,
    units: sum(current, "units"),
    revenue: sum(current, "storeRevenue"),
    visitors: sum(current, "visitors"),
    orders: sum(current, "orders"),
    prevUnits: sum(previous, "units"),
    prevRevenue: sum(previous, "storeRevenue"),
    prevVisitors: sum(previous, "visitors"),
    prevOrders: sum(previous, "orders"),
  };
}

export function conversionRate(visitors: number, orders: number): number {
  return visitors === 0 ? 0 : orders / visitors;
}

export function pctDelta(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

// Combines selected channels (or all) and selected stores (or all) into a
// single per-day time series — used by Overview charts.
export function combinedDaily(
  channelIds: string[] | "all",
  storeIds: string[] | "all",
  range: DateRange,
): DailyPoint[] {
  const includedChannels = channelIds === "all" ? channelSeries : channelSeries.filter((s) => channelIds.includes(s.channel.id));
  const includedStores = storeIds === "all" ? storeSeries : storeSeries.filter((s) => storeIds.includes(s.store.id));
  const dates = lastNDates(DAYS).slice(-range);
  return dates.map((date) => {
    let views = 0,
      ytRevenue = 0,
      units = 0,
      storeRevenue = 0,
      visitors = 0,
      orders = 0;
    for (const s of includedChannels) {
      const p = s.daily.find((x) => x.date === date);
      if (p) {
        views += p.views;
        ytRevenue += p.ytRevenue;
      }
    }
    for (const s of includedStores) {
      const p = s.daily.find((x) => x.date === date);
      if (p) {
        units += p.units;
        storeRevenue += p.storeRevenue;
        visitors += p.visitors;
        orders += p.orders;
      }
    }
    return { date, views, ytRevenue, units, storeRevenue, visitors, orders };
  });
}
