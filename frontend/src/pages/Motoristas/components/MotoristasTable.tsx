import { Link } from "@tanstack/react-router";
import type { Motorista } from "@/types/motorista";
import { isoToMesAno, situacaoCNH, statusEfetivo } from "@/utils/validation";
import { Pill, statusTone } from "@/components/StatusBadge";

const btn =
  "rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring";

export function MotoristasTable({ rows, onDelete }: { rows: Motorista[]; onDelete: (m: Motorista) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card shadow-card">
      <table className="w-full min-w-[760px] text-left text-[13px]">
        <thead className="bg-info-soft text-[11px] font-semibold text-primary">
          <tr>
            {["Nome", "CNH", "Cat.", "Validade CNH", "Veículos vinculados", "Status", "Ações"].map((h) => (
              <th key={h} scope="col" className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                Nenhum motorista encontrado.
              </td>
            </tr>
          )}
          {rows.map((m) => {
            const sit = situacaoCNH(m.validadeCnh);
            const st = statusEfetivo(m);
            return (
              <tr key={m.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{m.nome}</td>
                <td className="px-4 py-3 tabular-nums">{m.cnh}</td>
                <td className="px-4 py-3">{m.categoria}</td>
                <td className="px-4 py-3">
                  {sit === "vencida" ? (
                    <Pill tone="danger">Vencida {isoToMesAno(m.validadeCnh)}</Pill>
                  ) : sit === "vencendo" ? (
                    <Pill tone="warning">Vence {isoToMesAno(m.validadeCnh)}</Pill>
                  ) : (
                    isoToMesAno(m.validadeCnh)
                  )}
                </td>
                <td className="px-4 py-3">
                  {m.coringa ? <Pill tone="info">Coringa · todas</Pill> : m.veiculos.join(", ") || "—"}
                </td>
                <td className="px-4 py-3"><Pill tone={statusTone[st]}>{st}</Pill></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <Link to="/motoristas/$id" params={{ id: m.id }} className={`${btn} border-primary text-primary hover:bg-info-soft`} aria-label={`Ver ${m.nome}`}>Ver</Link>
                    <Link to="/motoristas/editar/$id" params={{ id: m.id }} className={`${btn} border-primary/40 text-primary hover:bg-info-soft`} aria-label={`Editar ${m.nome}`}>Editar</Link>
                    <button type="button" onClick={() => onDelete(m)} className={`${btn} border-destructive text-destructive hover:bg-danger-soft`} aria-label={`Excluir ${m.nome}`}>Excluir</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
