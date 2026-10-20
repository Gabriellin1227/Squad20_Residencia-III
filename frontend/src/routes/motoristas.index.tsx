import { createFileRoute } from "@tanstack/react-router";
import { MotoristasPage } from "@/pages/MotoristasPage";

export const Route = createFileRoute("/motoristas/")({
  head: () => ({ meta: [{ title: "Motoristas — FrotaManager" }, { name: "description", content: "Motoristas cadastrados, vínculos com veículos e situação da CNH." }, { property: "og:title", content: "Motoristas — FrotaManager" }, { property: "og:description", content: "Motoristas cadastrados, vínculos com veículos e situação da CNH." }] }),
  component: MotoristasPage,
});
