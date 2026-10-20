import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/abastecimentos")({
  head: () => ({
    meta: [
      { title: "Abastecimentos — FrotaManager FSPH" },
      { name: "description", content: "Abastecimentos da frota da FSPH." },
      { property: "og:title", content: "Abastecimentos — FrotaManager FSPH" },
      { property: "og:description", content: "Abastecimentos da frota da FSPH." },
    ],
  }),
  component: () => (
    <div className="p-7">
      <h1 className="text-2xl font-bold">Abastecimentos</h1>
      <p className="mt-1 text-sm text-muted-foreground">Módulo em construção.</p>
    </div>
  ),
});
