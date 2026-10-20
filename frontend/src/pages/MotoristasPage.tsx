import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, Plus, Search, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MotoristasTable } from "@/pages/Motoristas/components/MotoristasTable";
import { StatCard } from "@/components/StatCard";
import { FROTA_OPCOES, STATUS_OPCOES, type Motorista } from "@/types/motorista";
import { excluirMotorista, useMotoristas } from "@/utils/storage";
import { situacaoCNH, statusEfetivo } from "@/utils/validation";

const PAGE_SIZE = 6;
const selCls = "h-10 rounded-md border border-input bg-card px-3 text-[13px] focus-visible:outline-2 focus-visible:outline-ring";

export function MotoristasPage() {
  const list = useMotoristas() ?? [];
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [frota, setFrota] = useState("");
  const [page, setPage] = useState(1);
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const [toDelete, setToDelete] = useState<Motorista | null>(null);

  const stats = useMemo(() => {
    const ativos = list.filter((m) => statusEfetivo(m) === "Ativo").length;
    const vencendo = list.filter((m) => situacaoCNH(m.validadeCnh) === "vencendo").length;
    const vencidas = list.filter((m) => situacaoCNH(m.validadeCnh) === "vencida").length;
    const bloqueios = list.filter((m) => statusEfetivo(m) === "Bloqueado").length;
    return { ativos, vencendo, vencidas, bloqueios };
  }, [list]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return list.filter((m) => {
      if (term && !m.nome.toLowerCase().includes(term) && !m.cnh.includes(term)) return false;
      if (status && statusEfetivo(m) !== status) return false;
      if (frota && !(m.coringa || m.frota === frota)) return false;
      if (onlyAlerts && situacaoCNH(m.validadeCnh) === "regular") return false;
      return true;
    });
  }, [list, q, status, frota, onlyAlerts]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages);
  const rows = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);
  const alertCount = stats.vencendo + stats.vencidas;
  const reset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1); };

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 md:p-7">
      <header>
        <h1 className="text-2xl font-bold">Gerenciamento de Motoristas</h1>
        <p className="text-sm text-muted-foreground">Motoristas cadastrados, vínculos com veículos e situação da CNH</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard icon={UserCheck} tone="success" label="Motoristas ativos" value={stats.ativos} hint={`de ${list.length} cadastrados`} />
        <StatCard icon={CalendarClock} tone="warning" label="CNHs próximas do vencimento" value={stats.vencendo} hint="exigem atenção em 30 dias" />
        <StatCard icon={UserX} tone="danger" label="Bloqueios operacionais" value={stats.bloqueios} hint={`${stats.vencidas} CNH vencida${stats.vencidas === 1 ? "" : "s"}`} />
      </div>

      {alertCount > 0 && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-destructive/30 bg-danger-soft px-4 py-2.5 text-xs font-semibold text-destructive">
          <span className="flex items-center gap-2">
            <AlertTriangle className="size-4" />
            {alertCount} motorista{alertCount > 1 ? "s" : ""} com CNH vencida ou a vencer em 30 dias — ficam bloqueados para novas viagens.
          </span>
          <button type="button" onClick={() => { setOnlyAlerts((x) => !x); setPage(1); }} className="rounded-full bg-card px-3 py-1 text-[11px] hover:bg-background">
            {onlyAlerts ? "Mostrar todos" : "Revisar alertas"}
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1 md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input aria-label="Buscar por nome ou CNH" placeholder="Buscar por nome ou CNH..." value={q} onChange={(e) => reset(setQ)(e.target.value)} className={`${selCls} w-full pl-9`} />
        </div>
        <select aria-label="Filtrar por status" value={status} onChange={(e) => reset(setStatus)(e.target.value)} className={`${selCls} w-36`}>
          <option value="">Status: Todos</option>
          {STATUS_OPCOES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="Filtrar por frota" value={frota} onChange={(e) => reset(setFrota)(e.target.value)} className={`${selCls} w-36`}>
          <option value="">Frota: Todas</option>
          {FROTA_OPCOES.map((f) => <option key={f}>{f}</option>)}
        </select>
        <Link to="/motoristas/novo" className="ml-auto flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> Novo Motorista
        </Link>
      </div>

      <MotoristasTable rows={rows} onDelete={setToDelete} />

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Mostrando {rows.length} de {filtered.length} motoristas <span className="ml-1 opacity-70">Página {cur} de {pages}</span>
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)} className="h-9 rounded-md border bg-card px-4 font-semibold text-foreground disabled:opacity-40">Anterior</button>
          <button type="button" disabled={cur >= pages} onClick={() => setPage(cur + 1)} className="h-9 rounded-md border border-primary bg-card px-4 font-semibold text-primary disabled:opacity-40">Próxima</button>
        </div>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir motorista?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.nome} será removido permanentemente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (toDelete) { excluirMotorista(toDelete.id); toast.success("Motorista excluído."); } setToDelete(null); }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
