import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manutencoes")({
  head: () => ({
    meta: [
      { title: "Manutenções — FrotaManager FSPH" },
      { name: "description", content: "Manutenções da frota da FSPH." },
      { property: "og:title", content: "Manutenções — FrotaManager FSPH" },
      { property: "og:description", content: "Manutenções da frota da FSPH." },
    ],
  }),
  component: () => (
    <div className="p-7">
      <h1 className="text-2xl font-bold">Manutenções</h1>
      <p className="mt-1 text-sm text-muted-foreground">Módulo em construção.</p>
    </div>
  ),
});
