import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SourceOption = { id: string; label: string };

export function SourcePicker({
  value,
  options,
  onChange,
  allLabel,
  width = "w-[240px]",
}: {
  value: string | "all";
  options: SourceOption[];
  onChange: (v: string | "all") => void;
  allLabel: string;
  width?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-9 ${width}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.id} value={o.id}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
