import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Home, Truck, Users, Fuel, Wrench, Route as RouteIcon, BarChart3, User,
  Camera, ShieldCheck, LogOut, Eye, EyeOff, Menu,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perfil de Usuário — FrotaManager" },
      { name: "description", content: "Gerencie seus dados cadastrais e preferências de acesso no FrotaManager." },
      { property: "og:title", content: "Perfil de Usuário — FrotaManager" },
      { property: "og:description", content: "Gerencie seus dados cadastrais e preferências de acesso no FrotaManager." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const nav = [
  { label: "Início", icon: Home },
  { label: "Veículos", icon: Truck },
  { label: "Motoristas", icon: Users },
  { label: "Abastecimentos", icon: Fuel },
  { label: "Manutenções", icon: Wrench },
  { label: "Viagens", icon: RouteIcon },
  { label: "Relatórios", icon: BarChart3 },
  { label: "Perfil", icon: User },
];

function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[160px] flex-col bg-sidebar text-sidebar-foreground transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">FM</div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-sidebar-accent-foreground">FrotaManager</p>
          <p className="truncate text-[9px] opacity-70">Gestão de Frotas - FSPH</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {nav.map(({ label, icon: Icon }) => {
          const active = label === "Perfil";
          return (
                        <button
              key={label}
              type="button"
              className={cn(
                "relative flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                active
                  ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-md before:bg-highlight"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-2 px-3 py-5">
        <div className="h-7 w-7 rounded-full bg-accent" />
        <div>
          <p className="text-[11px] font-semibold text-sidebar-accent-foreground">Gestor de Frota</p>
          <button className="flex items-center gap-1 text-[10px] text-destructive/90 hover:text-destructive">
            <LogOut className="h-2.5 w-2.5" /> Sair
          </button>
        </div>
      </div>
    </aside>
  );
}

function PasswordField({ id, label, value, onChange, error }: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string | undefined;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs">{label}</Label>
      <div className="relative">
        <Input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} className="pr-9" />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [errors, setErrors] = useState<{ cur?: string; next?: string; conf?: string }>({});

  const reset = () => { setCur(""); setNext(""); setConf(""); setErrors({}); };
  const submit = () => {
    const e: { cur?: string; next?: string; conf?: string } = {};
    if (!cur) e.cur = "Informe a senha atual.";
    if (!next) e.next = "Informe a nova senha.";
    else if (next.length < 8) e.next = "A nova senha deve ter ao menos 8 caracteres.";
    if (!conf) e.conf = "Confirme a nova senha.";
    else if (next && conf !== next) e.conf = "As senhas não coincidem.";
    setErrors(e);
    if (Object.keys(e).length) return;
    toast.success("Senha alterada com sucesso.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-heading">Alterar senha</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <PasswordField id="cur" label="Senha atual" value={cur} onChange={setCur} error={errors.cur} />
          <PasswordField id="next" label="Nova senha" value={next} onChange={setNext} error={errors.next} />
          <PasswordField id="conf" label="Confirmar nova senha" value={conf} onChange={setConf} error={errors.conf} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Salvar senha</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const initial = {
  email: "Digite seu e-mail",
  telefone: "Digite seu telefone",
  departamento: "Digite seu departamento",
  cargo: "Digite seu cargo",
  matricula: "Digite sua matrícula",
};


// const handleInputChange = (field: string, value: string) => {
//   setFormData((prev) => ({
//     ...prev,
//     [field]: value,
//   }));
// };


function Field({ id, label, value, onChange, disabled, className }: {
  id: string; label: string; value: string; onChange: (v: string) => void; disabled: boolean; className?: string | undefined;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-[11px] font-normal text-foreground">{label}</Label>
      <Input 
        id={id} 
        value={value} 
        readOnly={disabled} 
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()} // <-- A MÁGICA ACONTECE AQUI
        className="h-9 bg-card text-xs read-only:focus-visible:ring-0" 
      />
    </div>
  );
}

function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [data, setData] = useState(initial);
  const [editing, setEditing] = useState(true);
  const [pwOpen, setPwOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Selecione um arquivo de imagem válido."); return; }
    setPhoto(URL.createObjectURL(f));
    toast.success("Foto atualizada.");
  };
  const set = (k: keyof typeof initial) => (v: string) => setData((d) => ({ ...d, [k]: v }));
  const save = () => {
    if (!/^\S+@\S+\.\S+$/.test(data.email)) { toast.error("Informe um e-mail válido."); return; }
    setEditing(false);
    toast.success("Dados salvos com sucesso.");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar open={menuOpen} />
      {menuOpen && (
  <div 
    className="fixed inset-0 z-30 bg-foreground/30 md:hidden" 
    onClick={() => setMenuOpen(false)}
    role="button"
    tabIndex={0}
    aria-label="Fechar menu"
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') setMenuOpen(false);
    }}
  />
)}
      <main className="px-4 py-6 md:ml-[160px] md:px-7 md:py-8">
        <button className="mb-4 md:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
        <h1 className="text-2xl font-medium text-heading">Perfil de Usuário</h1>
        <p className="mt-1 text-xs text-muted-foreground">Gerencie seus dados cadastrais e preferências de acesso</p>

        <section className="mt-6 flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:py-7">
          <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-accent-foreground/20 bg-accent text-2xl text-accent-foreground">
            {photo ? <img src={photo} alt="Foto de perfil" className="h-full w-full object-cover" /> : "GS"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-heading">Gabriel Santos</h2>
            <p className="text-xs text-muted-foreground">Gestor de Frota · Matrícula 006842</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-success"><ShieldCheck className="h-3.5 w-3.5" /> Perfil verificado</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <Button variant="outline" size="sm" className="self-start text-xs font-semibold sm:self-center" onClick={() => fileRef.current?.click()}>
            <Camera className="h-3.5 w-3.5" /> Alterar foto
          </Button>
        </section>

        <section className="mt-4 rounded-lg border bg-card p-5 shadow-card">
          <h3 className="text-sm font-medium text-primary">Dados Cadastrais</h3>
          <div className="mt-3 grid gap-x-3 gap-y-4 sm:grid-cols-2">
            <Field id="email" label="E-mail" value={data.email} onChange={set("email")} disabled={!editing} />
            <Field id="tel" label="Telefone" value={data.telefone} onChange={set("telefone")} disabled={!editing} />
            <Field id="dep" label="Departamento" value={data.departamento} onChange={set("departamento")} disabled={!editing} className="sm:col-span-2" />
            <Field id="cargo" label="Cargo" value={data.cargo} onChange={set("cargo")} disabled={!editing} />
            <Field id="mat" label="Matrícula" value={data.matricula} onChange={set("matricula")} disabled={!editing} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-3">
            <div>
              <p className="text-xs font-semibold text-heading">Senha de acesso</p>
              <p className="text-[10px] text-muted-foreground">Última alteração há 48 dias</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs font-semibold" onClick={() => setPwOpen(true)}>Alterar senha</Button>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" className="text-xs font-semibold"
              onClick={() => { if (editing) setData(initial); setEditing(!editing); }}>
              {editing ? "Cancelar" : "Editar"}
            </Button>
            <Button size="sm" className="text-xs font-semibold" onClick={save} disabled={!editing}>Salvar</Button>
          </div>
        </section>
      </main>
      <PasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
    </div>
  );
}
