import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DateRange } from "@/lib/mock-data";

export function RangeSelect({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v) as DateRange)}>
      <SelectTrigger className="h-9 w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7">Last 7 days</SelectItem>
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="90">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
}
