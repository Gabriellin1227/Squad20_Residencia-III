import { createFileRoute } from "@tanstack/react-router";
import { CadastroMotoristaPage } from "@/pages/CadastroMotoristaPage";

export const Route = createFileRoute("/motoristas/novo")({
  head: () => ({ meta: [{ title: "Cadastro de Motorista — FrotaManager" }, { name: "description", content: "Cadastre um novo motorista da frota FSPH." }, { property: "og:title", content: "Cadastro de Motorista — FrotaManager" }, { property: "og:description", content: "Cadastre um novo motorista da frota FSPH." }] }),
  component: () => <CadastroMotoristaPage />,
});
