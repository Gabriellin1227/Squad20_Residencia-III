import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — FrotaManager FSPH" },
      { name: "description", content: "Relatórios da frota da FSPH." },
      { property: "og:title", content: "Relatórios — FrotaManager FSPH" },
      { property: "og:description", content: "Relatórios da frota da FSPH." },
    ],
  }),
  component: () => (
    <div className="p-7">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <p className="mt-1 text-sm text-muted-foreground">Módulo em construção.</p>
    </div>
  ),
});
