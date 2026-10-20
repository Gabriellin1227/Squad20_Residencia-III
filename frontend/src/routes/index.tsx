import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — FrotaManager FSPH" },
      { name: "description", content: "Painel inicial do FrotaManager, gestão de frota da FSPH." },
      { property: "og:title", content: "Início — FrotaManager FSPH" },
      { property: "og:description", content: "Painel inicial do FrotaManager, gestão de frota da FSPH." },
    ],
  }),
  component: () => (
    <div className="p-7">
      <h1 className="text-2xl font-bold">Bem-vindo ao FrotaManager</h1>
      <p className="mt-1 text-sm text-muted-foreground">Gestão de Frota - FSPH</p>
      <Link to="/motoristas" className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Ir para Motoristas</Link>
    </div>
  ),
});
