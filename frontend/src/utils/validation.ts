import type { Motorista, MotoristaInput, StatusMotorista } from "@/types/motorista";

/* ---------- Máscaras ---------- */
const digits = (v: string) => v.replace(/\D/g, "");

export function maskCPF(v: string) {
  return digits(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskTelefone(v: string) {
  const d = digits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskData(v: string) {
  return digits(v)
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

export const maskCNH = (v: string) => digits(v).slice(0, 11);

/* ---------- Validadores ---------- */
export function isCPFValido(cpf: string) {
  const d = digits(cpf);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}

export const isEmailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const isTelefoneValido = (t: string) => [10, 11].includes(digits(t).length);

/** "DD/MM/AAAA" -> "AAAA-MM-DD" ou null se data inexistente */
export function parseDataBR(v: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (d.getFullYear() !== Number(yyyy) || d.getMonth() !== Number(mm) - 1 || d.getDate() !== Number(dd))
    return null;
  return `${yyyy}-${mm}-${dd}`;
}

export function isoToBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function isoToMesAno(iso: string) {
  const [y, m] = iso.split("-");
  return `${m}/${y}`;
}

/* ---------- Regras de negócio da CNH ---------- */
export const DIAS_ALERTA_CNH = 30;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function diasParaVencer(validadeIso: string, hoje = new Date()) {
  const [y = 0, m = 1, d = 1] = validadeIso.split("-").map(Number);
  const venc = new Date(y, m - 1, d);
  return Math.round((venc.getTime() - startOfDay(hoje).getTime()) / 86_400_000);
}

export type SituacaoCNH = "regular" | "vencendo" | "vencida";

export function situacaoCNH(validadeIso: string, hoje = new Date()): SituacaoCNH {
  const dias = diasParaVencer(validadeIso, hoje);
  if (dias < 0) return "vencida";
  if (dias <= DIAS_ALERTA_CNH) return "vencendo";
  return "regular";
}

/** Status efetivo: CNH vencida sempre bloqueia, independentemente do status manual. */
export function statusEfetivo(m: Pick<Motorista, "status" | "validadeCnh">, hoje = new Date()): StatusMotorista {
  return situacaoCNH(m.validadeCnh, hoje) === "vencida" ? "Bloqueado" : m.status;
}

export const podeNovasViagens = (m: Pick<Motorista, "status" | "validadeCnh">, hoje = new Date()) =>
  statusEfetivo(m, hoje) === "Ativo";

/* ---------- Validação do formulário ---------- */
export interface FormValues extends Omit<MotoristaInput, "validadeCnh"> {
  validadeCnh: string; // DD/MM/AAAA
}
export type FormErrors = { [K in keyof FormValues]?: string | undefined };

export function validarMotorista(v: FormValues, hoje = new Date()): FormErrors {
  const e: FormErrors = {};
  if (v.nome.trim().split(/\s+/).length < 2) e.nome = "Informe o nome completo.";
  if (!isCPFValido(v.cpf)) e.cpf = "CPF inválido.";
  if (!isTelefoneValido(v.telefone)) e.telefone = "Telefone inválido.";
  if (!isEmailValido(v.email)) e.email = "E-mail inválido.";
  if (digits(v.cnh).length !== 11) e.cnh = "A CNH deve ter 11 dígitos.";
  if (!v.categoria) e.categoria = "Selecione a categoria.";
  const iso = parseDataBR(v.validadeCnh);
  if (!iso) e.validadeCnh = "Data inválida (DD/MM/AAAA).";
  else if (situacaoCNH(iso, hoje) === "vencida" && v.status !== "Bloqueado")
    e.validadeCnh = "CNH vencida: a validade deve ser posterior a hoje, ou o motorista deve ficar Bloqueado.";
  if (!v.coringa && !v.frota) e.frota = "Selecione a frota (ou marque motorista coringa).";
  if (!v.status) e.status = "Selecione o status.";
  return e;
}
