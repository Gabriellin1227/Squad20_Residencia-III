import { cn } from "@/lib/utils";

const tones = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-destructive",
  info: "bg-info-soft text-primary",
};

export function Pill({ tone, children }: { tone: keyof typeof tones; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", tones[tone])}>
      {children}
    </span>
  );
}

export const statusTone = {
  Ativo: "success",
  "Em viagem": "info",
  Férias: "warning",
  Bloqueado: "danger",
} as const;
