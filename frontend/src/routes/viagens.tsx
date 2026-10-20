import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/viagens")({
  head: () => ({
    meta: [
      { title: "Viagens — FrotaManager FSPH" },
      { name: "description", content: "Viagens da frota da FSPH." },
      { property: "og:title", content: "Viagens — FrotaManager FSPH" },
      { property: "og:description", content: "Viagens da frota da FSPH." },
    ],
  }),
  component: () => (
    <div className="p-7">
      <h1 className="text-2xl font-bold">Viagens</h1>
      <p className="mt-1 text-sm text-muted-foreground">Módulo em construção.</p>
    </div>
  ),
});
