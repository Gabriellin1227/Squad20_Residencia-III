export type StatusMotorista = "Ativo" | "Em viagem" | "Férias" | "Bloqueado";
export type Frota = "Administrativa" | "SVO";

export const STATUS_OPCOES: StatusMotorista[] = ["Ativo", "Em viagem", "Férias", "Bloqueado"];
export const FROTA_OPCOES: Frota[] = ["Administrativa", "SVO"];
export const CATEGORIAS_CNH = ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"] as const;
export type CategoriaCNH = (typeof CATEGORIAS_CNH)[number];

export const VEICULOS_DISPONIVEIS = [
  "ABC-1D23",
  "IJK-7L89",
  "EFG-4H56",
  "MNO-0P12",
  "QRS-3T45",
  "UVW-6X78",
  "YZA-9B01",
];

export interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  foto?: string | undefined; // data URL
  cnh: string;
  categoria: CategoriaCNH;
  /** Validade da CNH em ISO (AAAA-MM-DD) */
  validadeCnh: string;
  frota: Frota | "";
  veiculos: string[];
  coringa: boolean;
  status: StatusMotorista;
  criadoEm: string;
}

export type MotoristaInput = Omit<Motorista, "id" | "criadoEm">;
