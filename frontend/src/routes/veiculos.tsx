import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/veiculos")({
  head: () => ({
    meta: [
      { title: "Veículos — FrotaManager FSPH" },
      { name: "description", content: "Veículos da frota da FSPH." },
      { property: "og:title", content: "Veículos — FrotaManager FSPH" },
      { property: "og:description", content: "Veículos da frota da FSPH." },
    ],
  }),
  component: () => (
    <div className="p-7">
      <h1 className="text-2xl font-bold">Veículos</h1>
      <p className="mt-1 text-sm text-muted-foreground">Módulo em construção.</p>
    </div>
  ),
});
