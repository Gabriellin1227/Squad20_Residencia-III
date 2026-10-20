import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — FrotaManager FSPH" },
      { name: "description", content: "Perfil da frota da FSPH." },
      { property: "og:title", content: "Perfil — FrotaManager FSPH" },
      { property: "og:description", content: "Perfil da frota da FSPH." },
    ],
  }),
  component: () => (
    <div className="p-7">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <p className="mt-1 text-sm text-muted-foreground">Módulo em construção.</p>
    </div>
  ),
});
