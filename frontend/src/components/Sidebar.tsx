import { Link } from "@tanstack/react-router";
import { BarChart3, Bus, Fuel, LayoutGrid, LogOut, Map, UserCircle, Users, Wrench } from "lucide-react";
import { toast } from "sonner";

const items = [
  { to: "/", label: "Início", icon: LayoutGrid, exact: true },
  { to: "/veiculos", label: "Veículos", icon: Bus },
  { to: "/motoristas", label: "Motoristas", icon: Users },
  { to: "/abastecimentos", label: "Abastecimentos", icon: Fuel },
  { to: "/manutencoes", label: "Manutenções", icon: Wrench },
  { to: "/viagens", label: "Viagens", icon: Map },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/perfil", label: "Perfil", icon: UserCircle },
] as const;

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:w-[148px] lg:w-[168px]">
      <div className="flex items-center gap-2 px-3 py-5">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          FM
        </div>
        <div className="hidden leading-tight md:block">
          <p className="text-sm font-bold text-sidebar-accent-foreground">Gestão de Frota</p>
          <p className="text-[10px] opacity-75">Módulo SVO</p>
        </div>
      </div>
      <nav aria-label="Principal" className="mt-2 flex flex-col gap-1 px-2">
        {items.map(({ to, label, icon: Icon, ...rest }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: "exact" in rest }}
            className="relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-ring data-[status=active]:bg-sidebar-primary data-[status=active]:font-semibold data-[status=active]:text-sidebar-primary-foreground data-[status=active]:before:absolute data-[status=active]:before:inset-y-0 data-[status=active]:before:left-0 data-[status=active]:before:w-1 data-[status=active]:before:rounded-l-md data-[status=active]:before:bg-highlight"
            title={label}
          >
            <Icon className="size-4 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-2 px-3 py-5">
        <div className="size-8 shrink-0 rounded-full bg-sidebar-foreground/80" />
        <div className="hidden leading-tight md:block">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">Gestor de Frota</p>
          <button
            type="button"
            onClick={() => toast.info("Sessão encerrada (demonstração).")}
            className="flex items-center gap-1 text-[11px] text-highlight hover:underline"
          >
            <LogOut className="size-3" /> Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
