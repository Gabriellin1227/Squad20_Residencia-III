import { useRef, useState } from "react";
import { AlertCircle, Calendar, Check, CircleUser, Info, Mail, Phone, Plus, Upload, User, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CATEGORIAS_CNH,
  FROTA_OPCOES,
  STATUS_OPCOES,
  VEICULOS_DISPONIVEIS,
  type Motorista,
  type MotoristaInput,
} from "@/types/motorista";
import {
  maskCNH,
  maskCPF,
  maskData,
  maskTelefone,
  isoToBR,
  parseDataBR,
  validarMotorista,
  type FormErrors,
  type FormValues,
} from "@/utils/validation";

const empty: FormValues = {
  nome: "", cpf: "", telefone: "", email: "", foto: undefined, cnh: "",
  categoria: "" as FormValues["categoria"], validadeCnh: "", frota: "", veiculos: [], coringa: false, status: "Ativo",
};

const inputCls =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-[13px] placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring aria-[invalid=true]:border-destructive";

function Field({ id, label, error, icon: Icon, children }: { id: string; label: string; error?: string | undefined; icon?: typeof User | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold">{label}</label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
        {children}
      </div>
      {error && <p id={`${id}-err`} className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[15px] font-bold text-primary">{title}</h2>
        <span className="text-[10px] text-muted-foreground">{hint}</span>
      </div>
      {children}
    </section>
  );
}

export function MotoristaForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Motorista | undefined;
  onSubmit: (data: MotoristaInput) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState<FormValues>(() =>
    initial ? { ...initial, validadeCnh: isoToBR(initial.validadeCnh) } : empty,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [veiculoSel, setVeiculoSel] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormValues>(k: K, val: FormValues[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };
  const a11y = (k: keyof FormValues) => ({ id: k, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  const onFoto = (f?: File) => {
    if (!f) return;
    if (!["image/jpeg", "image/png"].includes(f.type)) { toast.error("Envie uma imagem JPG ou PNG."); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("A imagem deve ter até 5 MB."); return; }
    const r = new FileReader();
    r.onload = () => set("foto", r.result as string);
    r.readAsDataURL(f);
  };

  const addVeiculo = () => {
    if (!veiculoSel || v.veiculos.includes(veiculoSel)) return;
    set("veiculos", [...v.veiculos, veiculoSel]);
    setVeiculoSel("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validarMotorista(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Corrija os campos destacados.");
      document.getElementById(Object.keys(errs)[0] ?? "")?.focus();
      return;
    }
    onSubmit({ ...v, nome: v.nome.trim(), email: v.email.trim(), validadeCnh: parseDataBR(v.validadeCnh)! });
  };

  const disponiveis = VEICULOS_DISPONIVEIS.filter((x) => !v.veiculos.includes(x));

  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-xl border bg-card p-5 shadow-card md:p-6">
      <div className="flex items-center justify-between gap-3 rounded-md bg-info-soft px-3 py-2 text-[11px] text-primary">
        <span className="flex items-center gap-2"><Info className="size-3.5" /> Os dados serão validados antes de salvar o cadastro.</span>
        <span className="font-semibold">* Campos obrigatórios</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[140px_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div className="grid size-28 place-items-center overflow-hidden rounded-full border-2 border-primary/20 bg-info-soft text-primary">
            {v.foto ? <img src={v.foto} alt="Foto do motorista" className="size-full object-cover" /> : (
              <div className="flex flex-col items-center text-xs font-semibold"><CircleUser className="size-7" />Foto</div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="sr-only" aria-label="Arquivo da foto" onChange={(e) => onFoto(e.target.files?.[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 rounded-md border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-info-soft">
            <Upload className="size-3.5" /> Enviar foto
          </button>
          <p className="text-[10px] text-muted-foreground">JPG ou PNG · até 5 MB</p>
        </div>

        <div className="space-y-7">
          <Section title="Dados pessoais" hint="Identificação e contato">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="nome" label="Nome completo *" error={errors.nome}>
                <input {...a11y("nome")} className={inputCls} placeholder="Ex.: João da Silva" value={v.nome} onChange={(e) => set("nome", e.target.value)} />
              </Field>
              <Field id="cpf" label="CPF *" error={errors.cpf} icon={User}>
                <input {...a11y("cpf")} inputMode="numeric" className={cn(inputCls, "pl-9")} placeholder="000.000.000-00" value={v.cpf} onChange={(e) => set("cpf", maskCPF(e.target.value))} />
              </Field>
              <Field id="telefone" label="Telefone *" error={errors.telefone} icon={Phone}>
                <input {...a11y("telefone")} inputMode="tel" className={cn(inputCls, "pl-9")} placeholder="(79) 00000-0000" value={v.telefone} onChange={(e) => set("telefone", maskTelefone(e.target.value))} />
              </Field>
              <Field id="email" label="E-mail *" error={errors.email} icon={Mail}>
                <input {...a11y("email")} type="email" className={cn(inputCls, "pl-9")} placeholder="email@exemplo.com" value={v.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Habilitação (CNH)" hint="Documento obrigatório para viagens">
            <div className="grid gap-4 md:grid-cols-3">
              <Field id="cnh" label="Nº da CNH *" error={errors.cnh}>
                <input {...a11y("cnh")} inputMode="numeric" className={inputCls} placeholder="00000000000" value={v.cnh} onChange={(e) => set("cnh", maskCNH(e.target.value))} />
              </Field>
              <Field id="categoria" label="Categoria *" error={errors.categoria}>
                <select {...a11y("categoria")} className={inputCls} value={v.categoria} onChange={(e) => set("categoria", e.target.value as FormValues["categoria"])}>
                  <option value="">Selecione</option>
                  {CATEGORIAS_CNH.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field id="validadeCnh" label="Validade *" error={errors.validadeCnh} icon={Calendar}>
                <input {...a11y("validadeCnh")} inputMode="numeric" className={cn(inputCls, "pl-9")} placeholder="dd/mm/aaaa" value={v.validadeCnh} onChange={(e) => set("validadeCnh", maskData(e.target.value))} />
              </Field>
            </div>
            <p className="flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-[11px] text-destructive">
              <AlertCircle className="size-3.5 shrink-0" /> CNH vencida bloqueia o motorista automaticamente para novas viagens. A validade deve ser posterior à data de hoje.
            </p>
          </Section>

          <Section title="Vínculo com a frota" hint="Alocação e disponibilidade operacional">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="frota" label={v.coringa ? "Frota" : "Frota *"} error={errors.frota}>
                <select {...a11y("frota")} className={inputCls} value={v.frota} onChange={(e) => set("frota", e.target.value as FormValues["frota"])}>
                  <option value="">Selecione (Administrativa, SVO...)</option>
                  {FROTA_OPCOES.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <div className="space-y-1.5">
                <label htmlFor="veiculoSel" className="text-xs font-semibold">Veículo(s) vinculado(s)</label>
                <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input px-2 py-1.5">
                  {v.veiculos.map((p) => (
                    <span key={p} className="flex items-center gap-1 rounded-full bg-info-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {p}
                      <button type="button" aria-label={`Remover ${p}`} onClick={() => set("veiculos", v.veiculos.filter((x) => x !== p))}><X className="size-3" /></button>
                    </span>
                  ))}
                  <select id="veiculoSel" aria-label="Escolher veículo" className="h-7 rounded border-0 bg-transparent text-[12px] focus-visible:outline-2 focus-visible:outline-ring" value={veiculoSel} onChange={(e) => setVeiculoSel(e.target.value)}>
                    <option value="">Veículo…</option>
                    {disponiveis.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <button type="button" onClick={addVeiculo} disabled={!veiculoSel} className="flex items-center gap-0.5 text-[11px] font-semibold text-primary disabled:opacity-40">
                    <Plus className="size-3" /> adicionar
                  </button>
                </div>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-highlight bg-warning-soft px-3 py-2.5">
              <input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={v.coringa} onChange={(e) => { set("coringa", e.target.checked); setErrors((x) => { const n = { ...x }; delete n.frota; return n; }); }} />
              <span className="flex-1">
                <span className="block text-xs font-semibold">Motorista coringa — pode atuar em todas as frotas (inclusive SVO)</span>
                <span className="block text-[10px] text-warning">Ao marcar, o vínculo específico de frota deixa de ser obrigatório.</span>
              </span>
              <Info className="size-4 text-warning" />
            </label>
          </Section>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="w-full max-w-sm">
              <Field id="status" label="Status *" error={errors.status}>
                <select {...a11y("status")} className={inputCls} value={v.status} onChange={(e) => set("status", e.target.value as FormValues["status"])}>
                  {STATUS_OPCOES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <p className="mt-1.5 text-[10px] text-muted-foreground">O motorista ficará disponível para novos vínculos após a validação.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onCancel} className="h-10 rounded-md border bg-card px-4 text-xs font-semibold hover:bg-muted">Cancelar</button>
              <button type="submit" className="flex h-10 items-center gap-1.5 rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                <Check className="size-4" /> Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
