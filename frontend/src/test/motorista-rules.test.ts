import { describe, expect, it } from "vitest";
import { isCPFValido, situacaoCNH, statusEfetivo, validarMotorista, type FormValues } from "@/utils/validation";

const hoje = new Date(2026, 9, 19);
const base: FormValues = {
  nome: "João da Silva", cpf: "529.982.247-25", telefone: "(79) 99876-5432", email: "joao@x.com",
  cnh: "01234567890", categoria: "D", validadeCnh: "31/12/2027", frota: "Administrativa", veiculos: [], coringa: false, status: "Ativo",
};

describe("regras do motorista", () => {
  it("CNH vencida força status Bloqueado", () => {
    expect(statusEfetivo({ status: "Ativo", validadeCnh: "2026-07-31" }, hoje)).toBe("Bloqueado");
  });
  it("CNH vencendo em até 30 dias é alerta", () => {
    expect(situacaoCNH("2026-10-31", hoje)).toBe("vencendo");
    expect(situacaoCNH("2026-12-31", hoje)).toBe("regular");
  });
  it("não salva CNH vencida como Ativo", () => {
    expect(validarMotorista({ ...base, validadeCnh: "01/01/2026" }, hoje).validadeCnh).toBeDefined();
    expect(validarMotorista({ ...base, validadeCnh: "01/01/2026", status: "Bloqueado" }, hoje).validadeCnh).toBeUndefined();
  });
  it("frota obrigatória exceto para coringa", () => {
    expect(validarMotorista({ ...base, frota: "" }, hoje).frota).toBeDefined();
    expect(validarMotorista({ ...base, frota: "", coringa: true }, hoje).frota).toBeUndefined();
  });
  it("valida CPF pelos dígitos", () => {
    expect(isCPFValido("529.982.247-25")).toBe(true);
    expect(isCPFValido("111.111.111-11")).toBe(false);
  });
});
