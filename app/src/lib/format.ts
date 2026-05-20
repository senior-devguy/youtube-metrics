const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("en-US");
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const currencyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 2 });

export const formatNumber = (n: number) => integer.format(Math.round(n));
export const formatCompact = (n: number) => compact.format(n);
export const formatCurrency = (n: number) => currency.format(n);
export const formatCurrencyCompact = (n: number) => currencyCompact.format(n);
export const formatPercent = (n: number) => percent.format(n);

export function formatDelta(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(1)}%`;
}
