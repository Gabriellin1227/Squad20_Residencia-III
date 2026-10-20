import { createFileRoute } from "@tanstack/react-router";
import { DetalheMotoristaPage } from "@/pages/DetalheMotoristaPage";

export const Route = createFileRoute("/motoristas/$id")({
  head: () => ({ meta: [{ title: "Detalhes do Motorista — FrotaManager" }, { name: "description", content: "Dados, CNH e vínculos do motorista." }, { property: "og:title", content: "Detalhes do Motorista — FrotaManager" }, { property: "og:description", content: "Dados, CNH e vínculos do motorista." }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <DetalheMotoristaPage id={id} />;
}
