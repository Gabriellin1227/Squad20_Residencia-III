import { hashPassword, verifyPassword } from "./password";

describe("senhas", () => {
  it("valida senha correta e rejeita senha incorreta", async () => {
    const hash = await hashPassword("senha-de-teste-longa");
    expect(hash).not.toContain("senha-de-teste-longa");
    expect(await verifyPassword("senha-de-teste-longa", hash)).toBe(true);
    expect(await verifyPassword("outra-senha", hash)).toBe(false);
  });
  it("gera salts diferentes para a mesma senha", async () => {
    expect(await hashPassword("senha-de-teste-longa")).not.toBe(
      await hashPassword("senha-de-teste-longa"),
    );
  });
  it.each(["", "texto-invalido", "scrypt:abc:def"])(
    "rejeita hash inválido %s",
    async (hash) => {
      expect(await verifyPassword("teste", hash)).toBe(false);
    },
  );
});
