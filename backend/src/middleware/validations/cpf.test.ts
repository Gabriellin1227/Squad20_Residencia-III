import { cpfSchema, isValidCpf } from "./cpf";

describe("isValidCpf", () => {
  it("aceita um CPF com dígitos verificadores válidos", () => {
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita um CPF com dígito verificador incorreto", () => {
    expect(isValidCpf("52998224726")).toBe(false);
  });

  it("rejeita um CPF com todos os números iguais", () => {
    expect(isValidCpf("11111111111")).toBe(false);
  });

  it("rejeita um CPF com menos de 11 números", () => {
    expect(isValidCpf("123456")).toBe(false);
  });
});

describe("cpfSchema", () => {
  it("remove a pontuação de um CPF válido", () => {
    const resultado = cpfSchema.parse("529.982.247-25");

    expect(resultado).toBe("52998224725");
  });

  it("rejeita texto que não representa um CPF", () => {
    const resultado = cpfSchema.safeParse("abc");

    expect(resultado.success).toBe(false);
  });
});
