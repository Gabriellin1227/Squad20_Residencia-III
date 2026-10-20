import { Link } from "@tanstack/react-router";
import { CircleUser } from "lucide-react";
import { Pill, statusTone } from "@/components/StatusBadge";
import { useMotoristas } from "@/utils/storage";
import { isoToBR, podeNovasViagens, situacaoCNH, statusEfetivo } from "@/utils/validation";

export function DetalheMotoristaPage({ id }: { id: string }) {
  const list = useMotoristas();
  if (list === null) return null;
  const m = list.find((x) => x.id === id);
  if (!m) return <p className="p-7 text-sm text-muted-foreground">Motorista não encontrado. <Link to="/motoristas" className="text-primary underline">Voltar</Link></p>;
  const st = statusEfetivo(m);
  const sit = situacaoCNH(m.validadeCnh);
  const rows: [string, React.ReactNode][] = [
    ["CPF", m.cpf || "—"], ["Telefone", m.telefone || "—"], ["E-mail", m.email || "—"],
    ["CNH", `${m.cnh} · Categoria ${m.categoria}`],
    ["Validade CNH", <span key="v" className="flex items-center gap-2">{isoToBR(m.validadeCnh)} {sit !== "regular" && <Pill tone={sit === "vencida" ? "danger" : "warning"}>{sit === "vencida" ? "Vencida" : "Vence em breve"}</Pill>}</span>],
    ["Frota", m.coringa ? "Coringa — todas as frotas" : m.frota || "—"],
    ["Veículos", m.veiculos.join(", ") || "—"],
    ["Novas viagens", podeNovasViagens(m) ? "Liberado" : "Indisponível"],
  ];
  return (
    <div className="mx-auto max-w-3xl space-y-5 p-5 md:p-7">
      <nav aria-label="Breadcrumb" className="text-[11px] font-semibold text-primary">
        <Link to="/motoristas" className="hover:underline">Motoristas</Link> / Detalhes
      </nav>
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="grid size-20 place-items-center overflow-hidden rounded-full bg-info-soft text-primary">
            {m.foto ? <img src={m.foto} alt={m.nome} className="size-full object-cover" /> : <CircleUser className="size-8" />}
          </div>
          <div>
            <h1 className="text-xl font-bold">{m.nome}</h1>
            <Pill tone={statusTone[st]}>{st}</Pill>
          </div>
          <Link to="/motoristas/editar/$id" params={{ id: m.id }} className="ml-auto rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Editar</Link>
        </div>
        <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {rows.map(([k, val]) => (
            <div key={k}>
              <dt className="text-[11px] font-semibold text-muted-foreground">{k}</dt>
              <dd className="text-sm">{val}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
