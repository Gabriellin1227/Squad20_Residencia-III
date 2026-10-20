import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { MotoristaForm } from "@/pages/CadastroMotorista/components/MotoristaForm";
import { atualizarMotorista, criarMotorista, useMotoristas } from "@/utils/storage";

export function CadastroMotoristaPage({ id }: { id?: string }) {
  const navigate = useNavigate();
  const list = useMotoristas();
  const initial = id ? list?.find((m) => m.id === id) : undefined;
  const voltar = () => navigate({ to: "/motoristas" });

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 md:p-7">
      <header>
        <nav aria-label="Breadcrumb" className="text-[11px] font-semibold text-primary">
          <Link to="/motoristas" className="hover:underline">Motoristas</Link> / {id ? "Editar cadastro" : "Novo cadastro"}
        </nav>
        <h1 className="text-2xl font-bold">{id ? "Editar Motorista" : "Cadastro de Motorista"}</h1>
        <p className="text-sm text-muted-foreground">{id ? "Atualize os dados do motorista" : "Preencha os dados do novo motorista"}</p>
      </header>
      {id && list === null ? null : id && !initial ? (
        <p className="text-sm text-muted-foreground">Motorista não encontrado.</p>
      ) : (
        <MotoristaForm
          key={initial?.id ?? "novo"}
          initial={initial}
          onCancel={voltar}
          onSubmit={(data) => {
            try {
              if (id) atualizarMotorista(id, data);
              else criarMotorista(data);
              toast.success(id ? "Motorista atualizado." : "Motorista cadastrado com sucesso.");
              voltar();
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        />
      )}
    </div>
  );
}
