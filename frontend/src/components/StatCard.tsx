import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-destructive",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
  tone: keyof typeof tones;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-card">
      <div className={cn("grid size-9 place-items-center rounded-md", tones[tone])}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="flex items-baseline gap-2">
          <span className="text-xl font-bold">{value}</span>
          <span className={cn("text-[11px]", tones[tone].split(" ")[1])}>{hint}</span>
        </p>
      </div>
    </div>
  );
}
