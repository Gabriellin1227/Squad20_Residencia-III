import { useEffect, useState } from "react";
import type { Motorista, MotoristaInput } from "@/types/motorista";

const KEY = "frotamanager:motoristas";
const EVENT = "motoristas-changed";

const seed = (
  nome: string,
  cnh: string,
  categoria: Motorista["categoria"],
  validadeCnh: string,
  veiculos: string[],
  status: Motorista["status"],
  extra: Partial<Motorista> = {},
): Motorista => ({
  id: cnh,
  nome,
  cpf: "",
  telefone: "",
  email: `${(nome.split(" ")[0] ?? "").toLowerCase()}@fsph.se.gov.br`,
  cnh,
  categoria,
  validadeCnh,
  frota: "Administrativa",
  veiculos,
  coringa: false,
  status,
  criadoEm: new Date().toISOString(),
  ...extra,
});

// Dados demonstrativos
const SEED: Motorista[] = [
  seed("João da Silva", "0123456789", "D", "2027-12-31", ["ABC-1D23", "IJK-7L89"], "Ativo", { cpf: "529.982.247-25", telefone: "(79) 99876-5432" }),
  seed("Maria Oliveira", "9876543210", "B", "2026-10-31", ["EFG-4H56"], "Ativo"),
  seed("Carlos Souza", "4567891230", "E", "2028-08-31", [], "Em viagem", { coringa: true, frota: "" }),
  seed("Ana Pereira", "3216549870", "C", "2026-07-31", [], "Bloqueado"),
  seed("Pedro Santos", "7418529630", "D", "2027-11-30", ["MNO-0P12"], "Ativo"),
  seed("Lucas Almeida", "8529637410", "B", "2029-03-31", ["QRS-3T45"], "Férias"),
  seed("Fernanda Lima", "1597534860", "B", "2028-05-31", ["UVW-6X78"], "Ativo", { frota: "SVO" }),
  seed("Rafael Costa", "7531594560", "D", "2027-06-30", ["YZA-9B01"], "Ativo", { frota: "SVO" }),
];

export function getMotoristas(): Motorista[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED));
    return SEED;
  }
  try {
    return JSON.parse(raw) as Motorista[];
  } catch {
    return [];
  }
}

function save(list: Motorista[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export const getMotorista = (id: string) => getMotoristas().find((m) => m.id === id);

export function criarMotorista(input: MotoristaInput) {
  const list = getMotoristas();
  if (list.some((m) => m.cnh === input.cnh)) throw new Error("Já existe um motorista com essa CNH.");
  const novo: Motorista = { ...input, id: crypto.randomUUID(), criadoEm: new Date().toISOString() };
  save([novo, ...list]);
  return novo;
}

export function atualizarMotorista(id: string, input: MotoristaInput) {
  const list = getMotoristas();
  if (list.some((m) => m.cnh === input.cnh && m.id !== id)) throw new Error("Já existe um motorista com essa CNH.");
  save(list.map((m) => (m.id === id ? { ...m, ...input } : m)));
}

export function excluirMotorista(id: string) {
  save(getMotoristas().filter((m) => m.id !== id));
}

/** Lista reativa (lida após a hidratação). */
export function useMotoristas() {
  const [list, setList] = useState<Motorista[] | null>(null);
  useEffect(() => {
    const load = () => setList(getMotoristas());
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);
  return list;
}
