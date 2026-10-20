import { createFileRoute } from "@tanstack/react-router";
import { CadastroMotoristaPage } from "@/pages/CadastroMotoristaPage";

export const Route = createFileRoute("/motoristas/editar/$id")({
  head: () => ({ meta: [{ title: "Editar Motorista — FrotaManager" }, { name: "description", content: "Atualize os dados de um motorista da frota." }, { property: "og:title", content: "Editar Motorista — FrotaManager" }, { property: "og:description", content: "Atualize os dados de um motorista da frota." }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <CadastroMotoristaPage id={id} />;
}
